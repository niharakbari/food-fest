const CategoryModel = require('../models/CategoryModel');

const CategoryService = {
    getCategories: async () => {
        return await CategoryModel.getAllCategories();
    }
};

module.exports = CategoryService;
