const Project = require('../models/Project');

const createProject = async (req, res) => {
  const { name, category, description, fundingGoal, startDate, endDate } = req.body;

  if (!name || !category || !description || !fundingGoal || !startDate || !endDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const project = await Project.create({
      name,
      category,
      description,
      fundingGoal,
      startDate,
      endDate,
      createdBy: req.user._id,
      status: 'active',
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, category, description, fundingGoal, startDate, endDate, status, currentFunding } = req.body;

    project.name = name ?? project.name;
    project.category = category ?? project.category;
    project.description = description ?? project.description;
    project.fundingGoal = fundingGoal ?? project.fundingGoal;
    project.startDate = startDate ?? project.startDate;
    project.endDate = endDate ?? project.endDate;
    project.status = status ?? project.status;
    project.currentFunding = currentFunding ?? project.currentFunding;

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await project.remove();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject };
