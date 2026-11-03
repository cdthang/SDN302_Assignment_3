const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

class AuthService {
    async findByCredentials(email, password) {
        const normalizedEmail = (email || "").trim().toLowerCase();

        const student = await Student.findOne({
            email: normalizedEmail
        }).select("studentCode fullName email");

        if (!student) {
            return null;
        }

        const validPasswords = new Set([
            `${student.studentCode}@123`,
            "masv@123"
        ]);

        if (!validPasswords.has(password)) {
            return null;
        }

        return {
            id: student.id,
            email: student.email,
            studentCode: student.studentCode,
            fullName: student.fullName
        };
    }

    createToken(user) {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                studentCode: user.studentCode
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
    }
}

module.exports = AuthService;
