const AuthService = require("../services/authService");

class AuthController {
  constructor(authService = new AuthService()) {
    this.authService = authService;
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body || {};

      if (
        typeof email !== "string" ||
        !email.trim() ||
        typeof password !== "string" ||
        !password
      ) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      const user = await this.authService.findByCredentials(email, password);
      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const token = this.authService.createToken(user);
      return res.status(200).json({
        message: "Login succesfully",
        token,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
}

module.exports = new AuthController();
