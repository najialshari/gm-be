const express = require('express');
const router = express.Router();
const service = require('../service')
const middleware = require('../../../middleware')

router.get('/', service.getCategoryMeals)
router.get('/:id', service.getCategoryMeal)
router.post('/:id', middleware.isAuthenticated, middleware.isAdmin, service.addCategoryMeal)
router.put('/:id', middleware.isAuthenticated, middleware.isAdmin, service.updateCategoryMeal)
router.delete('/:id', middleware.isAuthenticated, middleware.isAdmin, service.deleteCategoryMeal)

module.exports = router