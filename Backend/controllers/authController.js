import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT token (reads JWT_SECRET at runtime)
const generateToken = (id, role) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1d" });
};

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: "user" });

    res.status(201).json({ msg: "Signup successful", user: { id: user._id, name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login (user/admin/superadmin)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Example protected dashboard
export const getDashboard = (req, res) => {
  res.json({ message: `Welcome ${req.user?.name || "User"} (${req.user?.role || "user"}) dashboard!` });
};
