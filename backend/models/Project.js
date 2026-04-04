const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  type: {
    type: String,
    enum: ['public', 'private', 'hybrid'],
    default: 'public',
    required: true,
  },
  description: { type: String, required: true },
  imageUrl: { type: String, default: null }, // Store base64 image data
  fundingGoal: { type: Number, required: true },
  currentFunding: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, default: 'draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deletionRequested: { type: Boolean, default: false },
  deletionRequestedAt: { type: Date, default: null },
  deletionRequestReason: { type: String, default: null },
  deletionRequestJustification: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
