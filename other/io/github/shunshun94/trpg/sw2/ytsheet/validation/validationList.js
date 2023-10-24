var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.ytsheet = io.github.shunshun94.trpg.sw2.ytsheet || {};
io.github.shunshun94.trpg.sw2.ytsheet.validation = io.github.shunshun94.trpg.sw2.ytsheet.validation || {};

io.github.shunshun94.trpg.sw2.ytsheet.validation.VALIDATION_LIST = [
    {
        level: 'error',
        when: {
            'or': {
                'lvSor': 1,
                'lvCon': 1
            }
        },
        must: {
            'or': {
                'weapon\d+Category': 'スタッフ',
                'weapon\d+Note': '発動体',
                'accessory.*Name':  ['発動体', 'マナリング']
            }
        },
        ifNot: 'ソーサラー技能またはコンジャラー技能を習得している者は魔法の発動体を装備している必要があります（『1』196頁）'
    }
];