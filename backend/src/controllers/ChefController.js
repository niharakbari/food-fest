const ChefService = require('../services/ChefService');

const ChefController = {
    getChefs: async (req, res, next) => {
        try {
            const chefs = await ChefService.getChefs();
            
            res.status(200).json({
                success: true,
                count: chefs.length,
                data: chefs
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = ChefController;
