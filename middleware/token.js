const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET;

function getToken(user) {
  const token = jwt.sign(
    {
      _id: user._id,
      role: user.role
    },
    secretKey,
    {
      expiresIn: "30d",
    }
  );

  return token;
}

function extractJWTFromRequest(req) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    return token;
  }

  return null;
}

const validateToken = (req, res, next) => {
  const token = extractJWTFromRequest(req);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

function extractJWTDetails(jwtToken) {
  try {
    const decoded = jwt.verify(jwtToken, process.env.SECRET);

    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

  const User = (req, res, next) => {
    if (
      req.user.role === "user"
    ) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Access forbidden only admins allowed " });
    }
  };
module.exports = {
  validateToken,
  extractJWTDetails,
  extractJWTFromRequest,
  getToken,
  User
};