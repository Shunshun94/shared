var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.ytsheet = io.github.shunshun94.trpg.sw2.ytsheet || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.exec = (json) => {
    const result = {
        author: json.playerName,
        initiative: json.initiative,
        intellect: (Number(json.sttInt) > 29) ? '高い' : '人間並み',
        language: io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getLanguage(json),
        lv: json.level,
        mndResist: json.mndResistTotal,
        mndResistFix: Number(json.mndResistTotal) + 7,
        mobility: json.mobilityTotal,
        monsterName: json.characterName,
        perception: (json.raceAbility.includes('暗視')) ? '五感（暗視）' : '五感',
        reputation: Number(json.level) + 4,
        sin: json.sin || 0,
        status1Defense: json.defenseTotal1Def,
        status1Evasion:json.defenseTotal1Eva,
        status1EvasionFix:Number(json.defenseTotal1Eva) + 7,
        status1Hp:json.hpTotal,
        status1Mp:json.mpTotal,
        statusNum:1,
        taxa: '人族',
        type: 'm',
        vitResist: json.vitResistTotal,
        vitResistFix: Number(json.vitResistTotal) + 7
    };
    const weapon = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getAttackWay(json);
    for(var key in weapon) {
        result[key] = weapon[key];
    }
    return result;
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.CRITICAL_COEFFCIENTS = {
    7: 36/15,
    8: 36/21,
    9: 36/26,
    10: 36/30,
    11: 36/33,
    12: 36/35,
    13: 1
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getWeaponList = (json) => {
    const count = Number(json.weaponNum);
    const list = [];
    for(var i = 0; i < count; i++) {
        const id = i + 1;
        list.push({
            name:            json[`weapon${id}Name`],
            acc:      Number(json[`weapon${id}Acc`]),
            accTotal: Number(json[`weapon${id}AccTotal`]),
            rate:     Number(json[`weapon${id}Rate`]),
            crit:     Number(json[`weapon${id}Crit`]),
            dmg:      Number(json[`weapon${id}Dmg`]),
            dmgTotal: Number(json[`weapon${id}DmgTotal`]),
            category:        json[`weapon${id}Category`],
            class:           json[`weapon${id}Class`],
            own:             json[`weapon${id}Own`],
            reqd:     Number(json[`weapon${id}Reqd`]),
            usage:           json[`weapon${id}Usage`],
        });
    }
    return list.map((w)=>{
        w.expected = w.dmgTotal + Math.round(((w.rate + 10) / 6) * (io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.CRITICAL_COEFFCIENTS[w.crit] || 1));
        return w;
    });
};

// コボルドの攻撃能力そのまんま
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.DEFAULT_WEAPON = {
    name: 'ナイフ',
    expected: 8,
    acc: 3,
    accTotal: 10
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getAttackWay = (json) => {
    const weapons = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getWeaponList(json);
    const expectedWeapons = weapons.reduce((c, w)=>{
        if( w.expected >= c.expected) {
            return w;
        } else {
            return c;
        }
    }, io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.DEFAULT_WEAPON);
    return {
        status1Accuracy:   expectedWeapons.acc,
        status1AccuracyFix:expectedWeapons.accTotal,
        status1Damage:     `2d6+${expectedWeapons.expected - 7}`,
        status1Style:      expectedWeapons.name
    };
};


// ダメージ期待値 https://w.atwiki.jp/wiki2_sw/pages/89.html

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getLanguage = (json) => {
    const languageCount = Number(json.languageNum);
    const list = [];
    for(var i = 0; i < languageCount; i++) {
        if(json[`language${i + 1}Talk`]) { list.push(json[`language${i + 1}`]) }
    }
    return list.join('、');
};