#!/usr/bin/python
# -*- coding: utf-8 -*-

from transgame_common import *
from filelock import FileLock
from urllib import quote
import base64

gameid = param('gameid')
text = param('text')

text = base64.b64decode(text, '-_')

open('gamedata/' + gameid + '.current', 'a+')

with FileLock('gamedata/' + gameid + '.current') as lock:
  f = open('gamedata/' + gameid + '.current', 'r+')
  output = []
  output.append(text)
  output.append('END')
  f.seek(0)
  f.write('\n'.join(output))
  f.truncate()
  f.close()

