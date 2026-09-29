import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { mockResources } from "./mock-data";

// --- Supabase client (server-side) ---
const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL ||
  "https://akgrbwyrlqvxhzgoykpt.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_HmZ1YfIHkXCG8u_U1VZysg_pt-GsXGF";

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// --- Server function: lấy danh sách resources ---
export const getResourcesFn = createServerFn({ method: "GET" })
  .inputValidator(
    (data: {
      category: string;
      ageGroup?: string;
      difficulty?: string;
      format?: string;
      userEmail?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { category, ageGroup, difficulty, format, userEmail } = data;

    try {
      // Thử query từ Supabase trước
      let query = supabase.from("resources").select("*").eq("category", category);

      if (ageGroup && ageGroup !== "all") {
        query = query.contains("ageGroup", JSON.stringify([ageGroup]));
      }

      if (difficulty && difficulty !== "all") {
        query = query.contains("difficulty", JSON.stringify([difficulty]));
      }

      if (format && format !== "all") {
        query = query.eq("format", format);
      }

      const { data: resources, error } = await query;

      if (error) {
        throw error;
      }

      // Lấy thông tin user từ Supabase
      let userType = "free";
      if (userEmail) {
        const { data: user } = await supabase
          .from("users")
          .select("subscription")
          .eq("email", userEmail)
          .maybeSingle();

        if (user?.subscription === "PREMIUM") {
          userType = "premium";
        }
      }

      return {
        resources: (resources || []).map((res: any) => ({
          ...res,
          ageGroup:
            typeof res.ageGroup === "string" ? JSON.parse(res.ageGroup) : res.ageGroup,
          difficulty:
            typeof res.difficulty === "string"
              ? JSON.parse(res.difficulty)
              : res.difficulty,
        })),
        userType,
      };
    } catch (err) {
      // Fallback: dùng mock data nếu Supabase chưa có bảng resources
      console.warn(
        "[getResourcesFn] Supabase query failed, falling back to mock data:",
        err instanceof Error ? err.message : err,
      );

      let filtered = mockResources.filter((r) => {
        if (Array.isArray(r.category)) {
          return r.category.includes(category as any);
        }
        return r.category === category;
      });

      if (ageGroup && ageGroup !== "all") {
        filtered = filtered.filter((r) => r.ageGroup.includes(ageGroup as any));
      }

      if (difficulty && difficulty !== "all") {
        filtered = filtered.filter((r) => r.difficulty.includes(difficulty as any));
      }

      if (format && format !== "all") {
        filtered = filtered.filter((r) => r.format === format);
      }

      return {
        resources: filtered,
        userType: "free",
      };
    }
  });
