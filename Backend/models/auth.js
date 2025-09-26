import jwt from "jsonwebtoken";
import User from "./User.js";

const auth = (roles = []) => {
  if (!Array.isArray(roles)) roles = [roles];

  return async (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith("Bearer "))
        return res.status(401).json({ success: false, msg: "No token provided" });

      const token = header.split(" ")[1];
      const { JWT_SECRET } = process.env;
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ success: false, msg: "User not found" });

      if (roles.length && !roles.includes(user.role))
        return res.status(403).json({ success: false, msg: "Access denied" });

      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ success: false, msg: "Invalid or expired token" });
    }
  };
};

export default auth;
