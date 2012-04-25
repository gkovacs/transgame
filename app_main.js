var nowjs = require("now");
var nowjsServer = require('http').createServer(function(req, res){
  res.end('');
});
nowjsServer.listen(9000)
everyone = nowjs.initialize(nowjsServer);
console.log('nowjs server started on port 9000')

client = redisO.createClient()

/*
etherpadapi = require('etherpad-lite-client')

etherpadapikey = fs.readFileSync(path.join(__dirname,'.etherpadapikey.txt')).toString().trim()

etherpad = api.connect({
  apikey: etherpadapikey,
  host: 'transgame.csail.mit.edu',
  port: 9001,
})
*/

Array.prototype.remove = function(elem) {
    var match = -1;

    while( (match = this.indexOf(elem)) > -1 ) {
        this.splice(match, 1);
    }
};

function clearDict(dic) {
  var keys = dictKeys(dic)
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i]
    delete dic[key]
  }
}

function copyDict(src, dst) {
  clearDict(dst)
  var keys = dictKeys(src)
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i]
    dst[key] = src[key]
  }
}

function copyArray(src, dst) {
  dst.length = 0
  for (var i = 0; i < src.length; ++i) {
    dst[i] = src[i]
  }
}

function dictKeys(dic)
{
  var keys = [];
  for (var i in dic)
  {
    if (dic.hasOwnProperty(i) && dic[i] != null) {
      keys.push(i);
    }
  }
  return keys;
}

gameList = []
gameToUsers = {}

var gameDuration = 30;
//var useridToUser = {}

everyone.now.sendGameListCallback = function(callback) {
  callback(gameToUsers, gameList)
}

gameIdToUserConnect = {}
gameIdToUserDisconnect = {}

function initializeNewGame(gameid) {

userToSuggestedText = {}
textBeingTranslated = ''
contributingUser = ''

translationsByOrderSubmitted = []
userToTranslation = {}
translationToUserList = {}

userScores = {}
userList = []

gameIdToUserConnect[gameid] = function(userid) {
  if (userScores[userid] == null)
    userScores[userid] = 0
  if ($.inArray(userid, userList) == -1) {
    userList.push(userid)
  }
  nowjs.getGroup(gameid).now.sendNewScores(userScores, userList)
  //everyone.now.sendNewScores(userScores, userList)
  nowjs.getGroup(gameid).now.welcomeUser(userid)
  console.log('connected ' + userid)
}

gameIdToUserDisconnect[gameid] = function(userid) {
  userList.remove(userid)
  userScores[userid] = 0
  nowjs.getGroup(gameid).now.sendNewScores(userScores, userList)
  nowjs.getGroup(gameid).now.leavingUser(userid)
  console.log('disconnected ' + userid)
}

function getBestTranslation() {
  var bestTranslation = ''
  var bestNumVotes = 0
  for (var i = 0; i < translationsByOrderSubmitted.length; ++i) {
    var translation = translationsByOrderSubmitted[i]
    if (translationToUserList[translation] == null)
      continue
    var numVotes = translationToUserList[translation].length
    if (numVotes > bestNumVotes) {
      bestTranslation = translation
      bestNumVotes = numVotes
    }
  }
  return bestTranslation
}

isRoundActive = true
secondsRoundInactive = 0
var curtime = 0
setInterval(function() {
//var curtime = Math.round((new Date()).getTime() / 1000);
if (curtime == 11) {
  nowjs.getGroup(gameid).now.receiveTimeWarning()
}

if (curtime == 0) {

  if (isRoundActive && textBeingTranslated != '') {
  // store translated stuff for persistence
  console.log('storing stuff for persistence')
  client.set(gameid + '|' + textBeingTranslated, JSON.stringify({'translationToUserList': translationToUserList, 'translationsByOrderSubmitted': translationsByOrderSubmitted, 'userToTranslation': userToTranslation}))
  var bestTranslation = getBestTranslation()
  console.log(bestTranslation)
  nowjs.getGroup(gameid).now.sendFinalTranslation(textBeingTranslated, bestTranslation)
  updateScores()
  }

  var users = dictKeys(userToSuggestedText);
  if (users.length == 0) {
    nowjs.getGroup(gameid).now.askForTextSuggestions()
    isRoundActive = false
    if (secondsRoundInactive == 10) {
      //nowjs.getGroup(gameid).now.highlightSentenceNotice()
    }
    if (secondsRoundInactive <= 10) {
      secondsRoundInactive += 1
    }
    return;
  }
  isRoundActive = true
  secondsRoundInactive = 0
  console.log(users)
  
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
  translationsByOrderSubmitted.length = 0
  clearDict(userToTranslation)
  clearDict(translationToUserList)
  console.log('newround gameid: ' + gameid)
  console.log('newround textBeingTranslated: ' + textBeingTranslated)
  client.get(gameid + '|' + textBeingTranslated, function(err,res) {
    if (res != null) {
      var pd = JSON.parse(res)
      console.log('newround pd: ' + pd)
      copyDict(pd.userToTranslation, userToTranslation)
      copyDict(pd.translationToUserList, translationToUserList)
      copyArray(pd.translationsByOrderSubmitted, translationsByOrderSubmitted)
      console.log('newround translationToUserList: ' + translationToUserList)
      nowjs.getGroup(gameid).now.sendUserTranslations(translationToUserList, translationsByOrderSubmitted)
    }
  });
}

function updateScores() {
  $.each(translationToUserList, function(translation,voters) {
    if (voters == null)
      return
    if (voters.length < 1)
      return
    for (var i = 0; i < voters.length; ++i) {
      var userid = voters[i]
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
  nowjs.getGroup(gameid).now.sendNewScores(userScores, userList)
}


nowjs.getGroup(gameid).now.sendTextBeingTranslatedToCallback = function(callback) {
  if (isRoundActive) {
    callback(textBeingTranslated, contributingUser);
  }
}

nowjs.getGroup(gameid).now.submitTranslation = function(text, userid) {
  if (textBeingTranslated == '') return
  var prevTranslation = userToTranslation[userid]
  if (prevTranslation == text) {
    // no change in translation
    return
  }
  if (prevTranslation != null) {
    translationToUserList[prevTranslation].remove(userid)
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

nowjs.getGroup(gameid).now.sendChatMessage = function(text, userid) {
  if (text == '') {
    return
  }
  nowjs.getGroup(gameid).now.receiveChatMessage(text, userid)
}

}

nowjs.on("connect", function(){
  var userid = this.now.userid
  var url = this.now.url
  //everyone.now.quitUser(userid, url)
  //useridToUser[userid] = this
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
    gameIdToUserConnect[url](userid)
    //everyone.now.sendGameList(gameToUsers, gameList)
  }
});

function disconnect(userid, url) {
  gameIdToUserDisconnect[url](userid)
  gameToUsers[url].remove(userid)
  //everyone.now.sendGameList(gameToUsers, gameList)
  
  //userList.remove(userid)
  //userScores[userid] = 0
  
  //everyone.now.sendNewScores(userScores, userList)
  
  console.log('disconnected ' + userid)
}

everyone.now.disconnect = disconnect

nowjs.on("disconnect", function(){
  var userid = this.now.userid
  var url = this.now.url
  disconnect(userid, url)
});

