const ChefModel = require('../models/ChefModel');

const ChefService = {
    getChefs: async () => {
        return await ChefModel.getAllChefs();
    }
};

module.exports = ChefService;
