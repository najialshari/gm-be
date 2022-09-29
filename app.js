require("dotenv").config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require('./models')
var indexRouter = require('./routes/index');
const cors = require('cors')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require("dotenv").config();
app.use(cors())
app.use('/api/v1', indexRouter);



models.sequelize.sync().then(()=> console.log('Models synced successfully.'))
module.exports = app;
