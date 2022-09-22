const express = require('express');
const router = express.Router();
const service = require('../service')

router.get('/', service.getCategoryMeals)
router.get('/:id', service.getCategoryMeal)
router.post('/:id', service.addCategoryMeal)
router.put('/:id', service.updateCategoryMeal)
router.delete('/:id', service.deleteCategoryMeal)

module.exports = router