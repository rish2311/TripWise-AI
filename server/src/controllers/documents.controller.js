const { uploadDocument } = require('../services/itinerary.service');
const Document = require('../models/Document');
const { deleteFromS3 } = require('../services/s3.service');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * POST /api/documents/upload  [Protected, multipart]
 */
const uploadDoc = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file uploaded. Please select a file.', 400);
  }

  const fileType = req.body.fileType || 'other';
  const document = await uploadDocument(req.file, req.user._id, fileType);

  res.status(201).json({
    status: 'success',
    data: { documentId: document._id, document },
  });
});

/**
 * GET /api/documents/:id  [Protected]
 */
const getDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, userId: req.user._id });
  if (!document) throw new AppError('Document not found.', 404);

  res.status(200).json({
    status: 'success',
    data: { document },
  });
});

/**
 * DELETE /api/documents/:id  [Protected]
 */
const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, userId: req.user._id });
  if (!document) throw new AppError('Document not found.', 404);

  await deleteFromS3(document.s3Key);
  await document.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Document deleted successfully.',
  });
});

module.exports = { uploadDoc, getDocument, deleteDocument };
