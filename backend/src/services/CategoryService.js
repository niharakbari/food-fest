const CategoryModel = require('../models/CategoryModel');

const CategoryService = {
    getCategories: async () => {
        return await CategoryModel.getAllCategories();
    },

    createCategory: async (categoryData) => {
        return await CategoryModel.createCategory(categoryData);
    },

    updateCategory: async (id, categoryData) => {
        return await CategoryModel.updateCategory(id, categoryData);
    },

    deleteCategory: async (id) => {
        return await CategoryModel.deleteCategory(id);
    }
};

module.exports = CategoryService;
