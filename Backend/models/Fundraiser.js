import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donorName: String,
  donorEmail: String,
  amount: { type: Number, required: true },
  donatedAt: { type: Date, default: Date.now },
});

const fundraiserSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  basicDetails: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    target: { type: Number, default: 0 }, // new target field
  },
  proofs: [{ type: String }],
  accountDetails: {
    bankName: String,
    accountNumber: String,
    ifsc: String,
  },
  status: {
    type: String,
    enum: ["pending", "verified", "published", "rejected"],
    default: "pending",
  },
  verifiedBy: String, // admin email
  amountRaised: { type: Number, default: 0 },
  donations: [donationSchema],
}, { timestamps: true });

export default mongoose.model("Fundraiser", fundraiserSchema);
