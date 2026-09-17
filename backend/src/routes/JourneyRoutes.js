const express = require('express');
const router = express.Router();
const JourneyController = require('../controllers/JourneyController');

router.get('/', JourneyController.getJourneys);
router.post('/', JourneyController.createJourney);
router.put('/:id', JourneyController.updateJourney);
router.delete('/:id', JourneyController.deleteJourney);

module.exports = router;
