const Project = require('../models/Project');

const createProject = async (req, res) => {
  const { name, category, type, description, fundingGoal, startDate, endDate, imageUrl } = req.body;

  if (!name || !category || !type || !description || !fundingGoal || !startDate || !endDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!['public', 'private', 'hybrid'].includes(type)) {
    return res.status(400).json({ message: 'Invalid project type' });
  }

  try {
    const project = await Project.create({
      name,
      category,
      type,
      description,
      fundingGoal,
      startDate,
      endDate,
      imageUrl: imageUrl || null,
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

    const { name, category, type, description, fundingGoal, startDate, endDate, status, currentFunding, imageUrl } = req.body;

    if (type && !['public', 'private', 'hybrid'].includes(type)) {
      return res.status(400).json({ message: 'Invalid project type' });
    }

    project.name = name ?? project.name;
    project.category = category ?? project.category;
    project.type = type ?? project.type;
    project.description = description ?? project.description;
    project.fundingGoal = fundingGoal ?? project.fundingGoal;
    project.startDate = startDate ?? project.startDate;
    project.endDate = endDate ?? project.endDate;
    project.status = status ?? project.status;
    project.currentFunding = currentFunding ?? project.currentFunding;
    project.imageUrl = imageUrl ?? project.imageUrl;

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

// Admin: Get all pending deletion requests
const getPendingDeletionRequests = async (req, res) => {
  try {
    const projects = await Project.find({ deletionRequested: true })
      .populate('createdBy', 'name email')
      .sort({ deletionRequestedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: Request project deletion
const requestProjectDeletion = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { reason, justification } = req.body;
    project.deletionRequested = true;
    project.deletionRequestedAt = new Date();
    project.deletionRequestReason = reason || 'No reason provided';
    project.deletionRequestJustification = justification || 'No justification provided';

    await project.save();
    res.json({ message: 'Deletion request submitted', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Approve project deletion
const approveDeletion = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.deletionRequested) {
      return res.status(400).json({ message: 'No deletion request for this project' });
    }

    await project.remove();
    res.json({ message: 'Project deletion approved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Reject project deletion
const rejectDeletion = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.deletionRequested) {
      return res.status(400).json({ message: 'No deletion request for this project' });
    }

    project.deletionRequested = false;
    project.deletionRequestedAt = null;
    project.deletionRequestReason = null;
    project.deletionRequestJustification = null;

    await project.save();
    res.json({ message: 'Project deletion rejected', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject, getPendingDeletionRequests, requestProjectDeletion, approveDeletion, rejectDeletion };
