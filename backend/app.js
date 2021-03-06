var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport=require('passport');
var session = require('express-session');
var mongoose = require("mongoose");
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var config=require('./config');
var createTweetRouter = require('./routes/createTweet');
var userdetails = require('./routes/userDetails').router;
var userSetServer = require('./routes/userDetails').setServer;
var passportLogin = require("./passportLogin");
var cors=require('cors');
var app = express();
var http = require('http');
const server = http.createServer(app);

var port = (process.env.PORT || '4000');
app.set('port', port);

server.listen(port,()=>{
  console.log('Server running on port 4000...')
  userSetServer(server)
});

mongoose.connect(config.mongokey,{ useNewUrlParser: true,useUnifiedTopology: true }, () => {
  console.log("connected to mongo db");
});

app.use(session({secret: config.sessionSecret, resave: true, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session());

app.use(cors({
  origin: "http://localhost:3000",methods: "GET,PUT,POST,DELETE",credentials: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/register',registerRouter);
app.use('/login', loginRouter);
app.use('/userdetails', userdetails);
app.use('/tweet', createTweetRouter);
app.get('/login/redirect', passport.authenticate("twitter", {
    successRedirect: '/tweet',failureRedirect: "/login/failed"
  })
);
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/../frontend/build/index.html'));
});
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
