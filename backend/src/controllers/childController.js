// ============================================================
// Child Controller
// File: src/controllers/childController.js
// Mô tả: Xử lý logic nghiệp vụ cho API tạo hồ sơ trẻ.
//         Controller nhận request, validate, gọi Supabase,
//         và trả về response chuẩn JSON.
// ============================================================

const supabase = require("../config/supabaseClient");
const { validateChildData } = require("../models/childModel");

/**
 * [POST] /api/children
 * Tạo mới một hồ sơ trẻ trong database.
 *
 * Request Body (JSON):
 * {
 *   "name":      "Nguyễn Văn A",     // (bắt buộc) Tên của trẻ
 *   "age":       5,                    // (bắt buộc) Tuổi của trẻ (0-18)
 *   "address":   "123 Đường ABC",     // (tùy chọn) Địa chỉ
 *   "condition": "phát triển bình thường" // (tùy chọn) Tình trạng
 * }
 *
 * Response:
 * - 201: Tạo thành công → { success, message, data }
 * - 400: Dữ liệu không hợp lệ → { success, message, errors }
 * - 500: Lỗi server → { success, message, error }
 */
const createChild = async (req, res) => {
  try {
    // -------------------------------------------------------
    // Bước 1: Lấy dữ liệu từ request body
    // -------------------------------------------------------
    const { name, age, address, condition } = req.body;

    // -------------------------------------------------------
    // Bước 2: Validate dữ liệu đầu vào
    // Sử dụng hàm validateChildData từ model
    // -------------------------------------------------------
    const validation = validateChildData({ name, age, address, condition });

    if (!validation.isValid) {
      // Trả về lỗi 400 (Bad Request) nếu dữ liệu không hợp lệ
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
        errors: validation.errors,
      });
    }

    // -------------------------------------------------------
    // Bước 3: Chuẩn bị dữ liệu sạch trước khi lưu
    // Trim whitespace và chỉ giữ các trường hợp lệ
    // -------------------------------------------------------
    const childData = {
      name: name.trim(),
      age: age,
      address: address ? address.trim() : null,
      condition: condition ? condition.trim() : null,
    };

    // -------------------------------------------------------
    // Bước 4: Gọi Supabase để insert dữ liệu vào bảng "children"
    // .insert() thêm bản ghi mới
    // .select() trả về dữ liệu vừa tạo (thay vì chỉ trả count)
    // .single() lấy đúng 1 object thay vì mảng
    // -------------------------------------------------------
    const { data, error } = await supabase.from("children").insert(childData).select().single();

    // Kiểm tra lỗi từ Supabase
    if (error) {
      console.error("❌ Lỗi Supabase khi tạo hồ sơ trẻ:", error.message);

      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lưu hồ sơ trẻ vào cơ sở dữ liệu.",
        error: error.message,
      });
    }

    // -------------------------------------------------------
    // Bước 5: Trả về response thành công (HTTP 201 Created)
    // -------------------------------------------------------
    return res.status(201).json({
      success: true,
      message: "Tạo hồ sơ trẻ thành công!",
      data: data,
    });
  } catch (error) {
    // -------------------------------------------------------
    // Xử lý lỗi không mong muốn (500 Internal Server Error)
    // Bắt mọi exception chưa được xử lý ở trên
    // -------------------------------------------------------
    console.error("❌ Lỗi server không mong muốn:", error.message);

    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi nội bộ server. Vui lòng thử lại sau.",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error",
    });
  }
};

module.exports = {
  createChild,
};
