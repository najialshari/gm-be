const express = require('express');
const router = express.Router();
const service = require('../service')
const middleware = require ('../../../middleware')

router.get('/', service.getMeals)
router.post('/', middleware.isAuthenticated, middleware.isAdmin, service.addMeal)
router.get('/:id', service.getMeal)
router.post('/:id', middleware.isAuthenticated, middleware.isAdmin, service.addCategoryMeal)
router.put('/:id', middleware.isAuthenticated, middleware.isAdmin, service.updateMeal)
router.delete('/:id', middleware.isAuthenticated, middleware.isAdmin, service.deleteMeal)

module.exports = router