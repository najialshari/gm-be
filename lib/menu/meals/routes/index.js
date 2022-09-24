const express = require('express');
const router = express.Router();
const service = require('../service')

router.get('/', service.getMeals)
router.post('/', service.addMeal)
router.get('/:id', service.getMeal)
router.post('/:id', service.addCategoryMeal)
router.put('/:id', service.updateMeal)
router.delete('/:id', service.deleteMeal)

module.exports = router