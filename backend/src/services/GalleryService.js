const GalleryModel = require('../models/GalleryModel');

const GalleryService = {
    getImages: async () => {
        return await GalleryModel.getAllImages();
    },

    createImage: async (imageData) => {
        return await GalleryModel.createImage(imageData);
    },

    updateImage: async (id, imageData) => {
        return await GalleryModel.updateImage(id, imageData);
    },

    deleteImage: async (id) => {
        return await GalleryModel.deleteImage(id);
    }
};

module.exports = GalleryService;
