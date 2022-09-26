var express = require('express');
var router = express.Router();
var usersRouter = require('../lib/users/routes');
var menusRouter = require('../lib/menu/routes');
// var qrCodesRouter = require('../lib/qrCodes/routes');
var ordersRouter = require('../lib/orders/routes');
var subscriptionRouter = require('../lib/subscribers/routes');

router.use('/users', usersRouter);
// app.use('/qrCodes', qrCodesRouter);
router.use('/orders', ordersRouter);
router.use('/menus', menusRouter);
router.use('/subscription', subscriptionRouter);

module.exports = router;
