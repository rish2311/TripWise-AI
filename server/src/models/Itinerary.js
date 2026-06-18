const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      default: null,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    extractedData: {
      flights: { type: Array, default: [] },
      hotels: { type: Array, default: [] },
      trains: { type: Array, default: [] },
      travelers: { type: String, default: null },
      otherDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    itinerary: {
      type: String, // Markdown content
      required: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      default: null,
      index: true,
      sparse: true,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;
