
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

var crypto = require('crypto');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

//app.get('/', routes.index);

app.get('/', function(req, res){
  url = req.query['url']
  gameidsubs = new Buffer(url, 'binary').toString('base64').replace('+', '-').replace('_', '/');
  gameidalphanumericsubs = crypto.createHash('md5').update(url).digest("hex").slice(0,50);
  res.render('index', { title: 'Ninja Store' });
  //res.send('id: ' + req.query["id"]);
});

app.listen(8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

