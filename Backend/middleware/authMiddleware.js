import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * authMiddleware:
 * @param {Array} roles - Allowed roles for the route (optional)
 * @param {boolean} optional - If true, allows access without token (anonymous)
 */
const authMiddleware = (roles = [], optional = false) => {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization;

      if (!header || !header.startsWith("Bearer ")) {
        if (optional) {
          req.user = null; // allow anonymous access
          return next();
        }
        return res.status(401).json({ success: false, msg: "No token provided" });
      }

      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ success: false, msg: "User not found" });

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ success: false, msg: "Access denied" });
      }

      req.user = user;
      next();
    } catch (err) {
      if (optional) {
        req.user = null;
        return next();
      }
      res.status(401).json({ success: false, msg: "Invalid or expired token" });
    }
  };
};

export default authMiddleware;
