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
        }
    ],
    "magitecRequiresMagisphere": [],
    "fairytamerRequiresGems": [],
    "alchemiestRequiresAlchemyKit": [],
    "druidRequiresMistletoe": [],
    "demonRulerRequiresDemonSeal": [],
    "geomancerRequiresGeograph": [],
    "warleaderRequiresGeneralEmblem": [],
    "metalArmorLimitatesMagics": [],
    "heavyArmorLimitatesMagics": [],
    "scountRequiresScoutTools": [],
    "healSprayRequiresTargetting": [],
    "adventurerRequiresSearchingSkills": [],
    "adventurerRequiresAwakePotion": []
};


