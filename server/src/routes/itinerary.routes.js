const express = require('express');
const {
  generate,
  listItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary,
  shareItinerary,
  getSharedItinerary,
} = require('../controllers/itinerary.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public shared route
router.get('/share/:shareId', getSharedItinerary);

// Protected routes
router.use(protect);

router.post('/generate', generate);
router.get('/', listItineraries);
router.get('/:id', getItinerary);
router.patch('/:id', updateItinerary);
router.delete('/:id', deleteItinerary);
router.post('/:id/share', shareItinerary);

module.exports = router;
