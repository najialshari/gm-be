const express = require('express');
const router = express.Router();
const service = require('../service')
// const categoryController = require('../controller')
const middleware = require ('../../../middleware')

router.get('/', service.getCategories)
router.get('/:id', service.getCategory)
router.post('/', service.addCategory)
router.put('/:id', service.updateCategory)
router.delete('/:id', service.deleteCategory)
router.patch("/:id", middleware.isAuthenticated, middleware.isAdmin , service.activatingDeleteCategory); //activating Deleted user
module.exports = router