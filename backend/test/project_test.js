const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Project = require('../models/Project');
const { createProject, getProjects, updateProject, deleteProject } = require('../controllers/projectController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

describe('CreateProject Function Test', () => {

  it('should create a new project successfully', async () => {
    // Mock request data
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        name: "New Project",
        category: "AI",
        type: "public",
        description: "Project description",
        fundingGoal: 50000,
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        imageUrl: "http://example.com/image.jpg"
      }
    };

    // Mock project that would be created
    const createdProject = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
      createdBy: req.user._id,
      status: 'active'
    };

    // Stub Project.create to return the createdProject
    const createStub = sinon.stub(Project, 'create').resolves(createdProject);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await createProject(req, res);

    // Assertions
    expect(createStub.calledOnceWith({
      name: req.body.name,
      category: req.body.category,
      type: req.body.type,
      description: req.body.description,
      fundingGoal: req.body.fundingGoal,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      imageUrl: req.body.imageUrl,
      createdBy: req.user._id,
      status: 'active'
    })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdProject)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 400 if required fields are missing', async () => {
    // Mock request data with missing fields
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: { name: "New Project" } // Missing required fields
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await createProject(req, res);

    // Assertions
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'All fields are required' })).to.be.true;
  });

  it('should return 400 if type is invalid', async () => {
    // Mock request data with invalid type
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        name: "New Project",
        category: "AI",
        type: "invalid",
        description: "Project description",
        fundingGoal: 50000,
        startDate: "2025-01-01",
        endDate: "2025-12-31"
      }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await createProject(req, res);

    // Assertions
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Invalid project type' })).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Project.create to throw an error
    const createStub = sinon.stub(Project, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        name: "New Project",
        category: "AI",
        type: "public",
        description: "Project description",
        fundingGoal: 50000,
        startDate: "2025-01-01",
        endDate: "2025-12-31"
      }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await createProject(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});

describe('UpdateProject Function Test', () => {

  it('should update project successfully', async () => {
    // Mock project data
    const projectId = new mongoose.Types.ObjectId();
    const existingProject = {
      _id: projectId,
      name: "Old Project",
      category: "Old Category",
      type: "public",
      description: "Old Description",
      fundingGoal: 10000,
      startDate: new Date(),
      endDate: new Date(),
      status: "active",
      currentFunding: 0,
      imageUrl: "",
      createdBy: new mongoose.Types.ObjectId(),
      save: sinon.stub().resolvesThis(), // Mock save method
    };

    // Stub Project.findById to return mock project
    const findByIdStub = sinon.stub(Project, 'findById').resolves(existingProject);

    // Mock request & response
    const req = {
      params: { id: projectId },
      user: { _id: existingProject.createdBy },
      body: { name: "New Project", category: "AI" }
    };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateProject(req, res);

    // Assertions
    expect(existingProject.name).to.equal("New Project");
    expect(existingProject.category).to.equal("AI");
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if project is not found', async () => {
    const findByIdStub = sinon.stub(Project, 'findById').resolves(null);

    const req = {
      params: { id: new mongoose.Types.ObjectId() },
      user: { _id: new mongoose.Types.ObjectId() },
      body: {}
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateProject(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Project not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 403 if user is not authorized', async () => {
    const existingProject = {
      _id: new mongoose.Types.ObjectId(),
      createdBy: new mongoose.Types.ObjectId(),
    };

    const findByIdStub = sinon.stub(Project, 'findById').resolves(existingProject);

    const req = {
      params: { id: existingProject._id },
      user: { _id: new mongoose.Types.ObjectId() }, // Different user
      body: {}
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateProject(req, res);

    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWith({ message: 'Not authorized' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 400 if type is invalid', async () => {
    const existingProject = {
      _id: new mongoose.Types.ObjectId(),
      createdBy: new mongoose.Types.ObjectId(),
    };

    const findByIdStub = sinon.stub(Project, 'findById').resolves(existingProject);

    const req = {
      params: { id: existingProject._id },
      user: { _id: existingProject.createdBy },
      body: { type: "invalid" }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateProject(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'Invalid project type' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Project, 'findById').throws(new Error('DB Error'));

    const req = {
      params: { id: new mongoose.Types.ObjectId() },
      user: { _id: new mongoose.Types.ObjectId() },
      body: {}
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateProject(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });

});

describe('GetProjects Function Test', () => {

  it('should return projects for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock project data
    const projects = [
      { _id: new mongoose.Types.ObjectId(), name: "Project 1", createdBy: userId },
      { _id: new mongoose.Types.ObjectId(), name: "Project 2", createdBy: userId }
    ];

    // Mock query object
    const mockQuery = {
      sort: sinon.stub().resolves(projects)
    };

    // Stub Project.find to return mock query
    const findStub = sinon.stub(Project, 'find').returns(mockQuery);

    // Mock request & response
    const req = { user: { _id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getProjects(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ createdBy: userId })).to.be.true;
    expect(mockQuery.sort.calledOnceWith({ createdAt: -1 })).to.be.true;
    expect(res.json.calledWith(projects)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Mock query that throws error
    const mockQuery = {
      sort: sinon.stub().rejects(new Error('DB Error'))
    };

    // Stub Project.find to return mock query
    const findStub = sinon.stub(Project, 'find').returns(mockQuery);

    // Mock request & response
    const req = { user: { _id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getProjects(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});

describe('DeleteProject Function Test', () => {

  it('should delete a project successfully', async () => {
    // Mock request data
    const req = { 
      params: { id: new mongoose.Types.ObjectId().toString() },
      user: { _id: new mongoose.Types.ObjectId() }
    };

    // Mock project found in the database
    const project = {
      _id: req.params.id,
      createdBy: req.user._id,
      deleteOne: sinon.stub().resolves()
    };

    // Stub Project.findById to return the mock project
    const findByIdStub = sinon.stub(Project, 'findById').resolves(project);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteProject(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(project.deleteOne.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Project deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if project is not found', async () => {
    // Stub Project.findById to return null
    const findByIdStub = sinon.stub(Project, 'findById').resolves(null);

    // Mock request data
    const req = { 
      params: { id: new mongoose.Types.ObjectId().toString() },
      user: { _id: new mongoose.Types.ObjectId() }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteProject(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Project not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 403 if user is not authorized', async () => {
    const project = {
      _id: new mongoose.Types.ObjectId(),
      createdBy: new mongoose.Types.ObjectId(),
    };

    const findByIdStub = sinon.stub(Project, 'findById').resolves(project);

    const req = {
      params: { id: project._id },
      user: { _id: new mongoose.Types.ObjectId() }, // Different user
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await deleteProject(req, res);

    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWith({ message: 'Not authorized' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Project.findById to throw an error
    const findByIdStub = sinon.stub(Project, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { 
      params: { id: new mongoose.Types.ObjectId().toString() },
      user: { _id: new mongoose.Types.ObjectId() }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteProject(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});