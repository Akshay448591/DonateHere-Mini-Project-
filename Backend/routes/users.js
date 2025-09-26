import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// ===== Signup =====
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, msg: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPass });
    await user.save();

    res.status(201).json({ success: true, msg: "Signup successful" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// ===== Login =====
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) return res.status(500).json({ success: false, msg: "JWT_SECRET not set" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// ===== Change Password (protected) =====
router.post("/change-password", auth(), async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ success: false, msg: "New password is required" });
    }

    const user = await User.findById(req.user.id);
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, msg: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// ===== GET all users (superadmin only) =====
router.get("/", auth(["superadmin"]), async (req, res) => {
  try {
    // Exclude currently logged-in SuperAdmin
    const users = await User.find(
      { _id: { $ne: req.user._id } },
      "name email role"
    );
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ===== PATCH user role (superadmin only) =====
router.patch("/:id/role", auth(["superadmin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.role = role;
    await user.save();

    res.json({
      msg: "User role updated",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
