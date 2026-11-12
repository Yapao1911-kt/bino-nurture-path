import { createHmac, timingSafeEqual } from "node:crypto";
export const SESSION_COOKIE = "bino_session";
function key(): string {
  const secret = process.env.BINO_SESSION_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("BINO_SESSION_SECRET must contain at least 32 random characters");
  return secret;
}
export function signSession(userId: string, now = Date.now()): string {
  const payload = Buffer.from(
    JSON.stringify({ sub: userId, exp: Math.floor(now / 1000) + 43200 }),
  ).toString("base64url");
  return `${payload}.${createHmac("sha256", key()).update(payload).digest("base64url")}`;
}
export function readSession(request: Request, now = Date.now()): string | null {
  const token = request.headers
    .get("cookie")
    ?.split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(SESSION_COOKIE + "="))
    ?.slice(SESSION_COOKIE.length + 1);
  if (!token || token.length > 2048) return null;
  try {
    const [payload, signature, ...extra] = token.split(".");
    if (extra.length || !payload || !signature) return null;
    const expected = createHmac("sha256", key()).update(payload).digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sub?: string;
      exp?: number;
    };
    return typeof data.sub === "string" &&
      data.sub.length > 0 &&
      typeof data.exp === "number" &&
      data.exp > now / 1000 &&
      data.exp <= now / 1000 + 43201
      ? data.sub
      : null;
  } catch {
    return null;
  }
}
export function requireSession(request: Request): string {
  const user = readSession(request);
  if (!user) throw new Error("Vui lòng đăng nhập lại để tiếp tục.");
  return user;
}
