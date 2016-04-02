#!/usr/bin/python
# -*- coding: utf-8 -*-

def getlist():
    liststr = """
ip4a.com
linkwan.com
jins-cn.com
sinacloud.com
applinzi.com
icloud.com
jobbole.com
ayong.org
yzhosting.com
images-amazon.com
live.com
"""
    return set(liststr.splitlines(False))
