#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import base64

availableGames = os.listdir('gamedata')
availableGames = [x[:-8] for x in availableGames if x.endswith('.current')]
#availableGames = [x.rpartition('.')[0] for x in availableGames]
availableGames = [base64.b64decode(x, '-_') for x in availableGames]

print 'Content-type:text/html'
print '''
<!DOCTYPE html>
<html>
<body>
<script src="jquery.min.js"></script>
<script src="jquery.cookie.js"></script>
<script>
function gotoPage() {
pageURL = document.forms["frm1"]["urlToTranslate"].value;
if (pageURL.indexOf('http://') != 0)
  pageURL = 'http://' + pageURL;
//alert(pageURL);
window.location = 'game.cgi.py?url=' + pageURL;
return false;
}


$(document).ready(function(){
userid = $.cookie('transgame_userid');
if (userid == null) {
  alert('warning: no userid, going back to login page');
  window.location = 'index.html';
}
$('#welcome').html('Welcome, ' + userid + '. Please pick an existing game to join, or enter a new URL.');
});

</script>

<div id='welcome'></div><br/>
<form name="frm1" action="" onsubmit="return gotoPage()">
URL to translate: <input type="text" name="urlToTranslate" />
<input type="submit" value="Start New Translation Game" /><br/>
'''
for x in availableGames:
  print '<a href="game.cgi.py?url=' + x + '">' + x + '</a><br/>'
'''
</body>
</html>
'''

