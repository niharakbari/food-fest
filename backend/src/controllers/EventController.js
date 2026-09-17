const EventService = require('../services/EventService');

const EventController = {
    getEvents: async (req, res, next) => {
        try {
            const { categoryId } = req.query;
            const events = await EventService.getEvents(categoryId);
            
            res.status(200).json({
                success: true,
                count: events.length,
                data: events
            });
        } catch (error) {
            next(error);
        }
    },

    getEventById: async (req, res, next) => {
        try {
            const event = await EventService.getEventById(req.params.id);
            
            res.status(200).json({
                success: true,
                data: event
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = EventController;
