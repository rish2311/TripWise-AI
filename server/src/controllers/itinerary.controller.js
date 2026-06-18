const { generateItineraryFromDocument, deleteItineraryAndDocument } = require('../services/itinerary.service');
const Itinerary = require('../models/Itinerary');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { nanoid } = require('nanoid');

/**
 * POST /api/itineraries/generate  [Protected]
 * Body: { documentId }
 */
const generate = asyncHandler(async (req, res) => {
  const { documentId } = req.body;
  if (!documentId) throw new AppError('documentId is required.', 400);

  const itinerary = await generateItineraryFromDocument(documentId, req.user._id);

  res.status(201).json({
    status: 'success',
    data: { itinerary },
  });
});

/**
 * GET /api/itineraries  [Protected]
 */
const listItineraries = asyncHandler(async (req, res) => {
  const itineraries = await Itinerary.find({ userId: req.user._id })
    .select('title destination startDate endDate createdAt isShared shareId')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: itineraries.length,
    data: { itineraries },
  });
});

/**
 * GET /api/itineraries/:id  [Protected]
 */
const getItinerary = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findOne({ _id: req.params.id, userId: req.user._id }).populate(
    'documentId',
    'fileUrl fileType originalName'
  );

  if (!itinerary) throw new AppError('Itinerary not found.', 404);

  res.status(200).json({
    status: 'success',
    data: { itinerary },
  });
});

/**
 * PATCH /api/itineraries/:id  [Protected]
 * Body: { title?, itinerary? }
 */
const updateItinerary = asyncHandler(async (req, res) => {
  const { title, itinerary: content } = req.body;

  const updates = {};
  if (title !== undefined) updates.title = title;
  if (content !== undefined) {
    updates.itinerary = content;
    updates.isEdited = true;
  }

  const itinerary = await Itinerary.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!itinerary) throw new AppError('Itinerary not found.', 404);

  res.status(200).json({
    status: 'success',
    data: { itinerary },
  });
});

/**
 * DELETE /api/itineraries/:id  [Protected]
 */
const deleteItinerary = asyncHandler(async (req, res) => {
  await deleteItineraryAndDocument(req.params.id, req.user._id);

  res.status(200).json({
    status: 'success',
    message: 'Itinerary and associated document deleted.',
  });
});

/**
 * POST /api/itineraries/:id/share  [Protected]
 */
const shareItinerary = asyncHandler(async (req, res) => {
  let itinerary = await Itinerary.findOne({ _id: req.params.id, userId: req.user._id });
  if (!itinerary) throw new AppError('Itinerary not found.', 404);

  if (!itinerary.shareId) {
    itinerary.shareId = nanoid(10);
    itinerary.isShared = true;
    await itinerary.save();
  }

  const shareUrl = `/share/${itinerary.shareId}`;

  res.status(200).json({
    status: 'success',
    data: { shareUrl, shareId: itinerary.shareId },
  });
});

/**
 * GET /api/share/:shareId  [Public]
 */
const getSharedItinerary = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findOne({
    shareId: req.params.shareId,
    isShared: true,
  }).select('title destination startDate endDate extractedData itinerary createdAt');

  if (!itinerary) throw new AppError('Shared itinerary not found or link has been disabled.', 404);

  res.status(200).json({
    status: 'success',
    data: { itinerary },
  });
});

module.exports = { generate, listItineraries, getItinerary, updateItinerary, deleteItinerary, shareItinerary, getSharedItinerary };
