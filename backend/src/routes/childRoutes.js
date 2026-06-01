// ============================================================
// Child Routes
// File: src/routes/childRoutes.js
// Mô tả: Định nghĩa các route liên quan đến hồ sơ trẻ.
//         Sử dụng Express Router để tổ chức route modular.
// ============================================================

const express = require("express");
const router = express.Router();

// Import controller
const { createChild } = require("../controllers/childController");

// -------------------------------------------------------
// [POST] /api/children
// Tạo mới một hồ sơ trẻ
// Body: { name, age, address?, condition? }
// -------------------------------------------------------
router.post("/", createChild);

module.exports = router;
