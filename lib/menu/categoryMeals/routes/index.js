const express = require('express');
const router = express.Router();
const service = require('../service')
const middleware = require('../../../middleware')

router.get('/', service.getActiveCategoryMeals)
router.get('/allCategoryMeals',middleware.isAuthenticated, middleware.isAdmin, service.getCategoryMeals)
router.put('/active/:id', middleware.isAuthenticated, middleware.isAdmin, service.activateCategoryMeal)
router.get('/:id', service.getCategoryMeal)
router.post('/:id', middleware.isAuthenticated, middleware.isAdmin, service.addCategoryMeal)
router.put('/:id', middleware.isAuthenticated, middleware.isAdmin, service.updateCategoryMeal)
router.delete('/:id', middleware.isAuthenticated, middleware.isAdmin, service.deleteCategoryMeal)

module.exports = router