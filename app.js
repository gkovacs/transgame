
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

/*
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
    url = url_parts['url']
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
*/

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


everyone = nowjs.initialize(server);

function removeElement(arrayElement, arrayName) {
  arrayName.splice($.inArray(arrayElement, arrayName), 1)
}

userScores = {}
userList = []

gameList = []
gameToUsers = {}

var gameDuration = 30;
var useridToUser = {}

everyone.now.sendGameListCallback = function(callback) {
  callback(gameToUsers, gameList)
}

function initializeNewGame(gameid) {

userToSuggestedText = {}
textBeingTranslated = ''
contributingUser = ''

translationsByOrderSubmitted = []
userToTranslation = {}
translationToUserList = {}

var curtime = 0
setInterval(function() {
//var curtime = Math.round((new Date()).getTime() / 1000);
if (curtime == 0) {
  var users = Object.keys(userToSuggestedText);
  if (users.length == 0) {
    nowjs.getGroup(gameid).now.askForTextSuggestions()
    return;
  }
  // store translated stuff for persistence
  client.set(gameid + '|' + textBeingTranslated, JSON.stringify({'translationToUserList': translationToUserList, 'translationsByOrderSubmitted': translationsByOrderSubmitted, 'userToTranslation': userToTranslation}))
  
  updateScores()
  
  var selectedUserIdx = [Math.floor(Math.random()*users.length)];
  contributingUser = users[selectedUserIdx];
  textBeingTranslated = userToSuggestedText[contributingUser];
  newRound(gameid);
  
  curtime = gameDuration + Math.round(textBeingTranslated.length / 2);
  
} else {
curtime -= 1;
}
nowjs.getGroup(gameid).now.updateTime(curtime);
}, 1000);


function newRound(gameid) {
  nowjs.getGroup(gameid).now.setTextToBeTranslated(textBeingTranslated, contributingUser);
  translationsByOrderSubmitted = []
  userToTranslation = {}
  translationToUserList = {}
  client.get(gameid + '|' + textBeingTranslated, function(err,res) {
    if (res != null) {
      var pd = JSON.parse(res)
      userToTranslation = pd.userToTranslation
      translationToUserList = pd.translationToUserList
      translationsByOrderSubmitted = pd.translationsByOrderSubmitted
      nowjs.getGroup(gameid).now.sendUserTranslations(translationToUserList, translationsByOrderSubmitted)
    }
  });
}

function updateScores() {
  $.each(translationToUserList, function(translation,voters) {
    if (voters.length < 1)
      return
    for (var userid in voters) {
      if (userScores[userid] == null)
        userScores[userid] = 0
    }
    var contributer = voters[0]
    userScores[contributer] += 2 * (voters.length - 1)
    for (var i = 1; i < voters.length; ++i) {
      var voter = voters[i]
      userScores[voter] += 1
    }
  })
  everyone.now.sendNewScores(userScores, userList)
}


nowjs.getGroup(gameid).now.sendTextBeingTranslatedToCallback = function(callback) {
  callback(textBeingTranslated, contributingUser);
}

nowjs.getGroup(gameid).now.submitTranslation = function(text, userid) {
  var prevTranslation = userToTranslation[userid]
  if (prevTranslation == text) {
    // no change in translation
    return
  }
  if (prevTranslation != null) {
    removeElement(userid, translationToUserList[prevTranslation])
  }
  if (text == '') {
    
  } else {
    if ($.inArray(text, translationsByOrderSubmitted) == -1) {
      translationsByOrderSubmitted.push(text)
    }
    userToTranslation[userid] = text;
    if (translationToUserList[text] == null) {
      translationToUserList[text] = []
    }
    translationToUserList[text].push(userid)
  }
  console.log(translationsByOrderSubmitted)
  console.log(translationToUserList)
  nowjs.getGroup(gameid).now.sendUserTranslations(translationToUserList, translationsByOrderSubmitted)
}

nowjs.getGroup(gameid).now.suggestNewTextToBeTranslated = function(text, userid) {
  if (text == '') {
    delete userToSuggestedText[userid];
  } else {
    userToSuggestedText[userid] = text;
  }
}

}

nowjs.on("connect", function(){
  var userid = this.now.userid
  var url = this.now.url
  //everyone.now.quitUser(userid, url)
  useridToUser[userid] = this
  if (url != null) {
    if ($.inArray(url, gameList) == -1) {
      gameList.push(url)
      initializeNewGame(url)
    }
    if (gameToUsers[url] == null) {
      gameToUsers[url] = []
    }
    gameToUsers[url].push(userid)
    nowjs.getGroup(url).addUser(this.user.clientId)
    this.now.groupAddingFinished()
    nowjs.getGroup(url).now.sendUserTranslations(translationToUserList, translationsByOrderSubmitted)
    everyone.now.sendGameList(gameToUsers, gameList)
  }
  
  userScores[userid] = 0
  if ($.inArray(userid, userList) == -1) {
    userList.push(userid)
  }
  everyone.now.sendNewScores(userScores, userList)
  console.log('connected ' + userid)
});

function disconnect(userid, url) {
  removeElement(userid, gameToUsers[url])
  everyone.now.sendGameList(gameToUsers, gameList)
  
  removeElement(userid, userList)
  //userScores[userid] = 0
  everyone.now.sendNewScores(userScores, userList)
  console.log('disconnected ' + userid)
}

everyone.now.disconnect = disconnect

nowjs.on("disconnect", function(){
  var userid = this.now.userid
  var url = this.now.url
  disconnect(userid, url)
});

