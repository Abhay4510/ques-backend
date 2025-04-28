const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  project: { 
    type: String, 
    required: true, 
    unique: true 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;