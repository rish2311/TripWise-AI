const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    s3Key: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['flight', 'hotel', 'train', 'bus', 'visa', 'other'],
      default: 'other',
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number, // bytes
    },
  },
  {
    timestamps: { createdAt: 'uploadedAt', updatedAt: false },
  }
);

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
