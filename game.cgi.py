#!/usr/bin/python
# -*- coding: utf-8 -*-

from transgame_common import *
from filelock import FileLock
from urllib import quote
import base64
import hashlib

#gameid = param('gameid')

url = param('url')


def base64ToAlphaNumeric(s):
  output = []
  for x in s:
    if x == '=':
      output.append('YZ')
    if x == '-':
      output.append('YYZ')
    elif x == '_':
      output.append('YYYZ')
    elif x == 'Y':
      output.append('YYYYZ')
    elif x == 'Z':
      output.append('YYYYYZ')
    else:
      output.append(x)
  return ''.join(output)

def trimTo128Chars(s):
  return hashlib.md5(s).hexdigest()[:128]

gameid = base64.b64encode(url, '-_')

gameidAlphaNumeric = hashlib.md5(url).hexdigest()[:40]

#print gameidAlphaNumeric

#open('gamedata/' + gameid + '.txt', 'a+')

print 'Content-type:text/html'
print '''
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8">
    <title>TransGame</title>
<style type="text/css">

/* Apply the element you want to drag/resize */
.drsElement {
 position: absolute;
 border: 1px solid #333;

//opacity:0.5;
//filter:alpha(opacity=50);
}


/*
.drsElement:hover {
 position: absolute;
 border: 1px solid #333;

opacity:1.0;
filter:alpha(opacity=100);
}
*/

/*
 The main mouse handle that moves the whole element.
 You can apply to the same tag as drsElement if you want.
*/
.drsMoveHandle {
 height: 20px;
 background-color: #CCC;
 border-bottom: 1px solid #666;
 cursor: move;
}

/*
 The DragResize object name is automatically applied to all generated
 corner resize handles, as well as one of the individual classes below.
*/
.dragresize {
 position: absolute;
 width: 5px;
 height: 5px;
 font-size: 1px;
 background: #EEE;
 border: 1px solid #333;
 
 
}

/*
 Individual corner classes - required for resize support.
 These are based on the object name plus the handle ID.
*/
.dragresize-tl {
 top: -8px;
 left: -8px;
 cursor: nw-resize;
}
.dragresize-tm {
 top: -8px;
 left: 50%;
 margin-left: -4px;
 cursor: n-resize;
}
.dragresize-tr {
 top: -8px;
 right: -8px;
 cursor: ne-resize;
}

.dragresize-ml {
 top: 50%;
 margin-top: -4px;
 left: -8px;
 cursor: w-resize;
}
.dragresize-mr {
 top: 50%;
 margin-top: -4px;
 right: -8px;
 cursor: e-resize;
}

.dragresize-bl {
 bottom: -8px;
 left: -8px;
 cursor: sw-resize;
}
.dragresize-bm {
 bottom: -8px;
 left: 50%;
 margin-left: -4px;
 cursor: s-resize;
}
.dragresize-br {
 bottom: -8px;
 right: -8px;
 cursor: se-resize;
}



.bottomC {
width:800px;
height:400px;
position: fixed;
top: 70%;
left: 50%;
margin-left: -400px;
margin-top: -200px;
//margin-left: -100px;
//margin-top: -100px;
border: 2px solid;
border-radius: 10px;
-moz-border-radius: 10px;
background-color: #b0c4de;
z-index:100;
opacity:0.5;
filter:alpha(opacity=50);
}

.bottomC:hover {
opacity:1.0;
filter:alpha(opacity=100);
}

.highlight {
background-color: #ffff00;
}
.topC {
width:800px;
height:50px;
position: fixed;
top: 20%;
left: 50%;
margin-left: -400px;
margin-top: -50px;
//margin-left: -100px;
//margin-top: -100px;
border: 2px solid;
border-radius: 10px;
-moz-border-radius: 10px;
background-color: #b0c4de;
z-index:100;
}

.leftAvatar {
width:100px;
height:200px;
position: fixed;
top: 50%;
left: 10%;
margin-left: -50px;
margin-top: -100px;
//margin-left: -100px;
//margin-top: -100px;
border: 2px solid;
border-radius: 10px;
-moz-border-radius: 10px;
background-color: #b0c4de;
z-index:100;
}

.rightAvatar {
width:100px;
height:200px;
position: fixed;
top: 50%;
left: 90%;
margin-left: -50px;
margin-top: -100px;
//margin-left: -100px;
//margin-top: -100px;
border: 2px solid;
border-radius: 10px;
-moz-border-radius: 10px;
background-color: #b0c4de;
z-index:100;
}

/*
ul.navlist {
list-style: none;
display: block;
padding: 0;
margin-left: 0.5em;
margin-right: 0.5em;
}

ul.navlist li a, ul.navlist li b {
	display: block;
	width: 7em;
	font: 12px Verdana, Arial, Helvetica, sans-serif;
	font-weight: normal;
	text-decoration: none;
	text-align: center;
	color: #ffffff;
	background-color: #0000ff;
	padding-top: 0.2em;
	padding-right: 1em;
	padding-bottom: 0.2em;
	padding-left: 1em;
	border: 0.2em solid;
	border-color: #3366FF #000066 #000066 #3366FF;
	width: 96%;
}

ul.navlist li a:hover, ul.navlist li b {
	text-decoration: none;
	color: #FFFF00;
	background-color: #0000cc;
	padding-top: 0.3em;
	padding-right: 0.9em;
	padding-bottom: 0.1em;
	padding-left: 1.1em;
	border: 0.2em solid;
	border-color: #000066 #3366FF #3366FF #000066;
	width: 96%;
}

ul.navlist li a:active, ul.navlist li b {
	color: #FF9900;
}
*/

ul
{
list-style-type: none;
padding: 0;
margin: 0;
}

li
{
border-style:solid;
border-width:2px;
border-color:transparent;
}

li:hover
{
-webkit-border-radius: 10px;
-moz-border-radius: 10px;
border-radius: 10px;
border-style:solid;
border-width:2px;
border-color:black;
}

.selectedTrans {
-webkit-border-radius: 10px;
-moz-border-radius: 10px;
border-radius: 10px;
border-style:solid;
border-width:2px;
border-color:yellow;
}

/* End Menu */

body {
  margin: 0;
}

.fullscreen {
position:absolute;
left:0;
right:0;
top:0;
bottom:0;
border: 0;
width: 100%;
height: 100%;
margin:auto;"
}
</style>
</head>
<script src="jquery.min.js"></script>
<script src="jquery.cookie.js"></script>
<script src="etherpad.js"></script>
<script src="base64.js"></script>
<script src="md5.js"></script>
<script type="text/javascript" src="dragresize.js"></script>
<script>

userid = $.cookie('transgame_userid');
if (userid == null) {
  alert('warning: no userid, going back to login page');
  window.location = 'index.html';
  //userid = Math.floor(Math.random()*10000001);
  //$.cookie('transgame_userid', userid, { expires: 7, path: '/' });
}

textBeingTranslated = '';
prevVotingRegionHTML = '';

function submitNewTranslation() {

//if (textBeingTranslated != $('#text_being_translated').html()) {
//submitNewTextBeingTranslated();
//}

//console.log('submitting translation');
translation = $('#add_translation').val();
//console.log(translation);
sendTranslation(translation);
$('#add_translation').val('')
return false;
}

function submitNewTextBeingTranslated() {
clearVoting();
//console.log('submitting new text to be translated');
var text = $('#text_to_be_translated_suggestion').val();
textBeingTranslated = text;
//console.log(textBeingTranslated);
sendNewTextBeingTranslated(text);
clearVoting();
return false;
}

function submitStartTimer() {
$.get('http://gkovacs.xvm.mit.edu/transgame/startround.cgi.py?gameid=''' + gameid + '''', function(data) {
console.log(data);
});
return false;
}

function submitSwitchRound() {
$.get('http://gkovacs.xvm.mit.edu/transgame/switchround.cgi.py?gameid=''' + gameid + '''', function(data) {
console.log(data);
});
return false;
}

function sendTranslation(translation) {
$.get('http://gkovacs.xvm.mit.edu/transgame/translate.cgi.py?gameid=''' + gameid + '''&userid=' + userid + '&text=' + encode64(textBeingTranslated) + '&translation=' + translation, function(data) {
console.log(data);
});
}

function sendNewTextBeingTranslated(text) {
$.get('http://gkovacs.xvm.mit.edu/transgame/suggesttext.cgi.py?gameid=''' + gameid + '''&userid=' + userid + '&text=' + encode64(text), function(data) {
console.log(data);
});
}

/*
function sendNewTextBeingTranslated(text) {
$.get('http://gkovacs.xvm.mit.edu/transgame/textbeingtranslated.cgi.py?gameid=''' + gameid + '''&text=' + encode64(text), function(data) {

});
}
*/

function rpartition(s, sep) {
l = s.split(sep);
right = l[l.length - 1];
left = l.slice(0, l.length - 1);
return [left, right]
}

function clearVoting() {
$('#add_translation').val('')
$('#voting-region').html('');
prevVotingRegionHTML = '';
}

function reloadTime() {
$.get('http://gkovacs.xvm.mit.edu/transgame/timeleft.cgi.py?gameid=''' + gameid + '''&text=' + encode64(textBeingTranslated), function(data) {
console.log(data);
$('#timeDisplay').html(data);
});

}

function reloadTextBeingTranslated() {

// reload the thing displaying what's being translated right now
$.get('http://gkovacs.xvm.mit.edu/transgame/gamedata/''' + gameid + '''.current', function(data) {
var lines = data.split('\\n');
if (lines[lines.length - 1] != 'END' && lines[lines.length - 2] != 'END')
  return;
textBeingTranslated = lines[0];
//if (newText == textBeingTranslated)
//  return;
//textBeingTranslated = newText;
$('#text_being_translated').html(textBeingTranslated);
clearVoting();
});

}

function reloadContent() {

// reload the translations
//$.get('http://gkovacs.xvm.mit.edu/transgame/gamedata/''' + gameid + '''.html', function(data) {
//  $('#voting-region').html(data);
//});
$.get('http://gkovacs.xvm.mit.edu/transgame/gamedata/''' + gameid + '''_' + hex_md5(encode64(textBeingTranslated)) + '.txt', function(data) {
  var lines = data.split('\\n');
  if (lines[lines.length - 1] != 'END' && lines[lines.length - 2] != 'END')
    return;
  var htmlpage = '<div id="navcontainer"><ul class="navlist">';
  var byVotes = []
  for (var i = 0; i < lines.length - 1; ++i) {
    var curline = lines[i];
    var p = rpartition(curline, '|')
    var translation = p[0];
    if (translation.length == 0)
      continue;
    var votingUsers = p[1].split(',');
    var spanClass = '';
    if ($.inArray(userid, votingUsers) != -1) {
      spanClass = 'class="selectedTrans"';
    }
    var curhtml = '<li onclick="sendTranslation(\\'' + escape(translation) + '\\')" ' + spanClass + ' >';
    var numVotes = votingUsers.length;
    if (numVotes > 5) {
      numVotes = 5;
    }
    var numNoVotes = 5 - numVotes;
    for (var j = 0; j < numNoVotes; ++j) {
      curhtml += '<img src="novote.png" />';
    }
    var contributingUser = votingUsers[0];
    for (var j = 0; j < numVotes; ++j) {
      var votingUserName = votingUsers[j];
      curhtml += '<img src="plusvote.png" title="' + votingUserName + '" alt="' + votingUserName + '" />';
    }
    
    
    curhtml += translation + ' (<i>' + contributingUser + '</i>)</li>';
    byVotes[byVotes.length] = [votingUsers.length, curhtml];
  }
  //byVotes.sort()
  //byVotes.reverse()
  for (var i = 0; i < byVotes.length; ++i) {
    htmlpage += byVotes[i][1];
  }
  htmlpage += '</ul></div>';
  if (htmlpage != prevVotingRegionHTML) {
    prevVotingRegionHTML = htmlpage;
    $('#voting-region').html(htmlpage);
  }
});


//$('#voting-region').load('content.html');
}

function showOrHide(elem) {
  if ((elem).css("display") == "none") {
    elem.show();
  }
  else {
    elem.hide();
  }
}

collapsedElemHeights = {}

function collapseOrExpand(elem) {
  var elemHeight = elem.height();
  if (elemHeight == 0) {
    elem.height(collapsedElemHeights[elem]);
  } else {
    collapsedElemHeights[elem] = elemHeight;
    elem.height(0);
  }
}

$(document).ready(function(){
/*
var oRequest = new XMLHttpRequest();
var sURL  = 'content.html';
oRequest.open("GET",sURL,false);
oRequest.setRequestHeader("User-Agent",navigator.userAgent);
oRequest.send(null);
if (oRequest.status==200) {
alert(oRequest.responseText);
}
*/


//$('#userid_display').html(userid);
$('#chatRegionContents').pad({'padId':'transgame-''' + gameidAlphaNumeric + '''', 'height': '100%', 'userName': userid, 'showChat': true});
$('#scoreBoardRegionContents').pad({'padId':'transgams-''' + gameidAlphaNumeric + '''', 'height': '100%', 'userName': userid});

//setTimeout(reloadContent, 1000);
setInterval(reloadContent, 500);
setInterval(reloadTextBeingTranslated, 500);
setInterval(reloadTime, 500);



docWidth = $(document).width();
docHeight = $(document).height();


$('#translateRegion').width(docWidth/2);
$('#translateRegion').height(docHeight/2);
$('#translateRegion').offset({left:docWidth/4,top:docHeight/4});

$('#chatRegion').width(docWidth/4 - 40);
$('#chatRegion').height(docHeight/2);
$('#chatRegion').offset({left:3*docWidth/4 + 20,top:docHeight/4});

$('#scoreBoardRegion').width(docWidth/4 - 40);
$('#scoreBoardRegion').height(docHeight/2);
$('#scoreBoardRegion').offset({left:20, top:docHeight/4});

$('#timeRegion').width(100);
$('#timeRegion').height(80);
$('#timeRegion').offset({left: 0, top: 0});

// Using DragResize is simple!
// You first declare a new DragResize() object, passing its own name and an object
// whose keys constitute optional parameters/settings:

var dragresize = new DragResize('dragresize',
 {  });

// Optional settings/properties of the DragResize object are:
//  enabled: Toggle whether the object is active.
//  handles[]: An array of drag handles to use (see the .JS file).
//  minWidth, minHeight: Minimum size to which elements are resized (in pixels).
//  minLeft, maxLeft, minTop, maxTop: Bounding box (in pixels).

// Next, you must define two functions, isElement and isHandle. These are passed
// a given DOM element, and must "return true" if the element in question is a
// draggable element or draggable handle. Here, I'm checking for the CSS classname
// of the elements, but you have have any combination of conditions you like:

dragresize.isElement = function(elm)
{
 if (elm.className && elm.className.indexOf('drsElement') > -1) return true;
};
dragresize.isHandle = function(elm)
{
 if (elm.className && elm.className.indexOf('drsMoveHandle') > -1) return true;
};

// You can define optional functions that are called as elements are dragged/resized.
// Some are passed true if the source event was a resize, or false if it's a drag.
// The focus/blur events are called as handles are added/removed from an object,
// and the others are called as users drag, move and release the object's handles.
// You might use these to examine the properties of the DragResize object to sync
// other page elements, etc.

dragresize.ondragfocus = function() { };
dragresize.ondragstart = function(isResize) { };
dragresize.ondragmove = function(isResize) { };
dragresize.ondragend = function(isResize) { };
dragresize.ondragblur = function() { };

// Finally, you must apply() your DragResize object to a DOM node; all children of this
// node will then be made draggable. Here, I'm applying to the entire document.
dragresize.apply(document);


$("#translateRegionBar").dblclick(function() {
showOrHide($('#translateRegionContents'));
collapseOrExpand($('#translateRegion'));
});

$("#chatRegionBar").dblclick(function() {
showOrHide($('#chatRegionContents'));
collapseOrExpand($('#chatRegion'));
});

$("#timeRegionBar").dblclick(function() {
showOrHide($('#timeRegionContents'));
collapseOrExpand($('#timeRegion'));
});

$("#scoreBoardRegionBar").dblclick(function() {
showOrHide($('#scoreBoardRegionContents'));
collapseOrExpand($('#scoreBoardRegion'));
});

//console.log("''' + gameid + '''");

});
</script>
<body>

<iframe src="''' + url + '''" class='fullscreen'>Your browser doesn't support iFrames.</iframe>

<div class="drsElement" id="translateRegion" style="background: #b0c4de; background-color: #b0c4de;">
 <div class="drsMoveHandle" id="translateRegionBar">Translate</div>
<div id="translateRegionContents">
<form action="" onsubmit='return submitNewTextBeingTranslated()'>
Text Being Translated: <div name='text_being_translated' id='text_being_translated'></div>
Suggest Text to be Translated: <input type='text' name='text_to_be_translated_suggestion' id='text_to_be_translated_suggestion' style='width: 70%;'></input>
</form>

<form action="" onsubmit='return submitNewTranslation()'>
Translation: <input type='text' name='add_translation' id='add_translation' style='width: 70%;'></input>
</form>
<div id="voting-region" style='width: 70%'></div>
<!--<div id="examplePadBasic" style='position: absolute; right: 0; top: 0; width: 25%; height: 400px' height=400></div>-->
<!--</div>-->

</div>
</div>

<div class="drsElement" id="chatRegion" style="background: #b0c4de; background-color: #b0c4de;">
 <div class="drsMoveHandle" id="chatRegionBar">Chat</div>
 <div id="chatRegionContents" style="height: 100%">
  <!--<iframe style="position: absolute; display: block; height: 100%; right: 0; top: 0; bottom: 0; width: 100%; margin-top: 20px;" src="http://beta.etherpad.org/p/''' + gameidAlphaNumeric + '''"></iframe>-->
  </div>
</div>

<div class="drsElement" id="timeRegion" style="background: #b0c4de; background-color: #b0c4de;">
 <div class="drsMoveHandle" id="timeRegionBar">Time</div>
 <div id="timeRegionContents">
<div id="timeDisplay" style="font-size: 26px; text-align: center;" >0</div>
<form action="" onsubmit='return submitStartTimer()'>
<input type="submit" name="mysubmit" value="Start Round" />
</form>
<form action="" onsubmit='return submitSwitchRound()'>
<input type="submit" name="mysubmit" value="Switch Round" />
</form>
</div>
</div>

<div class="drsElement" id="scoreBoardRegion" style="background: #b0c4de; background-color: #b0c4de;">
 <div class="drsMoveHandle" id="scoreBoardRegionBar">ScoreBoard</div>
 <div id="scoreBoardRegionContents" style="height: 100%">
<div id="scoreBoardDisplay" ></div>
</div>
</div>

</body>
</html>
'''
