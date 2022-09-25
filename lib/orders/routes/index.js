const express = require('express');
const { isTableExisted } = require('../controller');
const router = express.Router();
const service = require('../service')

router.get('/tables', service.getTables)
router.post('/tables', service.addTable)
router.delete('/tables/:id', service.deleteTable)
router.put('/tables/:id', isTableExisted, service.updateTable)
router.get('/', service.getOrders)
router.get('/:id', service.getOrder)
router.post('/', service.addOrder)
router.put('/:id', service.updateOrder)
router.delete('/:id', service.deleteOrder)
module.exports = router