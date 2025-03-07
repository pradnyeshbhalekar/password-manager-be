const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
};
