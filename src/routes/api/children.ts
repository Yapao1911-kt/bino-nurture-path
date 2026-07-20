import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";

// Tạo Route rỗng để đảm bảo compiler của TanStack Router không bị lỗi biên dịch RouteTree
export const Route = createFileRoute("/api/children")({
  component: () => null,
});

const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL ||
  "https://akgrbwyrlqvxhzgoykpt.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_HmZ1YfIHkXCG8u_U1VZysg_pt-GsXGF";

export interface CreateChildInput {
  full_name: string;
  date_of_birth: string;
  developmental_challenges: string[];
  communication_level: string;
}

// Server Function xử lý tạo hồ sơ trẻ
export const createChildFn = createServerFn({ method: "POST" })
  .inputValidator((data: CreateChildInput) => data)
  .handler(async ({ data }) => {
    try {
      // 1. Trích xuất Request và kiểm tra mã xác thực JWT từ header Authorization
      const request = getRequest();
      const authHeader = request.headers.get("Authorization");
      const token = authHeader?.split(" ")[1];

      if (!token) {
        return new Response(
          JSON.stringify({ message: "Không tìm thấy mã xác thực JWT. Vui lòng đăng nhập lại." }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      }

      // Khởi tạo Supabase client trên Server
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });

      // Lấy thông tin user từ token JWT của người dùng hiện tại
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return new Response(
          JSON.stringify({ message: "Mã xác thực JWT không hợp lệ hoặc đã hết hạn." }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      }

      const parentId = user.id;

      // 2. Ràng buộc bảo mật: Kiểm tra quyền (Role) của người dùng hiện tại
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", parentId)
        .maybeSingle();

      const userRole = (profile?.role || user.user_metadata?.role || "parent").toLowerCase();
      const allowedRoles = ["parent", "teacher", "premium", "admin"];

      if (!allowedRoles.includes(userRole)) {
        return new Response(
          JSON.stringify({ message: "Tài khoản của bạn không có quyền thực hiện hành động này." }),
          { status: 403, headers: { "Content-Type": "application/json" } },
        );
      }

      // 3. Validation dữ liệu phía Server
      const { full_name, date_of_birth, developmental_challenges, communication_level } = data;
      const validationErrors: string[] = [];

      if (!full_name || typeof full_name !== "string" || !full_name.trim()) {
        validationErrors.push("Họ tên của trẻ (full_name) là bắt buộc.");
      }

      if (!date_of_birth) {
        validationErrors.push("Ngày sinh của trẻ (date_of_birth) là bắt buộc.");
      } else {
        const dob = new Date(date_of_birth);
        if (isNaN(dob.getTime())) {
          validationErrors.push("Ngày sinh không hợp lệ.");
        } else {
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          if (dob > today) {
            validationErrors.push("Ngày sinh của trẻ không được lớn hơn ngày hiện tại.");
          }
        }
      }

      if (
        !developmental_challenges ||
        !Array.isArray(developmental_challenges) ||
        developmental_challenges.length === 0
      ) {
        validationErrors.push("Khó khăn phát triển (developmental_challenges) là bắt buộc.");
      } else if (developmental_challenges.some((c) => typeof c !== "string" || !c.trim())) {
        validationErrors.push("Tất cả các khó khăn phát triển phải là chuỗi hợp lệ.");
      }

      if (
        !communication_level ||
        typeof communication_level !== "string" ||
        !communication_level.trim()
      ) {
        validationErrors.push("Mức độ giao tiếp của trẻ (communication_level) là bắt buộc.");
      }

      if (validationErrors.length > 0) {
        return new Response(JSON.stringify({ errors: validationErrors }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // 4. Lưu vào Supabase Database bảng children
      const { data: newChild, error: insertError } = await supabase
        .from("children")
        .insert([
          {
            parent_id: parentId,
            full_name: full_name.trim(),
            date_of_birth,
            developmental_challenges,
            communication_level: communication_level.trim(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Database insert error:", insertError.message);
        return new Response(
          JSON.stringify({
            message: "Lỗi cơ sở dữ liệu khi lưu thông tin trẻ.",
            details: insertError.message,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }

      // 5. Thành công: Trả về đối tượng trẻ vừa tạo (HTTP 200)
      return new Response(JSON.stringify(newChild), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      console.error("Server Function createChildFn error:", err);
      return new Response(
        JSON.stringify({ message: "Lỗi hệ thống máy chủ nội bộ.", error: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  });
