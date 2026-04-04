import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { createTransaction, getTransactions, updateTransaction, deleteTransaction,getTransactionForUser } from "../controllers/transaction.controller.js";

const router = express.Router();


router.post("/", auth, authorize(["admin"]), createTransaction);
router.get("/", auth, authorize(["analyst","admin"]), getTransactions);
router.put("/:id", auth, authorize(["admin"]), updateTransaction);
router.delete("/:id", auth, authorize(["admin"]), deleteTransaction);
router.get("/me", auth, authorize(["admin","analyst"]), getTransactionForUser);

export default router;

