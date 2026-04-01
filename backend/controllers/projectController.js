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

module.exports = { createProject, getProjects };
