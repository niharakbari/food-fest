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
    },

    createEvent: async (eventData) => {
        const { name, description, event_date, start_time, end_time, location, image_url, status, category_id } = eventData;
        const query = 'INSERT INTO events (name, description, event_date, start_time, end_time, location, image_url, status, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.execute(query, [name, description, event_date, start_time, end_time, location, image_url, status, category_id]);
        return result.insertId;
    },

    updateEvent: async (id, eventData) => {
        const { name, description, event_date, start_time, end_time, location, image_url, status, category_id } = eventData;
        const query = 'UPDATE events SET name = ?, description = ?, event_date = ?, start_time = ?, end_time = ?, location = ?, image_url = ?, status = ?, category_id = ? WHERE id = ?';
        const [result] = await db.execute(query, [name, description, event_date, start_time, end_time, location, image_url, status, category_id, id]);
        return result.affectedRows;
    },

    deleteEvent: async (id) => {
        const query = 'DELETE FROM events WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }
};

module.exports = EventModel;
