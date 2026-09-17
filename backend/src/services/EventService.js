const EventModel = require('../models/EventModel');
const AppError = require('../utils/AppError');

const EventService = {
    getEvents: async (categoryId) => {
        const events = await EventModel.getAllEvents(categoryId);
        // Add any business logic here, e.g., formatting dates or calculating time until event
        return events;
    },

    getEventById: async (id) => {
        const event = await EventModel.getEventById(id);
        if (!event) {
            throw new AppError('Event not found', 404);
        }
        return event;
    }
};

module.exports = EventService;
