const db = require('../config/database');

const GalleryModel = {
    getAllImages: async () => {
        const query = 'SELECT * FROM gallery ORDER BY id DESC';
        const [rows] = await db.execute(query);
        return rows;
    },

    createImage: async (imageData) => {
        const { image_url } = imageData;
        const query = 'INSERT INTO gallery (image_url) VALUES (?)';
        const [result] = await db.execute(query, [image_url]);
        return result.insertId;
    },

    updateImage: async (id, imageData) => {
        const { image_url } = imageData;
        const query = 'UPDATE gallery SET image_url = ? WHERE id = ?';
        const [result] = await db.execute(query, [image_url, id]);
        return result.affectedRows;
    },

    deleteImage: async (id) => {
        const query = 'DELETE FROM gallery WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }
};

module.exports = GalleryModel;
