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
                'accessoryOther\\d*_*Name': {includes: ['発動体', 'マナリング']},
                'items': {includes: '発動体'},
                'raceAbility': { includes: ['魔剣の所持', '邪視と瞳石'] }
            }
        },
        ifNot: 'ソーサラー技能またはコンジャラー技能による魔法を行使するには魔法の発動体を所持または装備している必要があります（『1』196頁）',
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
            'accessoryOther\\d*_*Name': {includes: 'アルケミーキット'},
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
        ifNot: 'ドルイド技能による魔法を行使するには宿り木の棒杖を所持またはそれを兼ねたスタッフを装備している必要があります（『ML』10頁）',
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
        ifNot: 'デーモンルーラー技能による魔法を行使するには小魔の封入具を所持ないし装備している必要があります（『ML』29頁）',
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
        level: 'error',
        when: {
            'lvAby': 1
        },
        expect: {
            'items': {includes: 'アビスナイフ'},
            'weapon\\d+Name': {includes: 'アビスナイフ'},
            'weapon\\d+Note': {includes: 'アビスナイフ'}
        },
        ifNot: 'アビスゲイザー技能による魔法を行使するにはアビスナイフを所持している必要があります',
        label: 'hasAbyssknife'
    }, {
        level: 'error',
        when: {
            'weapon\\dCategory': { equal: ['ボウ', 'クロスボウ'] }
        },
        expect: {            
            'accessoryOther\\d*_*Name': { includes: ['えびら', '矢筒', '箙'] },
            'accessoryWaistName': { includes: ['えびら', '矢筒', '箙'] },
            'accessoryBackName': { includes: ['えびら', '矢筒', '箙'] },
            'accessory[a-zA-Z]+_+Name': { includes: ['えびら', '矢筒', '箙'] }
        },
        ifNot: 'えびらまたは矢筒を装備していないと補助動作で矢・太矢をつがえることができません（『1』163頁）',
        label: 'hasArrowHolders'
    }, {
        level: 'error',
        when: 'always',
        expect: {
            'id': {
                count: {
                    key: 'accessory.*',
                    includes: ['えびら', '矢筒', '箙', 'ガンベルト', 'バレットスリンガー', 'バレットポーチ'],
                    required: { orless: 2 }
                }
            }
        },
        ifNot: '矢弾の収納具は一度に2つまでしか装備できません（『1』163頁）',
        label: 'arrowHoldersLimitation'
    }, {
        level: 'error',
        when: {
            and: {
                historyExpTotal: { equal: "3000" },
                historyMoneyTotal: { equal: "1200" }
            }
        },
        expect: {
            level: { orless: 2 }
        },
        ifNot: '初期作成時点での冒険者レベルは2以下にしてください（『1』76頁）',
        label: 'initialCharacterLevelLimitation'
    }, {
        level: 'warn',
        when: {
            and: {
                'combatFeatsLv\\d+': {
                    includes: '魔法拡大／数',
                    levelLimitaion: { level: 'level' }
                },
                'fairyContractWind': { func: (key, value, json)=>{
                    const contractCount = ['fairyContractDark', 'fairyContractEarth', 'fairyContractFire', 'fairyContractLight', 'fairyContractWater', 'fairyContractWind'].filter((contract)=>{
                        return json[contract];
                    }).length;
                    if( contractCount === 6 ) { return Number(json.lvFai) >= 10; }
                    if( contractCount === 4 ) { return Number(json.lvFai) >= 7;  }
                    if( contractCount <=  3 ) { return Number(json.lvFai) >= 6;  }
                    return false
                }}
            }
        },
        expect: {           
            'accessoryOther\\d*_*Name': { includes: ['えびら', '矢筒', '箙'] },
            'accessoryWaistName': { includes: ['えびら', '矢筒', '箙'] },
            'accessoryBackName': { includes: ['えびら', '矢筒', '箙'] },
            'accessory[a-zA-Z]+_+Name': { includes: ['えびら', '矢筒', '箙'] }
        },
        ifNot: 'えびらまたは矢筒を装備していないと【シュートアロー】の際に魔法拡大／数を使用することができません（『2』201頁）',
        label: 'hasShootArrowArrowHolders'
    }, {
        level: 'warn',
        when: {
            'weapon\\d+Category': { equal: 'ガン' }
        },
        expect: {            
            'accessoryOther\\d*_*Name': { includes: ['ガンベルト', 'バレットスリンガー', 'バレットポーチ'] },
            'accessoryWaistName': { includes: ['ガンベルト', 'バレットポーチ'] },
            'accessoryBackName': { includes: ['ガンベルト', 'バレットポーチ'] },
            'accessoryLegName': { includes: ['バレットスリンガー', 'バレットポーチ'] },
            'accessory[a-zA-Z]+_+Name': { includes: ['ガンベルト', 'バレットスリンガー', 'バレットポーチ'] }
        },
        ifNot: 'ガンベルト、バレットスリンガーまたはバレットポーチを装備していないと主動作で銃弾を装填することができません（『1』163頁）',
        label: 'hasBulletHolders'
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
                    'lvDem': 1,
                    'lvAby': 1
                }
            }
        },
        expect: {
            'race': { includes: 'ナイトメア' }
        },
        ifNot: '金属鎧を着ている場合にソーサラー、コンジャラー、フェアリーテイマー、ドルイド、デーモンルーラー、アビスゲイザーの各技能による魔法を行使するとペナルティ修正を受けます',
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
            'items': { includes: ['スカウト用ツール', 'スカウトツール', '精密ツールセット', '機械仕掛けの指'] }
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
                'combatFeatsLv\\d+': {
                    includes: 'ターゲッティング',
                    levelLimitaion: { level: 'level' }
                },
                'and': {
                    'lvSor': { ormore: 2 },
                    'lvCon': { ormore: 2 }
                },
                'craftAlchemy1': {
                    isFrontMember: 1
                }
        },
        ifNot: '形状が射撃の賦術を習得しているようですが、戦闘特技 ターゲッティングを習得していないため対象との位置関係によっては誤射が発生します',
        label: 'healSprayRequiresTargetting'
    }, {
        level: 'warn',
        when: {
            'lvFig': { isEnoughLevel: true },
            'lvGra': { isEnoughLevel: true },
            'lvFen': { isEnoughLevel: true },
            'lvBat': { isEnoughLevel: true },
            'lvSho': {
                and: {
                    'lvSho': { isEnoughLevel: true },
                    'combatFeatsLv\\d+': {
                        levelLimitaion: {level: 'level'},
                        includes: '射手の体術'
                    }
                }
            },
            'lvDem': { isEnoughLevel: true }
        },
        expect: {
            'evasionClass': true
        },
    ifNot: '回避に用いる技能を指定することでチャットパレットやキャラクターシートの表示に反映されます',
    label: 'noEvasionClassEmpty'
    }, {
        level: 'warn',
        when: {
            'lvFig': { isEnoughLevel: true },
            'lvGra': { isEnoughLevel: true },
            'lvFen': { isEnoughLevel: true },
            'lvBat': { isEnoughLevel: true },
            'lvSho': { isEnoughLevel: true },
            'lvDem': { 
                and: {
                    'lvDem': { ormore: 11 },
                    'weapon\\dName': { includes: 'デモンズブレード' }
                }
            }
        },
        expect: {
            'weapon\\d+Name': { func: (key, value, json) => {
                const keyPrefix = /(weapon\d+)Name/.exec(key)[1];
                return Boolean(json[`${keyPrefix}Class`] || '');
            }}
        },
    ifNot: '武器攻撃に用いる技能を指定することでチャットパレットやキャラクターシートの表示に反映されます',
    label: 'noWeaponClassEmpty'
    }, {
        level: 'warn',
        when: {
            'accessory.*Name': {includes: '集中の鉢巻き'}
        },
        expect: {
            'lvSag': { ormore: 3 }
        },
        ifNot: '集中の鉢巻きの効果を得るにはセージ技能が3レベル以上である必要があります（『2』262頁）',
        label: 'headbandOfConcentrateRequiresSageLevel'
    }, {
        level: 'warn',
        when: {
            'accessory.*Name': {includes: '野伏の'}
        },
        expect: {
            'lvRan': { ormore: 3 }
        },
        ifNot: '野伏の＊＊マントの効果を得るにはレンジャー技能が3レベル以上である必要があります（『2』266頁）',
        label: 'manteauOfNobushiRequiresRangerLevel'
    }, {
        level: 'warn',
        when: {
            'accessory.*Name': {includes: '多機能'}
        },
        expect: {
            'lvSco': { ormore: 3 }
        },
        ifNot: '多機能の＊＊ベルトの効果を得るにはスカウト技能が3レベル以上である必要があります（『2』267頁）',
        label: 'multipleUseBeltRequiresScoutLevel'
    }, {
        level: 'warn',
        when: {
            'accessory.*Name': {includes: '華美なる'}
        },
        expect: {
            'lvFai': { ormore: 3 }
        },
        ifNot: '華美なる宝石飾りの効果を得るにはフェアリーテイマー技能が3レベル以上である必要があります（『2』249頁）',
        label: 'gorgeousJwelRequiresFairyTamerLevel'
    }, {
        level: 'warn',
        when: {
            'accessory.*Name': {includes: ['真ブラックベルト', '真・ブラックベルト']}
        },
        expect: {
            'lvGra': { ormore: 3 }
        },
        ifNot: '真・ブラックベルトの効果を得るにはグラップラー技能が3レベル以上である必要があります（『2』269頁）',
		label: 'trueBlackBeltRequiresGrapplerLevel'
	}, {
        level: 'warn',
        when: {
            'accessory.*Name': {includes: 'レースアップコルセット'}
        },
        expect: {
            'lvBat': { ormore: 3 }
        },
        ifNot: 'レースアップコルセットの効果を得るにはバトルダンサー技能が3レベル以上である必要があります（『BM』84頁）',
		label: 'corsetRequiresBattleDancerLevel'
	}, {
        level: 'warn',
        when: {
            'weapon\\d+Name': {includes: 'アビスナイフ'},
            'weapon\\d+Note': {includes: 'アビスナイフ'}
        },
        expect: {
            'weapon\\d+Name': {includes: ['[刃]', 'ライジングサン', 'タイラント', 'エッジドアーム']},
            'weapon\\d+Category': { equal: ['ソード', 'アックス', 'スピア', 'ウォーハンマー', 'ボウ', 'クロスボウ'] }
        },
        ifNot: 'アビスナイフ加工を施す武器は刃のついた武器である必要があります',
        label: 'abyssKnifeMustBeEdged'
    }, {
        level: 'info',
        when: {
            'lvFen': { isEnoughLevel: true }
        },
        expect: {
            'weapon\\d+Crit': { func: (key, value, json) =>{
                const weaponCommonCriticalMap = {
                    'ソード': 10, 'アックス': 11, 'スピア': 10, 'メイス': 12, 'スタッフ': 12, 'フレイル': 10, 'ウォーハンマー': 10
                };
                const weaponIndex = /weapon(\d+)Crit/.exec(key)[1];
                const weaponCategory = `weapon${weaponIndex}Category`;
                const commonCritical = weaponCommonCriticalMap[json[weaponCategory]];
                console.log(key, value, weaponIndex, weaponCategory, commonCritical);
                if(commonCritical) {
                    return Number(value) < commonCritical;
                } else {
                    // 上述のもの以外は対象外・ケースバイケースなので判定対象外とする
                    return true;
                }
            } }
        },
        ifNot: 'フェンサー技能で武器攻撃を行う場合、武器のクリティカル値の欄に -1 した値を入れておくことでチャットパレットにもクリティカル値が反映されます',
        label: 'fencerCriticalBonusShouldBeInputed'
    }, {
        level: 'info',
        when: 'always',
        expect: {
            'lvSco': { isEnoughLevel: true },
            'lvRan': { isEnoughLevel: true },
            'lvSag': { isEnoughLevel: true },
            'lvGeo': { isEnoughLevel: true },
            'lvRid': {
                and: {
                    'lvRid': { isEnoughLevel: true },
                    'craftRiding\\d+': { includes:  '探索指令' }
                }
            }
        },
        ifNot: '探索に用いる技能のレベルに比して冒険者レベルが高いようですがバランスは大丈夫でしょうか？（『3』75頁）',
        label: 'adventurerRequiresSearchingSkills'
    }, {
        level: 'info',
        when: 'always',
        expect: {
            'items': { includes: ['アウェイクポーション', 'アウェイクンポーション', '気付け薬', '気づけ薬'] },
            'lvPri': { ormore: 2 }
        },
        ifNot: '万が一の時のためにアウェイクポーション（『1』325頁）を持っておくことをおすすめします',
        label: 'adventurerRequiresAwakePotion'
    }
].sort((a, b)=>{
    return io.github.shunshun94.trpg.sw2.ytsheet.validation.CONSTS.LEVEL[b.level].weight - io.github.shunshun94.trpg.sw2.ytsheet.validation.CONSTS.LEVEL[a.level].weight;
});

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
