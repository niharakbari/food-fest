const express = require('express');
const router = express.Router();
const ChefController = require('../controllers/ChefController');

router.get('/', ChefController.getChefs);
router.post('/', ChefController.createChef);
router.put('/:id', ChefController.updateChef);
router.delete('/:id', ChefController.deleteChef);

module.exports = router;
