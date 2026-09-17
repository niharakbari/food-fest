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
    },

    createEvent: async (eventData) => {
        return await EventModel.createEvent(eventData);
    },

    updateEvent: async (id, eventData) => {
        return await EventModel.updateEvent(id, eventData);
    },

    deleteEvent: async (id) => {
        return await EventModel.deleteEvent(id);
    }
};

module.exports = EventService;
