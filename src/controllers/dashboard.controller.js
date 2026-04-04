import Transaction from "../models/transaction.model.js";
import mongoose from "mongoose";

 const getSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const income = await Transaction.aggregate([
      { $match: { userId, type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

  
    const expense = await Transaction.aggregate([
      { $match: { userId, type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

 
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);


    const recent = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(5);

    const monthly = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;

    res.status(200).json({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      categoryBreakdown,
      recentTransactions: recent,
      monthlyTrends: monthly
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getsummaryByUserId = async (req, res) => {
  try {
    let match = {};

    if (req.params.userId) {
      match.userId = new mongoose.Types.ObjectId(req.params.userId);
    }

    const income = await Transaction.aggregate([
      { $match: { ...match, type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);


    const expense = await Transaction.aggregate([
      { $match: { ...match, type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;


    const categoryBreakdown = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    const recent = await Transaction.find(match)
      .sort({ date: -1 })
      .limit(5);

    const monthly = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.status(200).json({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      categoryBreakdown,
      recentTransactions: recent,
      monthlyTrends: monthly
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export default { getSummary, getsummaryByUserId };  