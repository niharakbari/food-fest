const db = require('../config/database');

const CategoryModel = {
    getAllCategories: async () => {
        const query = 'SELECT * FROM categories ORDER BY name ASC';
        const [rows] = await db.execute(query);
        return rows;
    }
};

module.exports = CategoryModel;
