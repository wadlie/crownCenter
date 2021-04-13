var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// SOCKETS
var io = require('socket.io')();
app.io = io;


var farmer  = require('./routes/farmer');
var auth = require('./routes/auth');
var routes = require('./routes/index');
var farm = require('./routes/farm')(app, io);
var farmFarmer = require('./routes/farmFarmer');
var coverCrop = require('./routes/coverCrop');
var errorlog = require('./routes/errorlog');
var filelog = require('./routes/filelog');
var formbag = require('./routes/formbag');
var formbiomass = require('./routes/formbiomass');
var formbulkdensity = require('./routes/formbulkdensity');
var formfieldhistory = require('./routes/formfieldhistory');
var formsubmission = require('./routes/formsubmission');
var formsoil = require('./routes/formsoil');
var formtype = require('./routes/formtype');
var formyield = require('./routes/formyield');
var sensor = require('./routes/sensor');
var sensordata = require('./routes/sensordata');
var soilstep = require('./routes/soilstep');
var socket = require('./routes/socket')(app, io);

app.use('/', routes);
app.use('/api/farmer', farmer);
app.use('/api/auth', auth);
app.use('/api/farm', farm);
app.use('/api/coverCrop', coverCrop);
app.use('/api/farmFarmer', farmFarmer);
app.use('/api/errorlog', errorlog);
app.use('/api/filelog', filelog);
app.use('/api/formbag', formbag)
app.use('/api/formbiomass', formbiomass);
app.use('/api/formbulkdensity', formbulkdensity);
app.use('/api/formfieldhistory', formfieldhistory);
app.use('/api/formsubmission', formsubmission);
app.use('/api/formsoil', formsoil);
app.use('/api/formtype', formtype);
app.use('/api/formyield', formyield);
app.use('/api/sensor', sensor);
app.use('/api/sensordata', sensordata);
app.use('/api/soilstep', soilstep);
app.use('/api/socket', socket)


app.get("/testsocket", function(req, res) {
  io.emit("FromAPI", "Hello")
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});


module.exports = app;
