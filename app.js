
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

var crypto = require('crypto');

var nowjs = require("now");

var $ = require('jQuery');

var redis = require('redis')

var client = redis.createClient()

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
  res.render('index', { title: 'TransGame' });
  //res.send('id: ' + req.query["id"]);
});

app.get('/lobby', function(req, res){
  res.render('lobby', { title: 'TransGame' });
  //res.send('id: ' + req.query["id"]);
});

app.listen(8080);

var everyone = nowjs.initialize(app);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

userToSuggestedText = {}
textBeingTranslated = ''
contributingUser = ''

everyone.now.suggestNewTextToBeTranslated = function(text, userid) {
  if (text == '') {
    delete userToSuggestedText[userid];
  } else {
    userToSuggestedText[userid] = text;
  }
}

function removeElement(arrayElement, arrayName) {
  arrayName.splice($.inArray(arrayElement, arrayName), 1)
}

translationsByOrderSubmitted = []
userToTranslation = {}
translationToUserList = {}

everyone.now.submitTranslation = function(text, userid) {
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
  everyone.now.sendUserTranslations(translationToUserList, translationsByOrderSubmitted)
}

everyone.now.sendGameListCallback = function(callback) {
  callback(gameToUsers, gameList)
}

everyone.now.sendTextBeingTranslatedToCallback = function(callback) {
  callback(textBeingTranslated, contributingUser);
}

userScores = {}
userList = []

gameList = []
gameToUsers = {}

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

var gameDuration = 30;
var useridToUser = {}

function initializeNewGame(gameid) {
var curtime = 0
setInterval(function() {
//var curtime = Math.round((new Date()).getTime() / 1000);
if (curtime == 0) {
  var users = Object.keys(userToSuggestedText);
  if (users.length == 0) {
    everyone.now.askForTextSuggestions()
    return;
  }
  // store translated stuff for persistence
  client.set(textBeingTranslated, JSON.stringify({'translationToUserList': translationToUserList, 'translationsByOrderSubmitted': translationsByOrderSubmitted, 'userToTranslation': userToTranslation}))
  
  updateScores()
  
  var selectedUserIdx = [Math.floor(Math.random()*users.length)];
  contributingUser = users[selectedUserIdx];
  textBeingTranslated = userToSuggestedText[contributingUser];
  newRound();
  
  curtime = gameDuration + Math.round(textBeingTranslated.length / 2);
  
} else {
curtime -= 1;
}
nowjs.getGroup(gameid).now.updateTime(curtime);
}, 1000);

}

nowjs.on("connect", function(){
  var userid = this.now.userid
  var url = this.now.url
  everyone.now.quitUser(userid, url)
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

function newRound() {
  everyone.now.setTextToBeTranslated(textBeingTranslated, contributingUser);
  translationsByOrderSubmitted = []
  userToTranslation = {}
  translationToUserList = {}
  client.get(textBeingTranslated, function(err,res) {
    if (res != null) {
      var pd = JSON.parse(res)
      userToTranslation = pd.userToTranslation
      translationToUserList = pd.translationToUserList
      translationsByOrderSubmitted = pd.translationsByOrderSubmitted
      everyone.now.sendUserTranslations(translationToUserList, translationsByOrderSubmitted)
    }
  });
}


