const db = require('../config/database');

const EventModel = {
    getAllEvents: async (categoryId = null) => {
        let query = `
            SELECT e.*, c.name as category_name 
            FROM events e 
            LEFT JOIN categories c ON e.category_id = c.id
        `;
        const params = [];

        if (categoryId) {
            query += ' WHERE e.category_id = ?';
            params.push(categoryId);
        }

        query += ' ORDER BY e.event_date ASC, e.start_time ASC';

        const [rows] = await db.execute(query, params);
        return rows;
    },

    getEventById: async (id) => {
        const query = `
            SELECT e.*, c.name as category_name 
            FROM events e 
            LEFT JOIN categories c ON e.category_id = c.id 
            WHERE e.id = ? LIMIT 1
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0] || null;
    }
};

module.exports = EventModel;
