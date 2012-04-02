
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
  res.render('index', { title: 'Ninja Store' });
  //res.send('id: ' + req.query["id"]);
});

app.listen(8080);

var everyone = nowjs.initialize(app);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

userToSuggestedText = {}
textBeingTranslated = ''

everyone.now.suggestNewTextToBeTranslated = function(text, userid) {
  if (text == '') {
    delete userToSuggestedText[userid];
  } else {
    userToSuggestedText[userid] = text;
  }
}

function removeElement(arrayName,arrayElement) {
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
    removeElement(translationToUserList[prevTranslation], userid)
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

everyone.now.sendTextBeingTranslatedToCallback = function(callback) {
  callback(textBeingTranslated);
}

var gameDuration = 20;
var curtime = 0 //gameDuration + 1;

function newRound(textBeingTranslated) {
  everyone.now.setTextToBeTranslated(textBeingTranslated);
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

setInterval(function() {
//var curtime = Math.round((new Date()).getTime() / 1000);
if (curtime == 0) {
  var users = Object.keys(userToSuggestedText);
  if (users.length == 0)
    return;
  // store translated stuff for persistence
  client.set(textBeingTranslated, JSON.stringify({'translationToUserList': translationToUserList, 'translationsByOrderSubmitted': translationsByOrderSubmitted, 'userToTranslation': userToTranslation}))
  
  var selectedUserIdx = [Math.floor(Math.random()*users.length)];
  var selectedUser = users[selectedUserIdx];
  textBeingTranslated = userToSuggestedText[selectedUser];
  newRound(textBeingTranslated);
  
  curtime = gameDuration;
  
} else {
curtime -= 1;
}
everyone.now.updateTime(curtime);
}, 1000);
