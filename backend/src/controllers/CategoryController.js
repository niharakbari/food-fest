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
    },

    createCategory: async (req, res, next) => {
        try {
            const newCategoryId = await CategoryService.createCategory(req.body);
            res.status(201).json({
                success: true,
                data: { id: newCategoryId, ...req.body }
            });
        } catch (error) {
            next(error);
        }
    },

    updateCategory: async (req, res, next) => {
        try {
            const affectedRows = await CategoryService.updateCategory(req.params.id, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
            res.status(200).json({ success: true, message: 'Category updated successfully' });
        } catch (error) {
            next(error);
        }
    },

    deleteCategory: async (req, res, next) => {
        try {
            const affectedRows = await CategoryService.deleteCategory(req.params.id);
            if (affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
            res.status(200).json({ success: true, message: 'Category deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = CategoryController;
