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
    },

    createChef: async (req, res, next) => {
        try {
            const newChefId = await ChefService.createChef(req.body);
            res.status(201).json({
                success: true,
                data: { id: newChefId, ...req.body }
            });
        } catch (error) {
            next(error);
        }
    },

    updateChef: async (req, res, next) => {
        try {
            const affectedRows = await ChefService.updateChef(req.params.id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Chef not found' });
            }
            res.status(200).json({ success: true, message: 'Chef updated successfully' });
        } catch (error) {
            next(error);
        }
    },

    deleteChef: async (req, res, next) => {
        try {
            const affectedRows = await ChefService.deleteChef(req.params.id);
            if (affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Chef not found' });
            }
            res.status(200).json({ success: true, message: 'Chef deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = ChefController;
