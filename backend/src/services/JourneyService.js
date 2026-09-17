const JourneyModel = require('../models/JourneyModel');

const JourneyService = {
    getJourneys: async () => {
        return await JourneyModel.getAllJourneys();
    },

    createJourney: async (journeyData) => {
        return await JourneyModel.createJourney(journeyData);
    },

    updateJourney: async (id, journeyData) => {
        return await JourneyModel.updateJourney(id, journeyData);
    },

    deleteJourney: async (id) => {
        return await JourneyModel.deleteJourney(id);
    }
};

module.exports = JourneyService;
