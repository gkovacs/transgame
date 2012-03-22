#!/usr/bin/python
# -*- coding: utf-8 -*-

from transgame_common import *
from filelock import FileLock
from urllib import quote

url = param('url')


print '''
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://ogp.me/ns/fb#">
  <head>
    <meta charset="utf-8">
    <title><%= @app.name %></title>
<style type="text/css">
.bottomC {
width:800px;
height:400px;
position: fixed;
top: 50%;
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

.selectedTrans {
	color: #FFFF00;
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
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js"></script>
<script src="jquery.cookie.js"></script>
<script>

userid = $.cookie('transgame_userid');
if (userid == null) {
  userid = Math.floor(Math.random()*10000001);
  $.cookie('transgame_userid', userid, { expires: 7, path: '/' });
}

function submitNewTranslation() {

console.log('submitting translation');
translation = $('#add_translation').val();
console.log(translation);
sendTranslation(translation);
return false;
}

function sendTranslation(translation) {
$.get('http://gkovacs.xvm.mit.edu/transgame/translate.cgi.py?gameid=''' + gameid + '''&userid=' + userid + '&translation=' + translation, function(data) {

});
}

function rpartition(s, sep) {
l = s.split(sep);
right = l[l.length - 1];
left = l.slice(0, l.length - 1);
return [left, right]
}

function reloadContent() {

//$.get('http://gkovacs.xvm.mit.edu/transgame/gamedata/''' + gameid + '''.html', function(data) {
//  $('#voting-region').html(data);
//});
$.get('http://gkovacs.xvm.mit.edu/transgame/gamedata/''' + gameid + '''.txt', function(data) {
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
    var curhtml = '<li><a href="javascript:void(0)" onclick="sendTranslation(\\'' + escape(translation) + '\\')"><span ' + spanClass +'>' + translation + ' (' + votingUsers.length + ')</span></a></span></li>';
    byVotes[byVotes.length] = [votingUsers.length, curhtml];
  }
  byVotes.sort()
  byVotes.reverse()
  for (var i = 0; i < byVotes.length; ++i) {
    htmlpage += byVotes[i][1];
  }
  htmlpage += '</ul></div>';
  $('#voting-region').html(htmlpage);
});


//$('#voting-region').load('content.html');
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


$('#userid_display').html(userid);

//setTimeout(reloadContent, 1000);
setInterval(reloadContent, 500);

});
</script>
<body>

<iframe src="http://nol.hu/belfold/nagy_a_kavarodas_az_orban-beszed_korul" class='fullscreen'>Your browser doesn't support iFrames.</iframe>

<div class="bottomC">
<div id="userid_display"></div>
<form onsubmit='return submitNewTranslation()'>
<input type='text' id='add_translation' style='width: 99%;'></input>
</form>
<div id="voting-region" style='width: 100%'></div>
</div>

</body>
</html>
'''
