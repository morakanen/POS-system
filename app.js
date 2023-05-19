
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jsonParser = bodyParser.json();

app.use('/', indexRouter);
app.use("/productview", indexRouter);

//admin
app.use("/adminpanel", indexRouter);

app.use("/discounts", indexRouter);

app.use("/modifyproducts", indexRouter);
app.use("/addproduct", indexRouter);

app.use("/userupdate", indexRouter);
app.use("/adduser", indexRouter);

app.use("/noaccess", indexRouter);

module.exports = app;

