var express = require('express');
var logger = require('morgan');
var cors = require('cors');
var authRouter = require('./routes/auth')
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

// allows the chatkit instances to be called
app.use('/auth',authRouter);

module.exports = app;