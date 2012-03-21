#!/usr/bin/python
# -*- coding: utf-8 -*-

from transgame_common import *
from filelock import FileLock
from urllib import quote
import base64

gameid = param('gameid')
userid = param('userid')
text = param('text')
translation = param('translation')

print gameid
print userid
print translation
print base64.b64decode(text, '-_')

#text = base64.b64decode(text, '-_')

def secondInTuple(x):
  return x[1]

def numberOfVotingUsers(x):
  translation,dummyvar,users = x.rpartition('|')
  return len(users.split(','))

open('gamedata/' + gameid + '_' + text + '.txt', 'a+')

with FileLock('gamedata/' + gameid + '_' + text + '.txt') as lock:
  f = open('gamedata/' + gameid + '_' + text + '.txt', 'r+')
  output = []
  foundTrans = False
  translationsAndVotes = []
  for x in f.readlines()[:-1]:
    x = x.strip()
    curtrans,dummyvar,users = x.rpartition('|')
    users = users.split(',')
    if translation == curtrans:
      foundTrans = True
      if not userid in users:
        users.append(userid)
    else:
      users = [x for x in users if x != userid]
    if len(users) == 0:
      continue
    users = ','.join(users)
    output.append(curtrans + '|' + users)
    #translationsAndVotes.append((curtrans, len(users)))
  if not foundTrans:
    output.append(translation + '|' + userid)
    #translationsAndVotes.append((translation, 1))
  #output = list(sorted(output, key=numberOfVotingUsers), reverse=True)
  output.append('END')
  f.seek(0)
  f.write('\n'.join(output))
  f.truncate()
  f.close()
  '''
  f = open('gamedata/' + gameid + '.html', 'w')
  f.write('<div id="navcontainer"><ul class="navlist">')
  for translation,votes in sorted(translationsAndVotes, key=secondInTuple, reverse=True):
    f.write('<li><a href="javascript:void(0)" onclick="sendTranslation(\'' + quote(translation) + '\')">' + translation + '</a></li>')
  f.write('</ul></div>')
  f.close()
  '''
