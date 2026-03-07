const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  budget: { type: String, required: true },
  timeline: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: String, required: true },
  aiSummary: { type: String },
  communityImpact: { type: String },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  radius: { type: Number, default: 1000 }, // radius in meters
  beforeImage: { type: String },
  afterImage: { type: String },
  status: { type: String, enum: ['planned', 'ongoing', 'completed'], default: 'planned' },
  createdAt: { type: Date, default: Date.now }
});

ProjectSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Project', ProjectSchema);
