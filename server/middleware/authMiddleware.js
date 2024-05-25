const jwt = require("jsonwebtoken");
const User = require("../models/auth/userModel");
const redis = require("../utils/redis");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Missing token" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const redisKey = `user:${decoded.email}`;
    const cachedUser = await redis.get(redisKey);

    if (cachedUser) {
      const user = JSON.parse(cachedUser);
      req.user = user;
      return next();
    }

    // Check if the user exists in the database
    const existingUser = await User.findOne({
      where: { email: decoded.email },
    });

    if (!existingUser) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // Cache the user in Redis
    await redis.set(redisKey, JSON.stringify(existingUser), "EX", 24 * 60 * 60);

    req.user = existingUser;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Unauthorized: Error verifying token" });
  }
};

module.exports = authMiddleware;
