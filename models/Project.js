const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  project: { 
    type: String, 
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

projectSchema.index({ project: 1, user: 1 }, { unique: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;