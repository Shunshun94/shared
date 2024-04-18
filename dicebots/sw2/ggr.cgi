#!/usr/local/bin/python

import random

grow_list = ['dummy', '器用度', '敏捷度', '筋力', '生命力', '知力', '精神力']
grow_dice = [random.randint(1, 6) for i in range(3)]

def get_grown_status(dice):
	return grow_list[dice]

grow_status = list(dict.fromkeys(list(map(get_grown_status, grow_dice))))

result_text = '{"ok":true,"text":"' + f'[{",".join(list(map(str, grow_dice)))}]->({" or ".join(grow_status)})' + '","secret":false}'

print("Status: 200 OK")
print("Content-Type: text/json\n")
print(result_text.encode("UTF-8", 'ignore').decode('UTF-8'))
