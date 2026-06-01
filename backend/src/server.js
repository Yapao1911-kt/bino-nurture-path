// ============================================================
// Express Server Entry Point
// File: src/server.js
// Mô tả: Khởi tạo Express server, cấu hình middleware,
//         và mount các route cho API.
// ============================================================

// Load biến môi trường từ file .env (phải gọi đầu tiên)
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Import routes
const childRoutes = require("./routes/childRoutes");

// -------------------------------------------------------
// Khởi tạo Express App
// -------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 5000;

// -------------------------------------------------------
// Cấu hình Middleware
// -------------------------------------------------------

// Cho phép Cross-Origin requests (cần thiết khi frontend
// và backend chạy trên domain/port khác nhau)
app.use(cors());

// Parse JSON request body (cho phép đọc req.body dạng JSON)
app.use(express.json());

// Parse URL-encoded request body (cho form submissions)
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------------
// Mount Routes
// Tất cả route trong childRoutes sẽ có prefix /api/children
// Ví dụ: POST /api/children → childController.createChild
// -------------------------------------------------------
app.use("/api/children", childRoutes);

// -------------------------------------------------------
// Route kiểm tra server hoạt động (Health Check)
// GET / → trả về thông tin cơ bản của API
// -------------------------------------------------------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 BINO API Server đang hoạt động!",
    version: "1.0.0",
    endpoints: {
      createChild: "POST /api/children",
    },
  });
});

// -------------------------------------------------------
// Middleware xử lý route không tồn tại (404)
// Đặt SAU tất cả các route definitions
// -------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} không tồn tại.`,
  });
});

// -------------------------------------------------------
// Middleware xử lý lỗi toàn cục (Error Handler)
// Express nhận diện đây là error handler nhờ 4 tham số
// -------------------------------------------------------
app.use((err, req, res, _next) => {
  console.error("❌ Lỗi không mong muốn:", err.stack);

  res.status(500).json({
    success: false,
    message: "Đã xảy ra lỗi nội bộ server.",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});

// -------------------------------------------------------
// Khởi động Server
// -------------------------------------------------------
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📋 API Endpoint: POST http://localhost:${PORT}/api/children`);
  console.log(`🏥 Health Check: GET  http://localhost:${PORT}/`);
});
