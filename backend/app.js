var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// const cookieSession = require("cookie-session");
var logger = require('morgan');
var passport=require('passport');
var session = require('express-session');
var mongoose = require("mongoose");
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/loginRouter');
var registerRouter = require('./routes/registerRouter');
var config=require('./config');
var usersRouter = require('./routes/users');
var userdetails = require('./routes/userdetails');
var passportLogin = require("./passportLogin");
var cors=require('cors');
var app = express();

mongoose.connect('mongodb://localhost:27017/tweetmention',{ useNewUrlParser: true,useUnifiedTopology: true }, () => {
  console.log("connected to mongo db");
});

app.use(session({secret: config.sessionSecret, resave: true, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session());

app.use(cors({
  origin: "http://localhost:3001", // allow to server to accept request from different origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true // allow session cookie from browser to pass through
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/userdetails', userdetails);
app.use('/login/user', usersRouter);
app.get('/login/redirect', passport.authenticate("twitter", {
    successRedirect: '/login/user',failureRedirect: "/login/failed"
  })
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
