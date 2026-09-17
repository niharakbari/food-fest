const GalleryService = require('../services/GalleryService');

const GalleryController = {
    getImages: async (req, res, next) => {
        try {
            const images = await GalleryService.getImages();
            res.status(200).json({ success: true, count: images.length, data: images });
        } catch (error) {
            next(error);
        }
    },

    createImage: async (req, res, next) => {
        try {
            const newId = await GalleryService.createImage(req.body);
            res.status(201).json({ success: true, data: { id: newId, ...req.body } });
        } catch (error) {
            next(error);
        }
    },

    updateImage: async (req, res, next) => {
        try {
            const affectedRows = await GalleryService.updateImage(req.params.id, req.body);
            if (affectedRows === 0) return res.status(404).json({ success: false, message: 'Image not found' });
            res.status(200).json({ success: true, message: 'Image updated successfully' });
        } catch (error) {
            next(error);
        }
    },

    deleteImage: async (req, res, next) => {
        try {
            const affectedRows = await GalleryService.deleteImage(req.params.id);
            if (affectedRows === 0) return res.status(404).json({ success: false, message: 'Image not found' });
            res.status(200).json({ success: true, message: 'Image deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = GalleryController;
