import express from "express";
import dashboardController from "../controllers/dashboard.controller.js";
import auth from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/summary", auth, authorize(["admin", "analyst", "viewer"]), dashboardController.getSummary);
router.get("/user/:userId", auth, authorize(["admin", "analyst"]), dashboardController.getsummaryByUserId);
router.get("/users", auth,authorize(["admin", "analyst"]), dashboardController.getsummaryByUserId);


export default router;