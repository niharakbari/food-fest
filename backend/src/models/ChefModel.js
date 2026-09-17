const db = require('../config/database');

const ChefModel = {
    getAllChefs: async () => {
        const query = 'SELECT * FROM chefs ORDER BY name ASC';
        const [rows] = await db.execute(query);
        return rows;
    }
};

module.exports = ChefModel;
