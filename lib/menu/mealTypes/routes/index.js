const express = require('express');
const router = express.Router();
const service = require('../service')
const middleware = require ('../../../middleware')

router.get('/', service.getMealTypes)
router.get('/:id', service.getMealType)
router.post('/', middleware.isAuthenticated, middleware.isAdmin, service.addMealType)
router.put('/:id', middleware.isAuthenticated, middleware.isAdmin, service.updateMealType)
module.exports = router