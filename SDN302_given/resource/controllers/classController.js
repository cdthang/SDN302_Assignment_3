const mongoose = require("mongoose");

const Classes = require("../models/Class");
const Attendance = require("../models/Attendance");

const getAttendanceSummary = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid class ID"
            });
        }

        const classData = await Classes.findById(id)
            .populate("enrollments.studentId", "studentCode fullName email");
        if (!classData) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        const attendanceCounts = await Attendance.aggregate([
            {
                $match: {
                    classId: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $group: {
                    _id: "$studentId",
                    totalSessions: { $sum: 1 },
                    presentSessions: {
                        $sum: { $cond: [{ $eq: ["$status", "PRESENT"] }, 1, 0] }
                    },
                    absentSessions: {
                        $sum: { $cond: [{ $eq: ["$status", "ABSENT"] }, 1, 0] }
                    }
                }
            }
        ]);
        const countsByStudentId = new Map(
            attendanceCounts.map((counts) => [counts._id.toString(), counts])
        );
        const students = classData.enrollments
            .filter((enrollment) => enrollment.status?.toLowerCase() === "enrolled")
            .map((enrollment) => {
                const student = enrollment.studentId;
                if (!student) {
                    return null;
                }

                const counts = countsByStudentId.get(student._id.toString());
                const totalSessions = counts?.totalSessions ?? 0;
                const presentSessions = counts?.presentSessions ?? 0;
                const absentSessions = counts?.absentSessions ?? 0;
                const attendanceRate = totalSessions === 0
                    ? 0
                    : Number(((presentSessions / totalSessions) * 100).toFixed(2));

                return {
                    student,
                    totalSessions,
                    presentSessions,
                    absentSessions,
                    attendanceRate,
                    warning: attendanceRate < 80
                };
            })
            .filter(Boolean);

        return res.status(200).json({
            message: "Get attendance summary successfully",
            data: {
                classId: classData._id,
                className: classData.className,
                students
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const getStudentsByClassId = async (req, res) => {
    try {
        const { id } = req.params;
        const status = req.query.status;

        if (typeof status !== "string" || !status.trim()) {
            return res.status(400).json({
                message: "Student status is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid class ID"
            });
        }

        const classData = await Classes.findById(id)
            .populate("enrollments.studentId", "studentCode fullName email");

        if (!classData) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        const students = classData.enrollments
            .filter((enrollment) => enrollment.status?.toLowerCase() === status.trim().toLowerCase())
            .map((enrollment) => enrollment.studentId)
            .filter(Boolean);

        return res.status(200).json({
            message: "Get class students successfully",
            data: {
                classId: classData._id,
                className: classData.className,
                students
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAttendanceSummary,
    getStudentsByClassId
};