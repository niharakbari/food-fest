const db = require('../config/database');

const CategoryModel = {
    getAllCategories: async () => {
        const query = 'SELECT * FROM categories ORDER BY name ASC';
        const [rows] = await db.execute(query);
        return rows;
    },

    createCategory: async (categoryData) => {
        const { name, icon } = categoryData;
        const query = 'INSERT INTO categories (name, icon) VALUES (?, ?)';
        const [result] = await db.execute(query, [name, icon]);
        return result.insertId;
    },

    updateCategory: async (id, categoryData) => {
        const { name, icon } = categoryData;
        const query = 'UPDATE categories SET name = ?, icon = ? WHERE id = ?';
        const [result] = await db.execute(query, [name, icon, id]);
        return result.affectedRows;
    },

    deleteCategory: async (id) => {
        const query = 'DELETE FROM categories WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }
};

module.exports = CategoryModel;
