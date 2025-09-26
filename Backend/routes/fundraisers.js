import express from "express";
import Fundraiser from "../models/Fundraiser.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload, uploadToCloudinary } from "../middleware/upload.js";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ------------------ Public Routes ------------------

// Get all published fundraisers
router.get("/published", async (req, res) => {
  try {
    const fundraisers = await Fundraiser.find({ status: "published" }).populate(
      "creator",
      "name email"
    );
    res.json(fundraisers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get single published fundraiser by ID
router.get("/published/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fundraiser = await Fundraiser.findOne({ _id: id, status: "published" }).populate(
      "creator",
      "name email"
    );
    if (!fundraiser) return res.status(404).json({ msg: "Fundraiser not found" });
    res.json(fundraiser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Search published fundraisers
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query || "";
    if (!query) return res.json({ fundraisers: [] });

    const regex = new RegExp(query, "i");
    const fundraisers = await Fundraiser.find({
      status: "published",
      $or: [
        { "basicDetails.title": { $regex: regex } },
        { "basicDetails.category": { $regex: regex } },
      ],
    }).populate("creator", "name email");

    res.json({ fundraisers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ------------------ Donation Routes ------------------

// Stripe: Create Payment Intent (Card Payments Only)
router.post("/create-payment-intent", authMiddleware([], true), async (req, res) => {
  try {
    const { amount, fundraiserId, donorName, donorEmail } = req.body;
    if (!amount || !fundraiserId) return res.status(400).json({ msg: "Amount and fundraiserId required" });

    // Check if fundraiser exists
    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) return res.status(404).json({ msg: "Fundraiser not found" });

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // USD -> cents
      currency: "usd",
      metadata: {
        fundraiserId,
        donorName: donorName || "Anonymous",
        donorEmail: donorEmail || "Anonymous",
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create payment intent" });
  }
});

// Donate (DB update, optional: works with Stripe webhook)
router.post("/donate", authMiddleware([], true), async (req, res) => {
  try {
    const { fundraiserId, amount, donorName, donorEmail } = req.body;
    if (!fundraiserId || !amount)
      return res.status(400).json({ msg: "Fundraiser ID and amount are required" });

    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) return res.status(404).json({ msg: "Fundraiser not found" });

    fundraiser.donations.push({
      amount,
      donor: donorName || (req.user ? req.user.email : "Anonymous"),
      donorEmail: donorEmail || "",
      donatedAt: new Date(),
    });

    fundraiser.amountRaised = (fundraiser.amountRaised || 0) + amount;
    await fundraiser.save();

    res.json({ msg: "Donation successful", fundraiser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ------------------ Multi-Step Fundraiser ------------------

// Step 1: Basic Details
router.post("/step1", authMiddleware(["user"]), async (req, res) => {
  try {
    const { title, description, category, target } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ msg: "Title, description, and category are required" });
    }

    const fundraiser = new Fundraiser({
      basicDetails: {
        title,
        description,
        category,
        target: target || 0,
      },
      creator: req.user._id,
      status: "pending",
    });

    await fundraiser.save();
    res.json({ fundraiser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Step 2: Upload Proofs
router.post("/step2", authMiddleware(["user"]), upload.array("proofs"), async (req, res) => {
  try {
    const fundraiserId = req.body.fundraiserId;
    if (!fundraiserId) return res.status(400).json({ msg: "Fundraiser ID is required" });

    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) return res.status(404).json({ msg: "Fundraiser not found" });
    if (!fundraiser.creator.equals(req.user._id))
      return res.status(403).json({ msg: "Unauthorized" });

    const uploadedUrls = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, "fundraiser_proofs");
      uploadedUrls.push(result.secure_url);
    }

    fundraiser.proofs = uploadedUrls;
    await fundraiser.save();

    res.json({ fundraiser, msg: "Proofs uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Step 3: Bank Details
router.post("/step3", authMiddleware(["user"]), async (req, res) => {
  try {
    const { fundraiserId, bankName, accountNumber, ifsc } = req.body;
    if (!fundraiserId || !bankName || !accountNumber || !ifsc)
      return res.status(400).json({ msg: "All fields are required" });

    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) return res.status(404).json({ msg: "Fundraiser not found" });
    if (!fundraiser.creator.equals(req.user._id))
      return res.status(403).json({ msg: "Unauthorized" });

    fundraiser.accountDetails = { bankName, accountNumber, ifsc };
    fundraiser.status = "pending";
    await fundraiser.save();

    res.json({ fundraiser, msg: "Fundraiser request submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ------------------ Admin Routes ------------------

// Get all pending fundraisers
router.get("/pending", authMiddleware(["admin"]), async (req, res) => {
  try {
    const pendingFundraisers = await Fundraiser.find({ status: "pending" }).populate(
      "creator",
      "name email"
    );
    res.json(pendingFundraisers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Verify fundraiser
router.post("/verify", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { fundraiserId } = req.body;
    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) return res.status(404).json({ msg: "Fundraiser not found" });

    fundraiser.status = "verified";
    fundraiser.verifiedBy = req.user.email;
    await fundraiser.save();

    res.json({ msg: "Fundraiser verified", fundraiser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Reject fundraiser
router.post("/reject", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { fundraiserId } = req.body;
    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) return res.status(404).json({ msg: "Fundraiser not found" });

    fundraiser.status = "rejected";
    fundraiser.verifiedBy = req.user.email;
    await fundraiser.save();

    res.json({ msg: "Fundraiser rejected", fundraiser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ------------------ Super Admin Routes ------------------

// Get all verified fundraisers (ready to publish)
router.get("/verified", authMiddleware(["superadmin"]), async (req, res) => {
  try {
    const verifiedFundraisers = await Fundraiser.find({ status: "verified" }).populate(
      "creator",
      "name email"
    );
    res.json(verifiedFundraisers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Publish fundraiser
router.post("/publish", authMiddleware(["superadmin"]), async (req, res) => {
  try {
    const { fundraiserId } = req.body;
    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) return res.status(404).json({ msg: "Fundraiser not found" });

    fundraiser.status = "published";
    await fundraiser.save();

    res.json({ msg: "Fundraiser published", fundraiser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
