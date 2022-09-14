var express = require('express');
var router = express.Router();
var usersRouter = require('../lib/users/routes');
var categoriesRouter = require('../lib/menu/categories/routes');
var mealsRouter = require('../lib/menu/meals/routes');

app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/meals', mealsRouter);

module.exports = router;
