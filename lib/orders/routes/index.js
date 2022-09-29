const express = require('express');
const router = express.Router();
const service = require('../service')

router.put('/details/add', service.addToOrderDetails)
router.put('/details/update', service.updateOrderDetails)
router.get('/', service.getOrders)
router.get('/:id', service.getOrder)
router.post('/', service.addOrder)
router.put('/:id', service.updateOrder)
router.delete('/:id', service.deleteOrder)

module.exports = router