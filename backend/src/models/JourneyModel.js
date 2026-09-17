const db = require('../config/database');

const JourneyModel = {
    getAllJourneys: async () => {
        const query = 'SELECT * FROM journeys ORDER BY year ASC';
        const [rows] = await db.execute(query);
        return rows;
    },

    createJourney: async (journeyData) => {
        const { year, description, image_url } = journeyData;
        const query = 'INSERT INTO journeys (year, description, image_url) VALUES (?, ?, ?)';
        const [result] = await db.execute(query, [year, description, image_url]);
        return result.insertId;
    },

    updateJourney: async (id, journeyData) => {
        const { year, description, image_url } = journeyData;
        const query = 'UPDATE journeys SET year = ?, description = ?, image_url = ? WHERE id = ?';
        const [result] = await db.execute(query, [year, description, image_url, id]);
        return result.affectedRows;
    },

    deleteJourney: async (id) => {
        const query = 'DELETE FROM journeys WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }
};

module.exports = JourneyModel;
