const CategoryService = require('../services/CategoryService');

const CategoryController = {
    getCategories: async (req, res, next) => {
        try {
            const categories = await CategoryService.getCategories();
            
            res.status(200).json({
                success: true,
                count: categories.length,
                data: categories
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = CategoryController;
