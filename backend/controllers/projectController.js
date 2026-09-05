const { validationResult } = require("express-validator");
const Project = require("../models/Project");

// GET /api/projects  (protected)
const getProjects = async (req, res, next) => {
  try {
    const { q, isActive = "true" } = req.query;

    const filter = {};
    if (isActive === "true") filter.isActive = true;
    if (isActive === "false") filter.isActive = false;

    if (q) filter.name = { $regex: q, $options: "i" };

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .populate("members", "name email role");

    res.json({ count: projects.length, projects });
  } catch (err) {
    next(err);
  }
};

// POST /api/projects  (manager/admin)
const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.json({ message: "Validation failed", errors: errors.array() });
    }

    const { name, description = "", color = "#3B82F6", members = [] } = req.body;

    const exists = await Project.findOne({ name: name.trim() });
    if (exists) {
      res.status(409);
      return res.json({ message: "Project name already exists" });
    }

    const project = await Project.create({
      name: name.trim(),
      description,
      color,
      members,
    });

    res.status(201).json({ message: "Project created", project });
  } catch (err) {
    next(err);
  }
};

// PUT /api/projects/:id  (manager/admin)
const updateProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.json({ message: "Validation failed", errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, color, members, isActive } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      res.status(404);
      return res.json({ message: "Project not found" });
    }

    if (name !== undefined) project.name = name.trim();
    if (description !== undefined) project.description = description;
    if (color !== undefined) project.color = color;
    if (members !== undefined) project.members = members;
    if (isActive !== undefined) project.isActive = isActive;

    await project.save();

    res.json({ message: "Project updated", project });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/projects/:id  (manager/admin)
const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      res.status(404);
      return res.json({ message: "Project not found" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};