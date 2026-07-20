// ============================================================
// Supabase Client Configuration
// File: src/config/supabaseClient.js
// Mô tả: Khởi tạo và export Supabase client để sử dụng
//         xuyên suốt toàn bộ ứng dụng.
// ============================================================

const { createClient } = require("@supabase/supabase-js");

// Lấy thông tin kết nối từ biến môi trường (.env)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Kiểm tra xem biến môi trường đã được cấu hình chưa
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Thiếu biến môi trường SUPABASE_URL hoặc SUPABASE_ANON_KEY.");
  console.error("   Vui lòng tạo file .env từ .env.example và điền thông tin Supabase.");
  process.exit(1);
}

// Khởi tạo Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
