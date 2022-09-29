const express = require('express');
const router = express.Router();
const service = require('../service')

router.get('/tables', service.getTables)
router.post('/tables', service.addTable)
router.get('/tables/busy', service.getBusyTables)
router.delete('/tables/:id', service.deleteTable)
router.put('/tables/:id', service.updateTable)

module.exports = router