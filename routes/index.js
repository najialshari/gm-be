var express = require('express');
var router = express.Router();
var usersRouter = require('../lib/users/routes');
var menusRouter = require('../lib/menu/routes');
var qrCodesRouter = require('../lib/qrCodes/routes');
var ordersRouter = require('../lib/orders/routes');
var subscriptionRouter = require('../lib/subscribers/routes');
const { isAuthenticated, isAdmin } = require('../lib/middleware');

router.get('/', (req, res, next) => {
    res.send("Welcome to back-end home page")
});
router.use('/users', usersRouter);
router.use('/qrCodes', isAuthenticated , isAdmin, qrCodesRouter);
router.use('/orders', isAuthenticated , isAdmin, ordersRouter);
router.use('/menus', menusRouter);
router.use('/subscription', subscriptionRouter);

module.exports = router;
