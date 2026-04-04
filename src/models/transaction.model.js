import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  category: {
    type: String,
    enum: [
      "salary",
      "freelance",
      "food",
      "rent",
      "shopping",
      "travel",
      "health",
      "education",
      "other",
    ],
    required: true,
  },
  date: { type: Date, default: Date.now },
  notes: String,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
