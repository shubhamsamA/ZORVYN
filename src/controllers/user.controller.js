import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  const allowedRoles = ["viewer", "analyst"];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hash,
    role,
  });

  res.status(201).json({
    message: "User created successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};

// Get All Users
export const getUsers = async (req, res) => {
  const users = await User.find({ isActive: true }).select("-password");
  res.json(users);
};

// Update User
export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });

  res.status(200).json({
    message: "User updated",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};

// Soft Delete User
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { returnDocument: "after" },
  );

  res.status(200).json({
    message: "User deactivated",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};

// Change Role
export const changeUserRole = async (req, res) => {
  const { role } = req.body;

  const allowedRoles = ["viewer", "analyst", "admin"];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  if (req.user.id === req.params.id) {
    return res.status(400).json({ message: "Cannot change your own role" });
  }

  const user = await User.findByIdAndUpdate(
    { _id: req.params.id },
    { role },
    { returnDocument: "after"},
  );

  res.status(200).json({
    message: "Role updated",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};
