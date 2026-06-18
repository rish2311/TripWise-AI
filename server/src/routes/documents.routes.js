const express = require('express');
const { uploadDoc, getDocument, deleteDocument } = require('../controllers/documents.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// All document routes require authentication
router.use(protect);

router.post('/upload', upload.single('file'), uploadDoc);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);

module.exports = router;
