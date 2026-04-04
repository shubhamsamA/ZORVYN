import express from "express";
import { getUsers, createUser,
  updateUser,
  deleteUser,
  changeUserRole } from "../controllers/user.controller.js";
import auth from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", auth, authorize(["admin"]), createUser);
router.get("/", auth, authorize(["admin"]), getUsers);
router.put("/:id", auth, authorize(["admin"]), updateUser);
router.delete("/:id", auth, authorize(["admin"]), deleteUser);
router.patch("/:id/role", auth, authorize(["admin"]), changeUserRole);

export default router;