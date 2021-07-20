let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let passport = require("passport");
require("dotenv").config();

require("./mvc/models/db");

let usersRouter = require('./mvc/routes/users');
let app = express();

// view engine setup
app.set('views', path.join(__dirname,'mvc','views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'Angular', 'build')));

app.use(function(req,res,next) {
    res.statusJson = function(statusCode,data) {
        let obj = {
            ...data,
            statusCode:statusCode
        }
        res.status(statusCode).json(obj);
    }
    next();
})

app.use(passport.initialize());

app.use('/',(req,res,next)=>{
    let url;
    if(process.env.NODE_ENV==="PRODUCTION"){
        url = "https://jayantgoel001.github.io";
    }else {
        url = "http://localhost:4200/";
    }
    res.header('Access-Control-Allow-Origin',url);
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    next();
})

app.use('/users', usersRouter);
app.get("*",function (req, res) {
    res.redirect("https://jayantgoel001.github.io/A-Social-Media/");
})

app.use(function(req, res) {
    res.redirect("https://jayantgoel001.github.io/A-Social-Media/");
});

app.use(function(err, req, res) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;