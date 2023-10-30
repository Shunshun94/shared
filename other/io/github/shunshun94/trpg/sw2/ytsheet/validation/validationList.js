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
        expect: {
            'or': {
                'weapon\\d+Category': {includes: 'スタッフ'},
                'weapon\\d+Note': {includes: '発動体'},
                'accessory.*Name': {includes: ['発動体', 'マナリング']}
            }
        },
        ifNot: 'ソーサラー技能またはコンジャラー技能による魔法を行使するには魔法の発動体を装備している必要があります（『1』196頁）'
    }, {
        level: 'error',
        when: {
            'lvPri': 1
        },
        expect: {
            'accessory.*Name': {includes: '聖印'},
            'race': {includes: 'センティアン'}
        },
        ifNot: 'プリースト技能による魔法を行使するには聖印を装備している必要があります（『1』198頁）'
    }
];