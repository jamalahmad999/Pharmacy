const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  notes: String,
  prescriptionImages: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    format: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  adminNotes: String,
  rejectionReason: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
prescriptionSchema.index({ createdAt: -1 });
prescriptionSchema.index({ status: 1 });
prescriptionSchema.index({ patientName: 'text', phone: 'text', address: 'text' });

module.exports = mongoose.model('Prescription', prescriptionSchema);
