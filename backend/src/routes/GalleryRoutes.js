const express = require('express');
const router = express.Router();
const GalleryController = require('../controllers/GalleryController');

router.get('/', GalleryController.getImages);
router.post('/', GalleryController.createImage);
router.put('/:id', GalleryController.updateImage);
router.delete('/:id', GalleryController.deleteImage);

module.exports = router;
