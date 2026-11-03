const express = require("express");
const router = express.Router();

const classController = require("../controllers/classController");

const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/:id/attendance-summary", authenticateToken , classController.getAttendanceSummary);
router.get("/:id/students", authenticateToken, classController.getStudentsByClassId);

module.exports = router;
