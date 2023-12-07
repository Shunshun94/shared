var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.ytsheet = io.github.shunshun94.trpg.sw2.ytsheet || {};
io.github.shunshun94.trpg.sw2.ytsheet.validation = io.github.shunshun94.trpg.sw2.ytsheet.validation || {};
io.github.shunshun94.trpg.sw2.ytsheet.validation.VALIDATION_TEST_LIST = {
    "sorcererRequiresDevice": [
        {
            'testName': 'ソーサラーで魔法の発動体を持っていない場合',
            'lvSor': '1',
            'expect': false
        }, {
            'testName': 'コンジャラーで魔法の発動体を持っていない場合',
            'lvCon': '1',
            'expect': false
        }, {
            'testName': 'ソーサラーで武器種：スタッフを持っている場合',
            'lvSor': '1',
            'weapon1Category': 'スタッフ',
            'expect': true
        }, {
            'testName': 'ソーサラーでマナスタッフを持っている場合',
            'lvSor': '1',
            'weapon1Name': 'マナスタッフ',
            'expect': true
        }, {
            'testName': 'ソーサラーで魔法の発動体を武器として持っている場合',
            'lvSor': '1',
            'weapon1Note': '魔法の発動体です',
            'expect': true
        }, {
            'testName': 'ソーサラーでマナリングを装備している場合',
            'lvSor': '1',
            'accessoryHandRName': 'マナリング',
            'expect': true
        }, {
            'testName': 'ソーサラーで発動体をアイテムとして持っている場合',
            'lvSor': '1',
            'items': '発動体',
            'expect': true
        }
    ],
    "priestRequiresSymbol": [
        {
            'testName': 'プリーストで聖印を持っていない場合',
            'lvPri': '1',
            'expect': false
        }, {
            'testName': 'プリーストで聖印を持っている場合',
            'lvPri': '1',
            'accessoryHeadName': '浄化の聖印',
            'expect': true
        }, {
            'testName': 'プリーストで携帯神殿を持っている場合（効果欄に聖印を兼ねる旨が記載されている）',
            'lvPri': '1',
            'accessoryBackNote': '聖印を兼ねる',
            'expect': true
        }, {
            'testName': 'プリーストで武器が聖印を兼ねる場合',
            'lvPri': '1',
            'weapon1Note': '聖印を兼ねる',
            'expect': true
        }, {
            'testName': 'プリーストで種族がセンティアンな場合',
            'lvPri': '1',
            'race': 'センティアン',
            'expect': true
        }
    ],
    "magitecRequiresMagisphere": [
        {
            'testName': 'マギテックでマギスフィアを持っていない場合',
            'lvMag': '1',
            'expect': false
        }, {
            'testName': 'マギテックでマギスフィアを持っている場合（名前欄）',
            'lvMag': '1',
            'accessoryHeadName': 'マギスフィア（小）',
            'expect': true
        }, {
            'testName': 'マギテックでマギスフィアを持っている場合（効果欄）',
            'lvMag': '1',
            'accessoryHeadNote': 'マギスフィアを兼用',
            'expect': true
        }, {
            'testName': 'マギテックでマギスフィアを持っている場合（武器効果欄）',
            'lvMag': '1',
            'weapon1Note': 'マギスフィアを兼用',
            'expect': true
        }, {
            'testName': 'マギテックでマギスフィアを持っている場合（防具効果欄）',
            'lvMag': '1',
            'armour1Note': 'マギスフィアを兼用',
            'expect': true
        }, {
            'testName': 'マギテックで機動外骨格を持っている場合（防具名前欄）',
            'lvMag': '1',
            'armour1Name': '機動外骨格',
            'expect': true
        }, {
            'testName': 'マギテックで機動外骨格を持っている場合（アイテム欄）',
            'lvMag': '1',
            'items': '機動外骨格',
            'expect': true
        }, {
            'testName': 'マギテックで機動外骨格を持っている場合（収支欄）',
            'lvMag': '1',
            'cashbook': '機動外骨格',
            'expect': true
        }
    ],
    "fairytamerRequiresGems": [
        {
            'testName': 'フェアリーテイマーで宝石を持っていない場合',
            'lvFai': '1',
            'expect': false
        }, {
            'testName': 'フェアリーテイマーで宝石を持っている場合（素の宝石）',
            'lvFai': '1',
            'accessoryHeadName': '妖精使いの宝石',
            'expect': true
        }, {
            'testName': 'フェアリーテイマーで宝石を持っている場合（宝石ケース）',
            'lvFai': '1',
            'accessoryHeadName': '宝石ケース',
            'expect': true
        }, {
            'testName': 'フェアリーテイマーで宝石を持っている場合（華美なる宝石飾り）',
            'lvFai': '1',
            'accessoryHeadName': '華美なる宝石飾り',
            'expect': true
        }
    ],
    "alchemiestRequiresAlchemyKit": [
        {
            'testName': 'アルケミストでアルケミーキットを持っていない場合',
            'lvAlc': '1',
            'expect': false
        }, {
            'testName': 'アルケミストでアルケミーキットを適切な部位に持っていない場合',
            'lvAlc': '1',
            'accessoryHeadName': 'アルケミーキット',
            'expect': false
        }, {
            'testName': 'アルケミストでアルケミーキットを持っている場合',
            'lvAlc': '1',
            'accessoryWaistName': 'アルケミーキット',
            'expect': true
        }, {
            'testName': 'アルケミストでアルケミーキットを持っている場合（多機能ベルト）',
            'lvAlc': '1',
            'accessoryWaist_Name': 'アルケミーキット',
            'expect': true
        }, {
            'testName': 'アルケミストでカードシューターを持っている場合（アイテム欄）',
            'lvAlc': '1',
            'items': 'カードシューター',
            'expect': true
        }, {
            'testName': 'アルケミストでカードシューターを持っている場合（武器名前欄）',
            'lvAlc': '1',
            'weapon1Name': 'カードシューター',
            'expect': true
        }, {
            'testName': 'アルケミストでアルケミーキットを兼ねる武器を持っている場合',
            'lvAlc': '1',
            'weapon1Note': 'アルケミーキット',
            'expect': true
        }
    ],
    "druidRequiresMistletoe": [
        {
            'testName': 'ドルイドで宿り木の棒杖を持っていない場合',
            'lvDru': '1',
            'expect': false
        }, {
            'testName': 'ドルイドで宿り木の棒杖を武器として持っている場合（備考欄）',
            'lvDru': '1',
            'weapon1Note': '宿り木の棒杖加工',
            'expect': true
        }, {
            'testName': 'ドルイドで宿り木の棒杖を武器として持っている場合（名前欄）',
            'lvDru': '1',
            'weapon1Note': '宿木マナスタッフ',
            'expect': true
        }, {
            'testName': 'ドルイドで宿り木の棒杖を道具として持っている場合',
            'lvDru': '1',
            'items': '宿り木の棒杖',
            'expect': true
        }
    ],
    "demonRulerRequiresDemonSeal": [
        {
            'testName': 'デーモンルーラーで小魔の封入具を持っていない場合',
            'lvDem': '1',
            'expect': false
        }, {
            'testName': 'デーモンルーラーで召異の刺青を持っている場合（持ち物）',
            'lvDem': '1',
            'items': '召異の刺青',
            'expect': true
        }, {
            'testName': 'デーモンルーラーで召異の刺青を持っている場合（武器欄）',
            'lvDem': '1',
            'weapon1Name': '召異の刺青',
            'expect': true
        }, {
            'testName': 'デーモンルーラーで召異の徽章を持っている場合（名前欄）',
            'lvDem': '1',
            'accessoryNeckName': '召異の徽章',
            'expect': true
        }, {
            'testName': 'デーモンルーラーで召異の徽章を持っている場合（効果欄）',
            'lvDem': '1',
            'accessoryNeckNote': '召異の徽章',
            'expect': true
        }, {
            'testName': 'デーモンルーラーで小魔の封入具加工済みの武器を持っている場合（名前欄）',
            'lvDem': '1',
            'weapon1Name': '小魔の封入具ロングソード',
            'expect': true
        }, {
            'testName': 'デーモンルーラーで小魔の封入具加工済みの武器を持っている場合（備考欄）',
            'lvDem': '1',
            'weapon1Name': '小魔の封入具',
            'expect': true
        }, {
            'testName': 'デーモンルーラーで悪魔の印を持っている場合（収支欄）',
            'lvDem': '1',
            'cashbook': '悪魔の印',
            'expect': true
        }
    ],
    "geomancerRequiresGeograph": [
        {
            'testName': 'ジオマンサーでジオグラフを持っていない場合',
            'lvGeo': '1',
            'expect': false
        }, {
            'testName': 'ジオマンサーでジオグラフを持っている場合',
            'lvGeo': '1',
            'accessoryHeadName': 'ジオグラフ',
            'expect': true
        }, {
            'testName': 'ジオマンサーでジオグラフを持っている場合（追加部位）',
            'lvGeo': '1',
            'accessoryHead_Name': 'ジオグラフ',
            'expect': true 
        }
    ],
    "warleaderRequiresGeneralEmblem": [
        {
            'testName': 'ウォーリーダーで軍師徽章を持っていない場合',
            'lvWar': '1',
            'expect': false
        }, {
            'testName': 'ウォーリーダーで軍師徽章を持っている場合',
            'lvWar': '1',
            'accessoryHeadName': '軍師徽章',
            'expect': true
        }, {
            'testName': 'ウォーリーダーで盾徽章を持っている場合（名前欄）',
            'lvWar': '1',
            'armour2Name': '盾徽章',
            'expect': true
        }, {
            'testName': 'ウォーリーダーで盾徽章を持っている場合（効果欄・記載が盾徽章）',
            'lvWar': '1',
            'armour2Note': '盾徽章',
            'expect': true
        }, {
            'testName': 'ウォーリーダーで盾徽章を持っている場合（効果欄・記載が軍師徽章）',
            'lvWar': '1',
            'armour2Note': '軍師徽章',
            'expect': true
        }, {
            'testName': 'ウォーリーダーで戦旗章を持っている場合（名前欄）',
            'lvWar': '1',
            'weapon2Name': '戦旗章',
            'expect': true
        }, {
            'testName': 'ウォーリーダーで戦旗章を持っている場合（効果欄・記載が戦旗章）',
            'lvWar': '1',
            'weapon2Note': '戦旗章',
            'expect': true
        }, {
            'testName': 'ウォーリーダーで戦旗章を持っている場合（効果欄・記載が軍師徽章）',
            'lvWar': '1',
            'weapon2Note': '軍師徽章',
            'expect': true
        }
    ],
    "metalArmorLimitatesMagics": [
        {
            'testName': 'ソーサラーで金属鎧を着ている場合',
            'lvSor': '1',
            "armour1Category": '金属鎧',
            "armour2Category": '盾',
            'expect': false
        }, {
            'testName': 'ソーサラーで金属鎧を着ていない場合',
            'lvSor': '1',
            "armour1Category": '非金属鎧',
            "armour2Category": '盾',
            "armour3Category": 'その他',
            'expect': true
        }, {
            'testName': 'ソーサラーで金属鎧を着ているがナイトメアな場合',
            'lvSor': '1',
            "armour1Category": '金属鎧',
            "armour2Category": '盾',
            "race": 'ナイトメア（人間）',
            'expect': true
        }
    ],
    "heavyArmorLimitatesMagics": [
        {
            'testName': 'ソーサラーで必筋10以上の非金属鎧を着ている場合',
            'lvSor': '1',
            "armour1Category": '非金属鎧',
            "armour1Reqd": "10",
            "armour2Category": '盾',
            "armour2Reqd": "9",
            "armour3Category": 'その他',
            "armour3Reqd": "9",
            'expect': false
        }, {
            'testName': 'ソーサラーで必筋9以下の非金属鎧を着ている場合',
            'lvSor': '1',
            "armour1Category": '非金属鎧',
            "armour1Reqd": "9",
            "armour2Category": '盾',
            "armour2Reqd": "9",
            "armour3Category": 'その他',
            "armour3Reqd": "9",
            'expect': true
        }, {
            'testName': 'ソーサラーで必筋10以上の盾を持っている場合',
            'lvSor': '1',
            "armour1Category": '非金属鎧',
            "armour1Reqd": "9",
            "armour2Category": '盾',
            "armour2Reqd": "10",
            "armour3Category": 'その他',
            "armour3Reqd": "9",
            'expect': true
        }, {
            'testName': 'ソーサラーで必筋10以上の非金属鎧を着ているがナイトメアな場合',
            'lvSor': '1',
            "armour1Category": '非金属鎧',
            "armour1Reqd": "10",
            "armour2Category": '盾',
            "armour2Reqd": "9",
            "armour3Category": 'その他',
            "armour3Reqd": "9",
            "race": 'ナイトメア（人間）',
            'expect': true
        }
    ],
    "scountRequiresScoutTools": [
        {
            'testName': 'スカウト技能でスカウト用ツールを持っていない場合',
            'lvSco': '1',
            'expect': false
        }, {
            'testName': 'スカウト技能でスカウト用ツールを持っている場合',
            'lvSco': '1',
            'items': 'スカウト用ツール',
            'expect': true
        }, {
            'testName': 'スカウト技能で精密ツールセットを持っている場合',
            'lvSco': '1',
            'items': '精密ツールセット',
            'expect': true
        }, {
            'testName': 'スカウト技能で機械仕掛けの指を持っている場合',
            'lvSco': '1',
            'items': '機械仕掛けの指',
            'expect': true
        }
    ],
    "healSprayRequiresTargetting": [
        {
            'testName': 'ヒールスプレーを習得していてターゲッティングを持っていない場合',
            'lvAlc': '1',
            'craftAlchemy1': 'ヒールスプレー',
            'expect': false
        }, {
            'testName': 'ヒールスプレーを習得していてターゲッティングを持っている場合',
            'lvAlc': '3',
            'craftAlchemy1': 'ヒールスプレー',
            'combatFeatsLv3': 'ターゲッティング',
            'expect': true
        }, {
            'testName': 'ヒールスプレーを予約していてターゲッティングを持っていない場合',
            'lvAlc': '1',
            'craftAlchemy2': 'ヒールスプレー',
            'expect': true
        }, {
            'testName': 'ヒールスプレーを習得していてウィザードがレベル2の場合',
            'lvAlc': '1',
            'lvSor': '2',
            'lvCon': '2',
            'craftAlchemy1': 'ヒールスプレー',
            'expect': true
        }, {
            'testName': 'ヒールスプレーを習得していてウィザードがレベル3以上の場合',
            'lvAlc': '1',
            'lvSor': '3',
            'lvCon': '3',
            'craftAlchemy1': 'ヒールスプレー',
            'expect': true
        }, {
            'testName': 'ヒールスプレーを習得していてソーサラーがレベル2だがコンジャラーがレベル1の場合',
            'lvAlc': '1',
            'lvSor': '2',
            'lvCon': '1',
            'craftAlchemy1': 'ヒールスプレー',
            'expect': false
        }, {
            'testName': 'ヒールスプレーを習得していてコンジャラーがレベル2だがソーサラーがレベル1の場合',
            'lvAlc': '1',
            'lvSor': '1',
            'lvCon': '2',
            'craftAlchemy1': 'ヒールスプレー',
            'expect': false
        }
    ],
    "adventurerRequiresSearchingSkills": [
        {
            'testName': '探索技能を全くを持っていない場合',
            'level': '5',
            'expect': false
        }, {
            'testName': 'レベル5でスカウトがレベル2の場合',
            'level': '5',
            'lvSco': '2',
            'expect': false
        }, {
            'testName': 'レベル5でスカウトがレベル3の場合',
            'level': '5',
            'lvSco': '3',
            'expect': true
        }, {
            'testName': 'レベル1でスカウトがレベル1の場合',
            'level': '1',
            'lvSco': '1',
            'expect': true
        }, {
            'testName': 'レベル2でスカウトがレベル1の場合',
            'level': '2',
            'lvSco': '1',
            'expect': true
        }, {
            'testName': 'レベル10でスカウトがレベル7の場合',
            'level': '10',
            'lvSco': '7',
            'expect': false
        }, {
            'testName': 'レベル10でスカウトがレベル8の場合',
            'level': '10',
            'lvSco': '8',
            'expect': true
        }, {
            'testName': 'レベル11でスカウトがレベル8の場合',
            'level': '11',
            'lvSco': '8',
            'expect': true
        }, {
            'testName': 'レベル15でスカウトがレベル11の場合',
            'level': '15',
            'lvSco': '11',
            'expect': false
        }, {
            'testName': 'レベル15でスカウトがレベル12の場合',
            'level': '15',
            'lvSco': '12',
            'expect': true
        }, {
            'testName': 'レベル5でレンジャーがレベル3の場合',
            'level': '5',
            'lvRan': '3',
            'expect': true
        }, {
            'testName': 'レベル5でセージがレベル3の場合',
            'level': '5',
            'lvSag': '3',
            'expect': true
        }, {
            'testName': 'レベル5でジオマンサーがレベル3の場合',
            'level': '5',
            'lvGeo': '3',
            'expect': true
        }, {
            'testName': 'レベル5でライダーがレベル3で探索指令を持っていない場合',
            'level': '5',
            'lvRid': '3',
            'craftRiding1': '高所攻撃',
            'expect': false
        }, {
            'testName': 'レベル5でライダーがレベル3で探索指令を持っている場合',
            'level': '5',
            'lvRid': '3',
            'craftRiding1': '探索指令',
            'expect': true
        }
    ],
    "adventurerRequiresAwakePotion": []
};

