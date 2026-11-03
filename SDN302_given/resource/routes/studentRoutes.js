const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/:studentId/attendances", authenticateToken, studentController.getStudentAttendances);

module.exports = router;
