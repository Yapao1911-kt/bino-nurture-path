import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

if (process.env.VERCEL_ENV !== "production") {
  console.log("[release] Preview: production migration step skipped.");
  process.exit(0);
}
if (process.env.BINO_RELEASE_MIGRATIONS !== "1")
  throw new Error("Production migration gate is not enabled.");
if (!process.env.DIRECT_URL || !process.env.DATABASE_URL)
  throw new Error("Database environment is incomplete.");
const db = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL } } });
const baseline = "202611130001_baseline";
const operational = "202611130002_operational_core";
const tables = ["User", "Child", "Resource", "ActivityEntry", "Roadmap", "Appointment"];
const q = (value) => '"' + value.replaceAll('"', '""') + '"';
function migrate(...args) {
  const r = spawnSync(
    process.execPath,
    ["node_modules/prisma/build/index.js", "migrate", ...args],
    { stdio: "inherit", env: process.env },
  );
  if (r.status !== 0)
    throw new Error("Prisma migration command failed. Production release stopped.");
}
try {
  const columns =
    await db.$queryRaw`SELECT table_name,column_name,data_type,is_nullable FROM information_schema.columns WHERE table_schema='public'`;
  const present = new Set(columns.map((c) => c.table_name));
  let history = [];
  if (present.has("_prisma_migrations"))
    history = await db.$queryRawUnsafe(
      'SELECT migration_name,finished_at,rolled_back_at FROM public."_prisma_migrations"',
    );
  if (history.some((m) => !m.finished_at && !m.rolled_back_at))
    throw new Error("An unfinished migration exists; manual inspection required.");
  if (history.some((m) => m.migration_name === operational && m.finished_at)) {
    console.log("[release] Operational migration already applied.");
  } else {
    if (
      history.some((m) => ![baseline, operational].includes(m.migration_name) && !m.rolled_back_at)
    )
      throw new Error("Unknown migration history; refusing automatic baselining.");
    const existing = tables.filter((t) => present.has(t));
    if (existing.length) {
      if (
        !["User", "Child", "Resource"].every((t) => present.has(t)) ||
        ["ActivityEntry", "Roadmap", "Appointment"].some((t) => present.has(t))
      )
        throw new Error("Unexpected application schema; release stopped.");
      const baselineSql = readFileSync("prisma/migrations/" + baseline + "/migration.sql", "utf8");
      for (const match of baselineSql.matchAll(/CREATE TABLE "(\w+)" \(([\s\S]*?)\n\);/g)) {
        const actual = columns.filter((c) => c.table_name === match[1]);
        const expected = [
          ...match[2].matchAll(/^\s+"(\w+)" (TEXT\[\]|TEXT|INTEGER|BOOLEAN|TIMESTAMP\(3\))/gm),
        ];
        if (
          actual.length !== expected.length ||
          expected.some(
            ([, name, type]) =>
              !actual.some(
                (c) =>
                  c.column_name === name &&
                  c.data_type ===
                    {
                      TEXT: "text",
                      INTEGER: "integer",
                      BOOLEAN: "boolean",
                      "TEXT[]": "ARRAY",
                      "TIMESTAMP(3)": "timestamp without time zone",
                    }[type],
              ),
          )
        )
          throw new Error("Baseline column mismatch in " + match[1]);
      }
      const backup = "bino_release_backup_" + new Date().toISOString().replace(/\D/g, "");
      await db.$transaction(
        async (tx) => {
          await tx.$executeRawUnsafe("CREATE SCHEMA " + q(backup));
          await tx.$executeRawUnsafe("REVOKE ALL ON SCHEMA " + q(backup) + " FROM PUBLIC");
          for (const table of existing) {
            await tx.$executeRawUnsafe(
              "CREATE TABLE " + q(backup) + "." + q(table) + " AS TABLE public." + q(table),
            );
            const a = await tx.$queryRawUnsafe(
              "SELECT count(*)::text AS count FROM public." + q(table),
            );
            const b = await tx.$queryRawUnsafe(
              "SELECT count(*)::text AS count FROM " + q(backup) + "." + q(table),
            );
            if (a[0].count !== b[0].count) throw new Error("Backup verification failed.");
          }
          await tx.$executeRawUnsafe(
            "REVOKE ALL ON ALL TABLES IN SCHEMA " + q(backup) + " FROM PUBLIC",
          );
          const roles =
            await tx.$queryRaw`SELECT rolname FROM pg_roles WHERE rolname IN ('anon','authenticated')`;
          for (const role of roles)
            await tx.$executeRawUnsafe(
              "REVOKE ALL ON ALL TABLES IN SCHEMA " + q(backup) + " FROM " + q(role.rolname),
            );
        },
        { isolationLevel: "RepeatableRead", timeout: 120000 },
      );
      console.log("[release] Verified database-local backup: " + backup);
      if (!history.some((m) => m.migration_name === baseline && m.finished_at))
        migrate("resolve", "--applied", baseline);
    }
  }
  await db.$disconnect();
  migrate("deploy");
  console.log("[release] Database ready; application build may proceed.");
} finally {
  await db.$disconnect();
}
