#!/usr/local/bin/python

import os
import random

rawParams = os.environ.get('QUERY_STRING')
paramList = rawParams.split('&')
paramDict = {}
for grp in paramList:
    tmpList = grp.split('=')
    paramDict[tmpList[0]] = tmpList[1]

repeat = int(paramDict["repeat"])

def generateResult(count, isMulti):
    role = ['dummy', '管楽器（A）','管楽器（B）','弦楽器（A）','弦楽器（B）','弦楽器（C）','打楽器']
    role_dice = random.randint(1, 6)
    uncommon_dice1 = random.randint(1, 6)
    uncommon_dice2 = random.randint(1, 6)
    rarity = 'レア！' if (uncommon_dice1 + uncommon_dice2 == 12) else 'コモン'
    if (isMulti):
        return f"#{count+1}\\n人形楽団の人形表（{role_dice}）->{role[role_dice]}\\n人形のレアリティ（{uncommon_dice1},{uncommon_dice2}）->{rarity}"
    else:
        return f"人形楽団の人形表（{role_dice}）->{role[role_dice]}\\n人形のレアリティ（{uncommon_dice1},{uncommon_dice2}）->{rarity}"

texts = [generateResult(i, repeat - 1 ) for i in range(repeat)]


result = '{"ok":true,"text":"' + "\\n\\n".join(texts) + '","secret":false}'

print("Status: 200 OK")
print("Content-Type: text/json\n")
print(result.encode("UTF-8", 'ignore').decode('UTF-8'))
