var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport=require('passport');
var session = require('express-session');
var mongoose = require("mongoose");
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/loginRouter');
var registerRouter = require('./routes/registerRouter');
var config=require('./config');
var usersRouter = require('./routes/users');
var userdetails = require('./routes/userdetails').router;
var userSetServer = require('./routes/userdetails').setServer;
var passportLogin = require("./passportLogin");
var cors=require('cors');
var app = express();
var debug = require('debug')('backend:server');
var http = require('http');
const server = http.createServer(app);
// var socketio=require('socket.io');
// const io=socketio(server);

/**
 * Get port from environment and store in Express.
 */

var port = (process.env.PORT || '3000');
app.set('port', port);

// io.on('connection',(socket)=>{
//   console.log("CONNECTED TO SOCKET");
//   socket.emit('tweet',{key:"value"});
// })

server.listen(port,()=>{
  console.log('Server running on port 3000...')
  userSetServer(server)
});

mongoose.connect('mongodb://localhost:27017/tweetmention',{ useNewUrlParser: true,useUnifiedTopology: true }, () => {
  console.log("connected to mongo db");
});

app.use(session({secret: config.sessionSecret, resave: true, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session());

app.use(cors({
  origin: "http://localhost:3001",methods: "GET,PUT,POST,DELETE",credentials: true
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
module.exports={
  server:server,
  app:app
};
