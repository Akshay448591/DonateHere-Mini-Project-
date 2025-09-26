import User from "../models/User.js";
import Fundraiser from "../models/Fundraiser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Generate JWT token safely
const generateToken = (id, role) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables");
  }
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1d" });
};

// Admin + Superadmin login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !["admin", "superadmin"].includes(user.role)) {
      return res.status(401).json({ success: false, msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
};

// Dashboard analytics for admin/superadmin
export const getAdminDashboard = async (req, res) => {
  try {
    const totalFundraisers = await Fundraiser.countDocuments();
    const pendingFundraisers = await Fundraiser.countDocuments({ status: "pending" });
    const verifiedFundraisers = await Fundraiser.countDocuments({ status: "verified" });
    const publishedFundraisers = await Fundraiser.countDocuments({ status: "published" });
    const rejectedFundraisers = await Fundraiser.countDocuments({ status: "rejected" });

    const totalDonationsAgg = await Fundraiser.aggregate([
      { $unwind: "$donations" },
      { $group: { _id: null, total: { $sum: "$donations.amount" } } },
    ]);
    const totalDonations = totalDonationsAgg[0]?.total || 0;

    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // Recent 5 donations (most recent first)
    const recentDonationsAgg = await Fundraiser.aggregate([
      { $unwind: "$donations" },
      { $sort: { "donations.donatedAt": -1 } },
      { $limit: 5 },
      {
        $project: {
          fundraiserTitle: "$basicDetails.title",
          amount: "$donations.amount",
          donatedAt: "$donations.donatedAt",
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        totalFundraisers,
        pendingFundraisers,
        verifiedFundraisers,
        publishedFundraisers,
        rejectedFundraisers,
        totalDonations,
        totalUsers,
        totalAdmins,
        recentDonations: recentDonationsAgg,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
};
