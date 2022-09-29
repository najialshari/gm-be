var express = require('express') 
var router = express.Router()
var categoriesRouter = require('../categories/routes')
var mealsRouter = require('../meals/routes')
var mealTypesRouter = require('../mealTypes/routes')
var categoryMealsRouter = require('../categoryMeals/routes')
var middleware = require("../../middleware")

router.use('/categories', middleware.isAuthenticated, middleware.isAdmin, categoriesRouter)
router.use('/meals', middleware.isAuthenticated, middleware.isAdmin, mealsRouter)
router.use('/mealTypes', middleware.isAuthenticated, middleware.isAdmin, mealTypesRouter)
router.use('/categoryMeals', categoryMealsRouter)

module.exports =  router