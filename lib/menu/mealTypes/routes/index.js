const express = require('express');
const router = express.Router();
const service = require('../service')

router.get('/', service.getMealTypes)
router.get('/:id', service.getMealType)
router.post('/', service.addMealType)
router.put('/:id', service.updateMealType)
module.exports = router