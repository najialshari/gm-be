const express = require('express');
const router = express.Router();
const service = require('../service')
const middleware = require('../../middleware')

router.get('/tables', middleware.isAuthenticated, middleware.isAdmin, service.getTables)
router.post('/scan/:id', service.scaneTable)
router.post('/tables', middleware.isAuthenticated, middleware.isAdmin, service.addTable)
router.get('/tables/busy', middleware.isAuthenticated, middleware.isAdmin, service.getBusyTables)
router.put('/tables/active/:id', middleware.isAuthenticated, middleware.isAdmin, service.activateTable)
router.delete('/tables/:id', middleware.isAuthenticated, middleware.isAdmin, service.deleteTable)
router.put('/tables/:id', middleware.isAuthenticated, middleware.isAdmin, service.updateTable)

module.exports = router 