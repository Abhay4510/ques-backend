const Project = require('../models/Project');
const Episode = require('../models/Episode');

exports.createProject = async (req, res) => {
  try {
    const { project } = req.body;
    
    if (!project) {
      return res.status(400).json({ 
        status: "failed",
        message: "Project name is required" 
      });
    }
    
    const newProject = new Project({
      project,
      user: req.user._id
    });
    
    await newProject.save();
    
    res.status(201).json({
      status: "success",
      message: "Project created successfully",
      data: {
        _id: newProject._id,
        project: newProject.project,
        createdAt: newProject.createdAt,
        updatedAt: newProject.updatedAt
      }
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.project) {
      return res.status(409).json({
        status: "failed",
        message: "Project with this name already exists"
      });
    }
    
    console.error("Project creation failed:", error.message);
    res.status(500).json({ 
      status: "failed",
      message: "Internal Server Error" 
    });
  }
};

exports.createEpisode = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, transcript } = req.body;
    
    if (!name || !transcript) {
      return res.status(400).json({ 
        status: "failed",
        message: "Episode name and transcript are required" 
      });
    }
    
    const project = await Project.findOne({ 
      _id: projectId,
      user: req.user._id
    });
    
    if (!project) {
      return res.status(404).json({ 
        status: "failed",
        message: "Project not found" 
      });
    }
    
    const newEpisode = new Episode({
      project: projectId,
      name,
      transcript
    });
    
    await newEpisode.save();
    
    res.status(201).json({
      status: "success",
      message: "Episode created successfully",
      data: newEpisode
    });
  } catch (error) {
    console.error("Episode creation failed:", error.message);
    res.status(500).json({ 
      status: "failed",
      message: "Internal Server Error" 
    });
  }
};

exports.updateEpisodeTranscript = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { episodeId, transcript } = req.body;
    
    if (!episodeId || !transcript) {
      return res.status(400).json({ 
        status: "failed",
        message: "Episode ID and transcript are required" 
      });
    }
    
    const project = await Project.findOne({ 
      _id: projectId,
      user: req.user._id
    });
    
    if (!project) {
      return res.status(404).json({ 
        status: "failed",
        message: "Project not found" 
      });
    }
    
    const episode = await Episode.findOne({
      _id: episodeId,
      project: projectId
    });
    
    if (!episode) {
      return res.status(404).json({ 
        status: "failed",
        message: "Episode not found" 
      });
    }
    
    episode.transcript = transcript;
    await episode.save();
    
    res.status(200).json({
      status: "success",
      message: "Episode transcript updated successfully",
      data: episode
    });
  } catch (error) {
    console.error("Episode update failed:", error.message);
    res.status(500).json({ 
      status: "failed",
      message: "Internal Server Error" 
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id });
    
    const projectsWithEpisodeCounts = await Promise.all(
      projects.map(async (project) => {
        const episodeCount = await Episode.countDocuments({ project: project._id });
        return {
          _id: project._id,
          project: project.project,
          totalEpisodes: episodeCount,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt
        };
      })
    );
    
    res.status(200).json({
      status: "success",
      data: projectsWithEpisodeCounts
    });
  } catch (error) {
    console.error("Get all projects failed:", error.message);
    res.status(500).json({ 
      status: "failed",
      message: "Internal Server Error" 
    });
  }
};

exports.getAllEpisodesOfProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findOne({ 
      _id: projectId,
      user: req.user._id
    });
    
    if (!project) {
      return res.status(404).json({ 
        status: "failed",
        message: "Project not found" 
      });
    }
    
    const episodes = await Episode.find({ project: projectId })
      .select('name createdAt updatedAt');
    
    res.status(200).json({
      status: "success",
      projectName: project.project,
      data: episodes
    });
  } catch (error) {
    console.error("Get episodes failed:", error.message);
    res.status(500).json({ 
      status: "failed",
      message: "Internal Server Error" 
    });
  }
};

exports.getEpisodeById = async (req, res) => {
  try {
    const { projectId, episodeId } = req.params;
    
    const project = await Project.findOne({ 
      _id: projectId,
      user: req.user._id
    });
    
    if (!project) {
      return res.status(404).json({ 
        status: "failed",
        message: "Project not found" 
      });
    }
    
    const episode = await Episode.findOne({
      _id: episodeId,
      project: projectId
    });
    
    if (!episode) {
      return res.status(404).json({ 
        status: "failed",
        message: "Episode not found" 
      });
    }
    
    res.status(200).json({
      status: "success",
      data: episode
    });
  } catch (error) {
    console.error("Get episode failed:", error.message);
    res.status(500).json({ 
      status: "failed",
      message: "Internal Server Error" 
    });
  }
};

exports.deleteEpisodeById = async (req, res) => {
  try {
    const { projectId, episodeId } = req.params;
    
    const project = await Project.findOne({ 
      _id: projectId,
      user: req.user._id
    });
    
    if (!project) {
      return res.status(404).json({ 
        status: "failed",
        message: "Project not found" 
      });
    }
    
    const episode = await Episode.findOneAndDelete({
      _id: episodeId,
      project: projectId
    });
    
    if (!episode) {
      return res.status(404).json({ 
        status: "failed",
        message: "Episode not found" 
      });
    }
    
    res.status(200).json({
      status: "success",
      message: "Episode deleted successfully",
      data: {
        _id: episode._id,
        name: episode.name
      }
    });
  } catch (error) {
    console.error("Delete episode failed:", error.message);
    res.status(500).json({ 
      status: "failed",
      message: "Internal Server Error" 
    });
  }
};