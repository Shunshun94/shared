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
    }, {
        level: 'error',
        when: {
            'lvDru': 1
        },
        expect: {            
            'items': {includes: ['宿り木', '宿木', 'ヤドリギ']},
            'weapon\\d+Name': {includes: ['宿り木', '宿木', 'ヤドリギ']},
            'weapon\\d+Note': {includes: ['宿り木', '宿木', 'ヤドリギ', 'ドルイド', '森羅']}
        },
        ifNot: 'ドルイド技能による魔法を行使するには宿り木の棒杖またはそれを兼ねたスタッフを装備している必要があります（『ML』10頁）'
    }, {
        level: 'error',
        when: {
            'lvDem': 1
        },
        expect: {            
            'items': {includes: ['召異の刺青', '悪魔の印', '大型容器', '小型容器', '召異の刺繍']},
            'accessory.*Name': {includes: ['召異の徽章', '召異の微章']},
            'weapon\\d+Name': {includes: '小魔'},
            'weapon\\d+Note': {includes: ['小魔', 'デーモンルーラー', 'デモル', '召異']}
        },
        ifNot: 'デーモンルーラー技能による魔法を行使するには小魔の封入具を装備している必要があります（『ML』29頁）'
    }, {
        level: 'warn',
        when: {
            'and': {
                "armour\\d+Category": { equal: '金属鎧' },
                'or': {
                    'lvSor': 1,
                    'lvCon': 1,
                    'lvFai': 1,
                    'lvDru': 1,
                    'lvDem': 1
                }
            }
        },
        expect: {
            'race': { includes: 'ナイトメア' }
        },
        ifNot: '金属鎧を着ている場合にソーサラー技能、コンジャラー技能またはデーモンルーラー技能による魔法を行使するとペナルティ修正を受けます'
    }, {
        level: 'warn',
        when: {
            'and': {
                "armour\\d+Category": { equal: '非金属鎧' },
                "armour\\d+Reqd": { ormore: 10 },
                'or': {
                    'lvSor': 1,
                    'lvCon': 1,
                    'lvDem': 1
                }
            }
        },
        expect: {
            'race': { includes: 'ナイトメア' }
        },
        ifNot: '必要筋力が10以上の非金属鎧を着ている場合にソーサラー技能、コンジャラー技能、フェアリーテイマー技能、ドルイド技能またはデーモンルーラー技能による魔法を行使するとペナルティ修正を受けます'
    }, {
        level: 'warn',
        when: {
            'lvSco': 1
        },
        expect: {
            'items': { includes: ['スカウト用ツール', '精密ツールセット'] }
        },
        ifNot: 'スカウト用ツールを持っていない場合、一部の判定にペナルティ修正を受けます（『1』109頁）'
    }, {
        level: 'info',
        when: {
            'id': 1
        },
        expect: {
            'items': {
                func: (key, value, json) => {
                    if(json.lvPri) { return true; }
                    return (value || '').includes('アウェイクポーション');
                }
            }
        },
        ifNot: '万が一の時のためにアウェイクポーション（『1』325頁）を持っておくことをおすすめします'
    }
];