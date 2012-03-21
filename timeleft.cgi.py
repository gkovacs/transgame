#!/usr/bin/python
# -*- coding: utf-8 -*-

from transgame_common import *
from filelock import FileLock
from urllib import quote
import base64
import time

gameid = param('gameid')

unixtime = int(time.time())

print 'Content-type:text/plain'
print ''

starttime = 0
try:
  starttime = int(open('gamedata/' + gameid + '.starttime').read().strip())
except:
  pass

timeleft = starttime + 60 - unixtime
if timeleft < 0:
  timeleft = 0
print timeleft
