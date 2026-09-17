const db = require('../config/database');

const ChefModel = {
    getAllChefs: async () => {
        const query = 'SELECT * FROM chefs ORDER BY name ASC';
        const [rows] = await db.execute(query);
        return rows;
    },

    createChef: async (chefData) => {
        const { name, specialty, description, image_url } = chefData;
        const query = 'INSERT INTO chefs (name, specialty, description, image_url) VALUES (?, ?, ?, ?)';
        const [result] = await db.execute(query, [name, specialty, description, image_url]);
        return result.insertId;
    },

    updateChef: async (id, chefData) => {
        const { name, specialty, description, image_url } = chefData;
        const query = 'UPDATE chefs SET name = ?, specialty = ?, description = ?, image_url = ? WHERE id = ?';
        const [result] = await db.execute(query, [name, specialty, description, image_url, id]);
        return result.affectedRows;
    },

    deleteChef: async (id) => {
        const query = 'DELETE FROM chefs WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }
};

module.exports = ChefModel;
