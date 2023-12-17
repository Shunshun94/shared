var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.ytsheet = io.github.shunshun94.trpg.sw2.ytsheet || {};
io.github.shunshun94.trpg.sw2.ytsheet.validation = io.github.shunshun94.trpg.sw2.ytsheet.validation || {};

io.github.shunshun94.trpg.sw2.ytsheet.validation.CONSTS = io.github.shunshun94.trpg.sw2.ytsheet.validation.CONSTS || {};
io.github.shunshun94.trpg.sw2.ytsheet.validation.CONSTS.LEVEL =  {
    error: { weight: 5, prefix: '【重要】' },
    warn:  { weight: 3, prefix: '【確認】' },
    info:  { weight: 1, prefix: '【共有】' }
};

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
                'weapon\\d+Name': {includes: ['スタッフ', '発動体']},
                'weapon\\d+Note': {includes: '発動体'},
                'accessoryHand[LR]_*Name': {includes: ['発動体', 'マナリング']},
                'accessoryOther\d*Name': {includes: ['発動体', 'マナリング']},
                'items': {includes: '発動体'}
            }
        },
        ifNot: 'ソーサラー技能またはコンジャラー技能による魔法を行使するには魔法の発動体を装備している必要があります（『1』196頁）',
        label: 'sorcererRequiresDevice'
    }, {
        level: 'error',
        when: {
            'lvPri': 1
        },
        expect: {
            'accessory.*Name': {includes: '聖印'},
            'race': {includes: 'センティアン'},
            'accessory.*Note': {includes: '聖印'},
            'weapon\\d+Note': {includes: '聖印'},

        },
        ifNot: 'プリースト技能による魔法を行使するには聖印を装備している必要があります（『1』198頁）',
        label: 'priestRequiresSymbol'
    }, {
        level: 'error',
        when: {
            'lvMag': 1
        },
        expect: {
            'accessory.*Name': {includes: 'マギスフィア'},
            'accessory.*Note': {includes: 'マギスフィア'},
            'weapon\\d+Note': {includes: 'マギスフィア'},
            'armour\\d+Name': {includes: '機動外骨格'},
            'armour\\d+Note': {includes: 'マギスフィア'},
            'items': {includes: '機動外骨格'},
            'cashbook': {includes: '機動外骨格'}

        },
        ifNot: 'マギテック技能による魔法を行使するにはマギスフィアを装備している必要があります（『1』198頁）',
        label: 'magitecRequiresMagisphere'
    }, {
        level: 'error',
        when: {
            'lvFai': 1
        },
        expect: {
            'accessory.*Name': {includes: '宝石'}
        },
        ifNot: 'フェアリーテイマー技能による魔法を行使するには対応する宝石を装備している必要があります（『2』112頁）',
        label: 'fairytamerRequiresGems'
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
            'weapon\\d+Name': {includes: 'カードシューター'},
            'weapon\\d+Note': {includes: 'アルケミーキット'},
            'accessory[^_]*_+Name': {includes: 'アルケミーキット'}
        },
        ifNot: 'アルケミスト技能による賦術を行使するにはアルケミーキットを適切な部位に装備している必要があります（『3』114頁）',
        label: 'alchemiestRequiresAlchemyKit'
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
        ifNot: 'ドルイド技能による魔法を行使するには宿り木の棒杖またはそれを兼ねたスタッフを装備している必要があります（『ML』10頁）',
        label: 'druidRequiresMistletoe'
    }, {
        level: 'error',
        when: {
            'lvDem': 1
        },
        expect: {            
            'items': {includes: ['召異の刺青', '悪魔の印', '大型容器', '小型容器', '召異の刺繍']},
            'accessory.*Name': {includes: ['召異の徽章', '召異の微章']},
            'weapon\\d+Name': {includes: ['小魔', '召異']},
            'weapon\\d+Note': {includes: ['小魔', 'デーモンルーラー', 'デモル', '召異']},
            'accessory.*Note': {includes: ['召異の徽章', '召異の微章']},
            'cashbook': {includes: ['召異の刺青', '悪魔の印', '召異の刺繍']}
        },
        ifNot: 'デーモンルーラー技能による魔法を行使するには小魔の封入具を装備している必要があります（『ML』29頁）',
        label: 'demonRulerRequiresDemonSeal'
    }, {
        level: 'error',
        when: {
            'lvGeo': 1
        },
        expect: {            
            'accessory.*Name': {includes: 'ジオグラフ'}
        },
        ifNot: 'ジオマンサー技能による相域を使用するにはジオグラフを装備している必要があります（『MA』8頁）',
        label: 'geomancerRequiresGeograph'
    }, {
        level: 'error',
        when: {
            'lvWar': 1
        },
        expect: {            
            'accessory.*Name': {includes: '軍師徽章'},
            "armour\\d+Name":  { includes: '盾徽章' },
            "armour\\d+Note":  { includes: ['盾徽章', '軍師徽章'] },
            'weapon\\d+Name': {includes: '戦旗章'},
            'weapon\\d+Note': {includes: ['戦旗章', '軍師徽章']}
        },
        ifNot: 'ウォーリーダー技能による鼓咆と陣率を使用するには軍師徽章、戦旗章または盾徽章を装備している必要があります（『MA』19頁）',
        label: 'warleaderRequiresGeneralEmblem'
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
        ifNot: '金属鎧を着ている場合にソーサラー、コンジャラー、フェアリーテイマー、ドルイドまたはデーモンルーラーの各技能による魔法を行使するとペナルティ修正を受けます',
        label: 'metalArmorLimitatesMagics'
    }, {
        level: 'warn',
        when: {
            'and': {
                "armour\\d+Category": { 
                    func: (key, value, json) => {
                        if( value !== '非金属鎧' ) { return false; }
                        const keyPrefix = /(armour\d+)Category/.exec(key)[1];
                        return Number(json[`${keyPrefix}Reqd`]) >= 10;
                    }
                },
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
        ifNot: '必要筋力が10以上の非金属鎧を着ている場合にソーサラー、コンジャラー、またはデーモンルーラーの各技能による魔法による魔法を行使するとペナルティ修正を受けます',
        label: 'heavyArmorLimitatesMagics'
    }, {
        level: 'warn',
        when: {
            'lvSco': 1
        },
        expect: {
            'items': { includes: ['スカウト用ツール', '精密ツールセット', '機械仕掛けの指'] }
        },
        ifNot: 'スカウト用ツールを持っていない場合、一部の判定にペナルティ修正を受けます（『1』109頁）',
        label: 'scountRequiresScoutTools'
    }, {
        level: 'warn',
        when: {
            'craftAlchemy\\d+': { 
                includes: [
                    'インスタントウェポン',
                    'パラライズミスト',
                    'ポイズンニードル',
                    'ヒールスプレー',
                    'アーマーラスト',
                    'ディスペルニードル',
                    'マナスプラウト'
                ],
                levelLimitaion: {
                    level: 'lvAlc'
                }
            }
        },
        expect: {
                'combatFeatsLv\\d+': { includes: 'ターゲッティング' },
                'lvSor': { func: (key, value, json) =>{
                    return (Number(json.lvSor) >= 2) && (Number(json.lvCon) >= 2);
                }}
        },
        ifNot: '形状が射撃の賦術を習得しているようですが、戦闘特技 ターゲッティングを習得していないため対象との位置関係によっては誤射が発生します',
        label: 'healSprayRequiresTargetting'
    }, {
        level: 'info',
        when: 'always',
        expect: {
            'lvSco': { isEnoughLevel: true },
            'lvRan': { isEnoughLevel: true },
            'lvSag': { isEnoughLevel: true },
            'lvGeo': { isEnoughLevel: true },
            'lvRid': {func: (key, value, json) => {
                const advLevel = Number(json.level);
                const skiLevel = Number(value);
                for(var i = 0; i < skiLevel; i++) {
                    if(json[`craftRiding${i + 1}`] === '探索指令' ) {
                        return io.github.shunshun94.trpg.sw2.ytsheet.validation.isEnoughLevel(advLevel, skiLevel);
                    }
                }
                return false;
            }}
        },
        ifNot: '探索に用いる技能のレベルに比して冒険者レベルが高いようですがバランスは大丈夫でしょうか？（『3』75頁）',
        label: 'adventurerRequiresSearchingSkills'
    }, {
        level: 'info',
        when: 'always',
        expect: {
            'items': { includes: 'アウェイクポーション' },
            'lvPri': { ormore: 2 }
        },
        ifNot: '万が一の時のためにアウェイクポーション（『1』325頁）を持っておくことをおすすめします',
        label: 'adventurerRequiresAwakePotion'
    }
].sort((a, b)=>{
    return io.github.shunshun94.trpg.sw2.ytsheet.validation.CONSTS.LEVEL[b.level].weight - io.github.shunshun94.trpg.sw2.ytsheet.validation.CONSTS.LEVEL[a.level].weight;
});

io.github.shunshun94.trpg.sw2.ytsheet.validation.isFrontMember = (json) => {

};

io.github.shunshun94.trpg.sw2.ytsheet.validation.getValidationListAsMap = () => {
    const result = {};
    io.github.shunshun94.trpg.sw2.ytsheet.validation.VALIDATION_LIST.forEach((d)=>{
        if(result[d.label]) {
            const msg = `label ${d.label} が重複して宣言されています`;
            console.error(msg, result[d.label], d);
            throw msg;
        }
        result[d.label] = d;
    });
    return result;
};
