import Transaction from "../models/transaction.model.js";

// Create Transaction
export const createTransaction = async (req, res) => {
  const { amount, type, category, notes, userId,date } = req.body;
  if (!amount || !type || !category) {
    return res
      .status(400)
      .json({ message: "Amount, type and category are required" });
  }
  let validTypes = ["income", "expense"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid transaction type" });
  }
  if (amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number" });
  }

  let validCategories = [
    "salary",
    "freelance",
    "food",
    "rent",
    "shopping",
    "travel",
    "health",
    "education",
    "other",
  ];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ message: "Invalid transaction category" });
  }

  let targetID = userId || req.user.id;

  try {
    const transaction = await Transaction.create({
      amount,
      type,
      category,
      notes,
      userId: targetID,
      date: date ? new Date(date) : new Date(), // Use provided date in format like "2024-08-15T14:48:00.000Z" or default to current date if not provided
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Transactions
export const getTransactions = async (req, res) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      userId,
    } = req.query;

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Number(limit), 50);

    let filter = {};

    if (userId) {
      filter.userId = userId;
    }

    // filters
    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const skip = (pageNum - 1) * limitNum;

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: transactions,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Transaction
export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, type, category, notes } = req.body;
  if (amount !== undefined && amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number" });
  }
  if (type) {
    let validTypes = ["income", "expense"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }
  }
  if (category) {
    let validCategories = [
      "salary",
      "freelance",
      "food",
      "rent",
      "shopping",
      "travel",
      "health",
      "education",
      "other",
    ];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid transaction category" });
    }
  }


  try {
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, type, category, notes },
      { new: true },
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (err) {
    res.status(500).json({ message: "An error occurred while updating the transaction" });
  }
};

// Delete Transaction
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findByIdAndDelete(id);
  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  res.json({ message: "Transaction deleted successfully" });
};

export const getTransactionForUser = async (req, res) => {
  const  userId  = req.user.id;  
  const transactions = await Transaction.find({ userId: userId }).sort({ date: -1 });
  res.status(200).json(transactions);
};
