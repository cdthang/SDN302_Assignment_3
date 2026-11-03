Requirement 1:
 POST login: POST /api/auth/login
![Image](./picture/LoginFail.png)
![Image](./picture/loginSuccess.png)

Requirement 2:
 Get Student in a Class: GET /api/classes/:id/students?status=enrolled
![Image](./picture/GetStudentByClassIdFail.png)
![Image](./picture/GetStudentByClassIdSuccess.png)

Requirement 3:
Get Attendance Summary of a Class : GET /api/classes/:id/attendance-summary
![Image](./picture/GetStudentSummaryFail.png)
![Image](./picture/GetStudentByClassIdSuccess.png)

Requirement 4:
Get Attendance of a Student : GET /api/students/:id/attendances
![Image](./picture/GetAttendanceOfAStudentFail.png)
![Image](./picture/GetAttendanceOfAStudentFail(InValid%20ID).png)
![Image](./picture/GetAttendanceOfAStudentSuccess.png)