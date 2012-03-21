#!/usr/bin/python

import sys
reload(sys)
sys.setdefaultencoding('utf-8')
import cgitb
cgitb.enable(1, None, None, "txt")
from sqlobject import *
from urllib import unquote
import sys
import os
import codecs

def unquote_u(source):
  result = source
  if '%u' in result:
    result = result.replace('%u','\\u').decode('unicode_escape')
  result = unquote(result)
  return result

querydict = {}
if "QUERY_STRING" in os.environ:
	for x in unquote_u(os.environ["QUERY_STRING"]).split("&"):
		if "=" in x:
			eqpos = x.index("=")
			querydict[x[:eqpos]] = x[eqpos+1:]
		else:
			querydict[x] = ""

def param(p):
	if not p in querydict:
		print "need parameter " + p
		exit(0)
	return querydict[p]

