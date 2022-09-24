const express = require('express');
const router = express.Router();
const service = require('../service')

router.get('/', service.getCategories)
router.get('/:id', service.getCategory)
router.post('/', service.addCategory)
router.put('/:id', service.updateCategory)
router.delete('/:id', service.deleteCategory)
module.exports = router