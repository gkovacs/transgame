var nowjsServer = express.createServer();
nowjsServer.listen(9000)
everyone = nowjs.initialize(nowjsServer);
console.log('nowjs server started on port 9000')

client = redisO.createClient()

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

function getBestTranslation() {
  var bestTranslation = ''
  var bestNumVotes = 0
  for (var translation in translationsByOrderSubmitted) {
    var numVotes = translationToUserList[translation].length
    if (numVotes > bestNumVotes) {
      bestTranslation = translation
      bestNumVotes = numVotes
    }
  }
  return bestTranslation
}

var curtime = 0
setInterval(function() {
//var curtime = Math.round((new Date()).getTime() / 1000);
if (curtime == 0) {
  var users = Object.keys(userToSuggestedText);
  if (users.length == 0) {
    nowjs.getGroup(gameid).now.askForTextSuggestions()
    return;
  }
  if (textBeingTranslated != '') {
  // store translated stuff for persistence
  client.set(gameid + '|' + textBeingTranslated, JSON.stringify({'translationToUserList': translationToUserList, 'translationsByOrderSubmitted': translationsByOrderSubmitted, 'userToTranslation': userToTranslation}))
  var bestTranslation = getBestTranslation()
  nowjs.getGroup(gameid).now.sendFinalTranslation(textBeingTranslated, bestTranslation)
  updateScores()
  }
  
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

