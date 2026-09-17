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
    },

    createEvent: async (req, res, next) => {
        try {
            const newEventId = await EventService.createEvent(req.body);
            res.status(201).json({
                success: true,
                data: { id: newEventId, ...req.body }
            });
        } catch (error) {
            next(error);
        }
    },

    updateEvent: async (req, res, next) => {
        try {
            const affectedRows = await EventService.updateEvent(req.params.id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }
            res.status(200).json({ success: true, message: 'Event updated successfully' });
        } catch (error) {
            next(error);
        }
    },

    deleteEvent: async (req, res, next) => {
        try {
            const affectedRows = await EventService.deleteEvent(req.params.id);
            if (affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }
            res.status(200).json({ success: true, message: 'Event deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = EventController;
