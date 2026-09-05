const { validationResult } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { ROLES } = require("../utils/constants");

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
    return true; // stop
  }
  return false;
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    if (handleValidation(req, res)) return;

    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(409);
      return res.json({ message: "Email already registered" });
    }

    // Allow only member/manager on signup (admin should be seeded)
    let safeRole = ROLES.MEMBER;
    if (role === ROLES.MANAGER) safeRole = ROLES.MANAGER;

    const user = await User.create({
      name,
      email,
      password,
      role: safeRole,
    });

    const token = generateToken({ id: user._id, role: user.role });

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    if (handleValidation(req, res)) return;

    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user || !user.isActive) {
      res.status(401);
      return res.json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      return res.json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isActive) {
      res.status(401);
      return res.json({ message: "Not authorized" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };