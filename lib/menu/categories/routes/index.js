const express = require('express');
const router = express.Router();
const service = require('../service')
const middleware = require ('../../../middleware')

router.get('/', service.getActiveCategories)
router.get('/allCategories', middleware.isAuthenticated, middleware.isAdmin, service.getAllCategories)
router.get('/:id', service.getCategory)
router.post('/', middleware.isAuthenticated, middleware.isAdmin, service.addCategory)
router.put('/:id', middleware.isAuthenticated, middleware.isAdmin, service.updateCategory)
router.delete('/:id', middleware.isAuthenticated, middleware.isAdmin, service.deleteCategory)
router.patch("/:id", middleware.isAuthenticated, middleware.isAdmin , service.undoDeleteCategory); //activating Deleted user
module.exports = router