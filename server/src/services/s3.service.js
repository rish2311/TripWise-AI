const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_REGION || 'us-east-1';

/**
 * Upload a file buffer to S3.
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} originalName - Original filename
 * @param {string} mimeType - MIME type
 * @returns {{ fileUrl: string, s3Key: string }}
 */
const uploadToS3 = async (fileBuffer, originalName, mimeType) => {
  const ext = path.extname(originalName);
  const s3Key = `documents/${uuidv4()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);

  const fileUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${s3Key}`;
  return { fileUrl, s3Key };
};

/**
 * Delete a file from S3 by key.
 * @param {string} s3Key
 */
const deleteFromS3 = async (s3Key) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });
  await s3Client.send(command);
};

/**
 * Fetch a file from S3 as a Buffer.
 * @param {string} s3Key
 * @returns {{ buffer: Buffer, contentType: string }}
 */
const fetchFileFromS3 = async (s3Key) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });

  const response = await s3Client.send(command);
  const chunks = [];
  for await (const chunk of response.Body) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  return { buffer, contentType: response.ContentType };
};

module.exports = { uploadToS3, deleteFromS3, fetchFileFromS3 };

