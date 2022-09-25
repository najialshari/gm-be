const express = require('express');
const router = express.Router();
const service = require('../service')

router.get('/tables', service.getTables)
router.post('/tables', service.addTable)
router.get('/', service.getOrders)
router.get('/:id', service.getOrder)
router.post('/', service.addOrder)
router.put('/:id', service.updateOrder)
router.delete('/:id', service.deleteOrder)
module.exports = router