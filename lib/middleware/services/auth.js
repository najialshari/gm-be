const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const authService = {
  signUser: (user) => {
    const token = jwt.sign(
      {
        email: user.email,
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );
    return token;
  },
  verifyUser: (req, res, next,token) => {
    if (!token) return false;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      // set the user data to the req obj using the decoded token payload
      req.user = {
        id: decoded.id,
        email: decoded.email,
        token: token,
      };
      return decoded;
    }
  },
  hashPassword: (plainTextPassword) => {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(plainTextPassword, salt);
    return hash;
  },
  comparePasswords: function (plainTextPassword, hashedPassword) {
    return bcrypt.compareSync(plainTextPassword, hashedPassword);
  },
};
module.exports = authService;
