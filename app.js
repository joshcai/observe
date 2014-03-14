
/**
 * Module dependencies.
 */

var express = require('express');
var fs = require('fs');

var http = require('http');
var path = require('path');

var env = process.env.NODE_ENV || 'dev';
var config = require('./config/config')[env];
var mongoose = require('mongoose');

mongoose.connect(config.db);


var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})


var app = express()

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var mongoStore = require('connect-mongo')(express);

// app.use(function (req, res, next) {
// 	res.locals.req = req;
// 	next();
// });

var mongoSessionStore = new mongoStore({
	url: config.db,
	collection: 'observe_session'
})

app.use(express.session({
	secret: config.session_secret,
	store: mongoSessionStore 
}))

app.use(app.router);

require('./config/routes')(app)

var server = http.createServer(app);

//socket io config
var io = require('socket.io').listen(server);
io.set('log level', 1);
io.set('transports', [
  	'xhr-polling'
  , 'jsonp-polling'
  , 'websocket'
  , 'flashsocket'
]);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function (socket) {
	socket.on('changed', function () {
		socket.broadcast.emit('changed');
	});
});

