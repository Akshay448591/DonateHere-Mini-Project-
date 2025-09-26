import Fundraiser from "../models/Fundraiser.js";

// ------------------ User Controllers ------------------

// Step 1: Create fundraiser basic details
export const createFundraiserStep1 = async (req, res) => {
  try {
    const { title, description, category, target } = req.body;
    const fundraiser = new Fundraiser({
      creator: req.user._id,
      basicDetails: { title, description, category, target },
      amountRaised: 0,
      donations: [],
    });
    await fundraiser.save();
    res.json({ success: true, fundraiser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Step 2: Add proofs
export const addProofs = async (req, res) => {
  try {
    const { fundraiserId } = req.body;
    const files = req.files;

    if (!fundraiserId)
      return res.status(400).json({ msg: "Fundraiser ID required" });

    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) return res.status(404).json({ msg: "Fundraiser not found" });

    const fileUrls = files.map((file) => file.path);
    fundraiser.proofs = [...(fundraiser.proofs || []), ...fileUrls];
    await fundraiser.save();

    res.json({ success: true, fundraiser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Step 3: Add account details
export const addAccountDetails = async (req, res) => {
  try {
    const { fundraiserId, accountNumber, bankName, ifsc } = req.body;

    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) return res.status(404).json({ msg: "Fundraiser not found" });

    fundraiser.accountDetails = { accountNumber, bankName, ifsc };
    await fundraiser.save();

    res.json({ success: true, fundraiser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get fundraisers of logged-in user
export const getUserFundraisers = async (req, res) => {
  try {
    const fundraisers = await Fundraiser.find({ creator: req.user._id });
    res.json(fundraisers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ------------------ Admin Controllers ------------------

export const getPendingFundraisers = async (req, res) => {
  try {
    const pendingFundraisers = await Fundraiser.find({ status: "pending" });
    res.json(pendingFundraisers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const verifyFundraiser = async (req, res) => {
  try {
    const { fundraiserId } = req.body;
    if (!fundraiserId) return res.status(400).json({ msg: "Fundraiser ID required" });

    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) return res.status(404).json({ msg: "Fundraiser not found" });

    fundraiser.status = "verified";
    fundraiser.verifiedBy = req.user.email;
    await fundraiser.save();

    res.json({ msg: "Fundraiser verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const rejectFundraiser = async (req, res) => {
  try {
    const { fundraiserId } = req.body;
    if (!fundraiserId) return res.status(400).json({ msg: "Fundraiser ID required" });

    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) return res.status(404).json({ msg: "Fundraiser not found" });

    fundraiser.status = "rejected";
    fundraiser.verifiedBy = req.user.email;
    await fundraiser.save();

    res.json({ msg: "Fundraiser rejected successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ------------------ Superadmin Controllers ------------------

export const getVerifiedFundraisers = async (req, res) => {
  try {
    const verifiedFundraisers = await Fundraiser.find({ status: "verified" });
    res.json(verifiedFundraisers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const publishFundraiser = async (req, res) => {
  try {
    const { fundraiserId } = req.body;
    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) return res.status(404).json({ msg: "Fundraiser not found" });

    fundraiser.status = "published";
    fundraiser.isPublished = true;
    await fundraiser.save();

    res.json({ msg: "Fundraiser published successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ------------------ Public Controllers ------------------

// Get all published fundraisers
export const getPublishedFundraisers = async (req, res) => {
  try {
    let filter = { status: "published" };
    if (req.search) filter.basicDetails = { $regex: req.search, $options: "i" };

    const publishedFundraisers = await Fundraiser.find(filter).populate(
      "creator",
      "name email"
    );
    res.json(publishedFundraisers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Search fundraisers
export const searchFundraisers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ msg: "Query parameter is required" });

    const regex = new RegExp(query, "i");
    const results = await Fundraiser.find({
      status: "published",
      "basicDetails.title": regex,
    }).populate("creator", "name email");

    if (!results.length)
      return res.json({ msg: "No fundraisers found", fundraisers: [] });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Donate to a fundraiser
export const donateToFundraiser = async (req, res) => {
  try {
    const { fundraiserId, amount, donorName, donorEmail } = req.body;
    if (!fundraiserId || !amount) return res.status(400).json({ msg: "Fundraiser ID and amount required" });

    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) return res.status(404).json({ msg: "Fundraiser not found" });

    fundraiser.donations = fundraiser.donations || [];
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
};
