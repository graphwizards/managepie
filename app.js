var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var minifyHTML = require('express-minify-html');
const passport = require('passport');
const admin = require('./models/admin');
const users = require('./models/users');

 
const database = require('./database');
var app = express();

app.use(passport.initialize());
app.use(passport.session());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);







passport.serializeUser(function (entity, done) {
  done(null, { id: entity.id, role: entity.role });
});

passport.deserializeUser(function (obj, done) {
  switch (obj.role) {
      case 'admin':
          admin.findById(obj.id)
              .then(user => {
                  if (user) {
                      done(null, user);
                  }
                  else {
                      done(new Error('user id not found:' + obj.id, null));
                  }
              });
          break;
      case 'users':
          users.findById(obj.id)
              .then(device => {
                  if (device) {
                      done(null, device);
                  } else {
                      done(new Error('device id not found:' + obj.id, null));
                  }
              });
          break;
      default:
          done(new Error('no entity type:', obj.type), null);
          break;
  }
});
//login routes

 
app.use(minifyHTML({
  override:      true,
  exception_url: false,
  htmlMinifier: {
      removeComments:            true,
      collapseWhitespace:        true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes:     true,
      removeEmptyAttributes:     true,
      minifyJS:                  true
  }
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {    
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // Ip Address
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
