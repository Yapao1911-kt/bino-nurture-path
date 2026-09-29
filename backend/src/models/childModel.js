// ============================================================
// Child Schema Definition (Supabase / PostgreSQL)
// File: src/models/childModel.js
// Mô tả: Định nghĩa schema cho bảng "children" và cung cấp
//         hàm validate dữ liệu trước khi lưu vào database.
//
// LƯU Ý: Supabase sử dụng PostgreSQL, không phải MongoDB.
//         Do đó ta KHÔNG dùng Mongoose mà thay bằng:
//         - Schema definition object (để document hóa cấu trúc)
//         - Hàm validate thủ công (thay cho Mongoose validators)
//         - Supabase JS Client (thay cho Mongoose model methods)
// ============================================================

/**
 * Schema mô tả cấu trúc bảng "children" trong Supabase.
 * Đây là tài liệu tham khảo — bảng thực tế cần được tạo
 * trực tiếp trên Supabase Dashboard hoặc qua SQL migration.
 *
 * SQL để tạo bảng:
 * -----------------------------------------------
 * CREATE TABLE children (
 *   id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   name        TEXT NOT NULL,
 *   age         INTEGER NOT NULL CHECK (age >= 0 AND age <= 18),
 *   address     TEXT,
 *   condition   TEXT,
 *   created_at  TIMESTAMPTZ DEFAULT NOW()
 * );
 * -----------------------------------------------
 */
const CHILD_SCHEMA = {
  tableName: "children",
  columns: {
    id: { type: "UUID", primaryKey: true, default: "gen_random_uuid()" },
    name: { type: "TEXT", required: true },
    age: { type: "INTEGER", required: true, min: 0, max: 18 },
    address: { type: "TEXT", required: false },
    condition: { type: "TEXT", required: false },
    created_at: { type: "TIMESTAMPTZ", default: "NOW()" },
  },
};

/**
 * Validate dữ liệu đầu vào trước khi lưu vào database.
 *
 * @param {Object} data - Dữ liệu từ request body
 * @returns {Object} - { isValid: boolean, errors: string[] }
 *
 * Các rule kiểm tra:
 * 1. "name" là bắt buộc, phải là string không rỗng
 * 2. "age" là bắt buộc, phải là số nguyên từ 0-18
 * 3. "address" nếu có phải là string
 * 4. "condition" nếu có phải là string
 */
function validateChildData(data) {
  const errors = [];

  // --- Kiểm tra trường "name" ---
  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    errors.push("Tên của trẻ (name) là bắt buộc và phải là chuỗi ký tự.");
  }

  // --- Kiểm tra trường "age" ---
  if (data.age === undefined || data.age === null) {
    errors.push("Tuổi của trẻ (age) là bắt buộc.");
  } else if (typeof data.age !== "number" || !Number.isInteger(data.age)) {
    errors.push("Tuổi của trẻ (age) phải là số nguyên.");
  } else if (data.age < 0 || data.age > 18) {
    errors.push("Tuổi của trẻ (age) phải nằm trong khoảng 0-18.");
  }

  // --- Kiểm tra trường "address" (nếu có) ---
  if (data.address !== undefined && typeof data.address !== "string") {
    errors.push("Địa chỉ (address) phải là chuỗi ký tự.");
  }

  // --- Kiểm tra trường "condition" (nếu có) ---
  if (data.condition !== undefined && typeof data.condition !== "string") {
    errors.push("Tình trạng của trẻ (condition) phải là chuỗi ký tự.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  CHILD_SCHEMA,
  validateChildData,
};
