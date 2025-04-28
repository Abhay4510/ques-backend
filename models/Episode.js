const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: { 
    type: String, 
    required: true 
  },
  transcript: { 
    type: String, 
    required: true
  }
}, { timestamps: true });

const Episode = mongoose.model('Episode', episodeSchema);
module.exports = Episode;