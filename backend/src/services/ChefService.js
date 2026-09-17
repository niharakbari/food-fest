const ChefModel = require('../models/ChefModel');

const ChefService = {
    getChefs: async () => {
        return await ChefModel.getAllChefs();
    },

    createChef: async (chefData) => {
        return await ChefModel.createChef(chefData);
    },

    updateChef: async (id, chefData) => {
        return await ChefModel.updateChef(id, chefData);
    },

    deleteChef: async (id) => {
        return await ChefModel.deleteChef(id);
    }
};

module.exports = ChefService;
