const mongoose = require("mongoose");

const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Subject = require("../models/Subject");

const getStudentAttendances = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }

        const student = await Student.findById(studentId).select(
            "studentCode fullName email"
        );
        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const attendances = await Attendance.find({ studentId })
            .populate({
                path: "classId",
                select: "className subjectId",
                populate: {
                    path: "subjectId",
                    model: Subject,
                    select: "name"
                }
            })
            .sort({ date: -1 });
        const attendanceData = attendances.map((attendance) => {
            const record = attendance.toObject();
            const classData = record.classId;

            return {
                ...record,
                classId: classData
                    ? {
                        _id: classData._id,
                        className: classData.className,
                        subjectName: classData.subjectId?.name ?? null
                    }
                    : null
            };
        });

        return res.status(200).json({
            message: "Get student attendances successfully",
            data: {
                student,
                attendances: attendanceData
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getStudentAttendances
};
