const express = require('express');
const router = express.Router();
const service = require('../service')

router.get('/', service.getMealTypes)
router.post('/', service.addMealTypes)
module.exports = router