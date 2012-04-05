
/**
 * Module dependencies.
 */

var redis = require('redis')

var client = redis.createClient()

var ejs = require('ejs')

var connect = require('connect')

var urlLib = require('url')

var fs = require('fs')

var crypto = require('crypto');

var nowjs = require("now");

var $ = require('jQuery');


var lobbyData = ''
var indexData = ''

function writeResponse(response, data) {
  response.writeHead(200, {
      'Content-Type': 'text/html'
    , 'Content-Length': data.length
  });
  response.end(data)
}

var server = connect.createServer(function(request, response){
  var body = ''
  console.log(request.url)
  var url_parts = urlLib.parse(request.url, true).query;
  if (request.url.indexOf('/lobby') == 0 || request.url.indexOf('/lobby/') == 0) {
    if (lobbyData == '') {
      fs.readFile('views/lobby.ejs', function(err, data) {
        lobbyData = data.toString()
        writeResponse(response, ejs.render(lobbyData))
      })
    } else {
      writeResponse(response, ejs.render(lobbyData))
    }
  } else if (request.url.indexOf('/?') == 0) {
    urlD = url_parts['url']
    gameidsubs = new Buffer(url, 'binary').toString('base64').replace('+', '-').replace('_', '/');
    gameidalphanumericsubs = crypto.createHash('md5').update(url).digest("hex").slice(0,50);
    if (indexData == '') {
      fs.readFile('views/index.ejs', function(err, data) {
        indexData = data.toString()
        writeResponse(response, ejs.render(indexData))
      })
    } else {
      writeResponse(response, ejs.render(indexData))
    }
  }
  
});

server.listen(8080);

/*
var express = require('express')
  , routes = require('./routes');

var server = module.exports = express.createServer();

// Configuration

server.configure(function(){
  server.set('views', __dirname + '/views');
  server.set('view engine', 'ejs');
  server.set('view options', { layout: false });
  server.use(express.bodyParser());
  server.use(express.methodOverride());
  server.use(server.router);
  server.use(express.static(__dirname + '/public'));
});

server.configure('development', function(){
  server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

server.configure('production', function(){
  server.use(express.errorHandler());
});

// Routes

//server.get('/', routes.index);

server.get('/', function(req, res){
  url = req.query['url']
  gameidsubs = new Buffer(url, 'binary').toString('base64').replace('+', '-').replace('_', '/');
  gameidalphanumericsubs = crypto.createHash('md5').update(url).digest("hex").slice(0,50);
  res.render('index', { title: 'TransGame' });
  //res.send('id: ' + req.query["id"]);
});

server.get('/lobby', function(req, res){
  res.render('lobby', { title: 'TransGame' });
  //res.send('id: ' + req.query["id"]);
});

server.listen(8080);

*/
