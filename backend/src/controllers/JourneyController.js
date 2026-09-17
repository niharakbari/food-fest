const JourneyService = require('../services/JourneyService');

const JourneyController = {
    getJourneys: async (req, res, next) => {
        try {
            const journeys = await JourneyService.getJourneys();
            
            res.status(200).json({
                success: true,
                count: journeys.length,
                data: journeys
            });
        } catch (error) {
            next(error);
        }
    },

    createJourney: async (req, res, next) => {
        try {
            const newJourneyId = await JourneyService.createJourney(req.body);
            res.status(201).json({
                success: true,
                data: { id: newJourneyId, ...req.body }
            });
        } catch (error) {
            next(error);
        }
    },

    updateJourney: async (req, res, next) => {
        try {
            const affectedRows = await JourneyService.updateJourney(req.params.id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Journey item not found' });
            }
            res.status(200).json({ success: true, message: 'Journey item updated successfully' });
        } catch (error) {
            next(error);
        }
    },

    deleteJourney: async (req, res, next) => {
        try {
            const affectedRows = await JourneyService.deleteJourney(req.params.id);
            if (affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Journey item not found' });
            }
            res.status(200).json({ success: true, message: 'Journey item deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = JourneyController;
