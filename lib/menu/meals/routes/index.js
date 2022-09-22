const express = require('express');
const router = express.Router();
const service = require('../service')

router.get('/', service.getMeals)
router.post('/', service.addMeals)
router.post('/:id', service.addCategoryMeals)

module.exports = router