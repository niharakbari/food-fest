const express = require('express');
const router = express.Router();
const ChefController = require('../controllers/ChefController');

router.get('/', ChefController.getChefs);

module.exports = router;
