const Document = require('../models/Document');
const Itinerary = require('../models/Itinerary');
const { uploadToS3, deleteFromS3 } = require('./s3.service');
const { extractTravelData, generateItinerary } = require('./ai.service');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Upload a document to S3 and save its record to MongoDB.
 * @param {Object} file - multer file object (buffer, mimetype, originalname, size)
 * @param {string} userId
 * @param {string} fileType - 'flight' | 'hotel' | 'train' | 'bus' | 'visa' | 'other'
 * @returns {Object} document record
 */
const uploadDocument = async (file, userId, fileType = 'other') => {
  const { fileUrl, s3Key } = await uploadToS3(file.buffer, file.originalname, file.mimetype);

  const document = await Document.create({
    userId,
    fileUrl,
    s3Key,
    originalName: file.originalname,
    fileType,
    mimeType: file.mimetype,
    size: file.size,
  });

  logger.info(`Document uploaded: ${document._id} by user ${userId}`);
  return document;
};

/**
 * Full AI pipeline: extract → generate → save Itinerary.
 * @param {string} documentId
 * @param {string} userId
 * @returns {Object} itinerary
 */
const generateItineraryFromDocument = async (documentId, userId) => {
  const document = await Document.findOne({ _id: documentId, userId });
  if (!document) {
    throw new AppError('Document not found.', 404);
  }

  // Check no itinerary already exists for this document
  const existing = await Itinerary.findOne({ documentId, userId });
  if (existing) {
    return existing;
  }

  // Step 1: Extract travel data via Gemini
  logger.info(`Starting AI extraction for document ${documentId}`);

  // We need the file buffer — re-fetch from S3 or pass buffer from controller.
  // Since multer stored in memory during upload, we pass the buffer at upload time.
  // For /generate called post-upload, we fetch file from S3.
  const { fetchFileFromS3 } = require('./s3.service');
  const { buffer, contentType } = await fetchFileFromS3(document.s3Key);

  const extractedData = await extractTravelData(buffer, contentType || document.mimeType);

  // Step 2: Generate itinerary markdown
  logger.info(`Starting itinerary generation for document ${documentId}`);
  const itineraryMarkdown = await generateItinerary(extractedData);

  // Step 3: Derive title
  const destination = extractedData.destination || 'My Trip';
  const title = `Trip to ${destination}`;

  // Step 4: Save to MongoDB
  const itinerary = await Itinerary.create({
    userId,
    documentId,
    title,
    destination: extractedData.destination,
    startDate: extractedData.startDate ? new Date(extractedData.startDate) : null,
    endDate: extractedData.endDate ? new Date(extractedData.endDate) : null,
    extractedData,
    itinerary: itineraryMarkdown,
  });

  logger.info(`Itinerary created: ${itinerary._id}`);
  return itinerary;
};

/**
 * Delete an itinerary and its associated document + S3 file.
 */
const deleteItineraryAndDocument = async (itineraryId, userId) => {
  const itinerary = await Itinerary.findOne({ _id: itineraryId, userId });
  if (!itinerary) throw new AppError('Itinerary not found.', 404);

  const document = await Document.findById(itinerary.documentId);
  if (document) {
    await deleteFromS3(document.s3Key);
    await document.deleteOne();
  }

  await itinerary.deleteOne();
};

module.exports = { uploadDocument, generateItineraryFromDocument, deleteItineraryAndDocument };
