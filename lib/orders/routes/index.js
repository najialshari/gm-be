const express = require('express');
// const { isTableExisted } = require('../controller');
const router = express.Router();
const service = require('../service')

router.get('/tables', service.getTables)
router.post('/tables', service.addTable)
router.get('/tables/busy', service.getBusyTables)
router.delete('/tables/:id', service.deleteTable)
router.put('/tables/:id', service.updateTable)
router.put('/details/add', service.addToOrderDetails)
router.put('/details/update', service.updateOrderDetails)
router.get('/', service.getOrders)
router.get('/:id', service.getOrder)
router.post('/', service.addOrder)
router.put('/:id', service.updateOrder)
router.delete('/:id', service.deleteOrder)
module.exports = router