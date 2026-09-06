const mongoose = require("mongoose");
const User = require("../models/User");
const { ROLES } = require("../utils/constants");

// GET /api/users (admin)
const listUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q = "", role, isActive } = req.query;

    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    if (role) filter.role = role;
    if (isActive === "true") filter.isActive = true;
    if (isActive === "false") filter.isActive = false;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      User.find(filter)
        .select("name email role isActive createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(filter),
    ]);

    res.json({ page: pageNum, limit: limitNum, total, items });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id (admin)
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      return res.json({ message: "Invalid user id" });
    }

    const user = await User.findById(id)
      .select("name email role isActive createdAt updatedAt")
      .lean();

    if (!user) {
      res.status(404);
      return res.json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id/role (admin)
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      return res.json({ message: "Invalid user id" });
    }

    if (!role) {
      res.status(400);
      return res.json({ message: "role is required" });
    }

    // Allow only roles in constants
    const allowedRoles = Object.values(ROLES);
    if (!allowedRoles.includes(role)) {
      res.status(400);
      return res.json({ message: `role must be one of: ${allowedRoles.join(", ")}` });
    }

    // Prevent admin from changing their own role accidentally
    if (String(req.user.id) === String(id) && role !== ROLES.ADMIN) {
      res.status(400);
      return res.json({ message: "You cannot remove your own admin role" });
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      return res.json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      message: "User role updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/:id/status (admin)
const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      return res.json({ message: "Invalid user id" });
    }

    if (typeof isActive !== "boolean") {
      res.status(400);
      return res.json({ message: "isActive must be boolean" });
    }

    // Prevent admin from deactivating themselves
    if (String(req.user.id) === String(id) && isActive === false) {
      res.status(400);
      return res.json({ message: "You cannot deactivate your own account" });
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      return res.json({ message: "User not found" });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      message: "User status updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/users (admin/manager)
const createUser = async (req, res, next) => {
  try {
    const { name, email, password = "Password123!", role = ROLES.MEMBER } = req.body;

    if (!name || !email) {
      res.status(400);
      return res.json({ message: "Name and email are required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(409);
      return res.json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  createUser,
};