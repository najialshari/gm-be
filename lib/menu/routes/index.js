var express = require('express') 
var router = express.Router()
var categoriesRouter = require('../categories/routes')
var mealsRouter = require('../meals/routes')
var mealTypesRouter = require('../mealTypes/routes')
var categoryMealsRouter = require('../categoryMeals/routes')

router.use('/categories', categoriesRouter)
router.use('/meals', mealsRouter)
router.use('/mealTypes', mealTypesRouter)
router.use('/categoryMeals', categoryMealsRouter)

module.exports =  router