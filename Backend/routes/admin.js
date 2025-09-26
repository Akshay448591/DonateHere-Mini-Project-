import express from "express";
import { login } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Fundraiser from "../models/Fundraiser.js";
import User from "../models/User.js";

const router = express.Router();

// 🔑 Single login route for both admin + superadmin
router.post("/login", login);

// 📊 Protected dashboard route with analytics
router.get("/dashboard", authMiddleware(["admin", "superadmin"]), async (req, res) => {
  try {
    // Fundraiser counts
    const totalFundraisers = await Fundraiser.countDocuments();
    const pendingFundraisers = await Fundraiser.countDocuments({ status: "pending" });
    const verifiedFundraisers = await Fundraiser.countDocuments({ status: "verified" });
    const publishedFundraisers = await Fundraiser.countDocuments({ status: "published" });
    const rejectedFundraisers = await Fundraiser.countDocuments({ status: "rejected" });

    // Total donations sum
    const totalDonationsAgg = await Fundraiser.aggregate([
      { $unwind: "$donations" },
      { $group: { _id: null, total: { $sum: "$donations.amount" } } },
    ]);
    const totalDonations = totalDonationsAgg[0]?.total || 0;

    // Users count
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // ✅ Recent 5 donations (most recent first)
    const recentDonationsAgg = await Fundraiser.aggregate([
      { $unwind: "$donations" },
      { $sort: { "donations.donatedAt": -1 } },
      { $limit: 5 },
      {
        $project: {
          fundraiserTitle: "$basicDetails.title",
          amount: "$donations.amount",
          date: "$donations.donatedAt", // renamed for frontend
        },
      },
    ]);

    // Return stats
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
    console.error("Dashboard error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
