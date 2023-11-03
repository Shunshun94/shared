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
                'accessoryHand[LR]_*Name': {includes: ['発動体', 'マナリング']},
                'accessoryOther\d*Name': {includes: ['発動体', 'マナリング']},
                'items': {includes: '発動体'},
                'weapon\\d+Name': {includes: '発動体'}
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
    }, {
        level: 'error',
        when: {
            'lvMag': 1
        },
        expect: {
            'accessory.*Name': {includes: 'マギスフィア'}
        },
        ifNot: 'マギテック技能による魔法を行使するにはマギスフィアを装備している必要があります（『1』198頁）'
    }, {
        level: 'error',
        when: {
            'lvFai': 1
        },
        expect: {
            'accessory.*Name': {includes: '宝石'}
        },
        ifNot: 'フェアリーテイマー技能による魔法を行使するには対応する宝石を装備している必要があります（『2』112頁）'
    }, {
        level: 'error',
        when: {
            'lvAlc': 1
        },
        expect: {
            'accessoryHand[LR]_*Name': {includes: 'アルケミーキット'},
            'accessoryWaist_*Name': {includes: 'アルケミーキット'},
            'accessoryOther_*Name': {includes: 'アルケミーキット'},
            'items': {includes: 'カードシューター'},
            'weapon\\d+Name': {includes: 'カードシューター'}
        },
        ifNot: 'アルケミスト技能による賦術を行使するにはアルケミーキットを適切な部位に装備している必要があります（『3』114頁）'
    }
];