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
        initiative: Number(json.initiative) + 7,
        intellect: (Number(json.sttInt) > 29) ? '高い' : '人間並み',
        language: io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getLanguage(json),
        lv: json.level,
        mndResist: json.mndResistTotal,
        mndResistFix: Number(json.mndResistTotal) + 7,
        mobility: json.mobilityTotal,
        monsterName: json.characterName,
        perception: (json.raceAbility.includes('暗視')) ? '五感（暗視）' : '五感',
        reputation: Number(json.level) + 3,
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
    result.skills = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.generateSkills(json);
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
        w.expected = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.calcExpectedDamage(w);
        return w;
    });
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.calcExpectedDamage = (w) => {
    return w.dmgTotal + Math.round(((w.rate + 10) / 6) * (io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.CRITICAL_COEFFCIENTS[w.crit] || 1));
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.generateSkills = (json) => {
    let result = [];

    const magics = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getMagicInfo(json);
    result = result.concat(magics.texts);
    const magicLikes = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getMagicLikeInfo(json);
    result = result.concat(magicLikes.texts);
    const battleSkills = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getBattleSkillsInfo(json);
    result = result.concat(battleSkills.texts);

    return result.join('&lt;br&gt;&lt;br&gt;');
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.MAX_LEVEL = 17;

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getBattleSkillList = (json) => {
    const list = [];
    for(var i = 0; i < io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.MAX_LEVEL; i++) {
        if(json[`combatFeatsLv${i + 1}`]) {
            list.push(json[`combatFeatsLv${i + 1}`]);
        }
    }
    return list.concat(json.combatFeatsAuto ? json.combatFeatsAuto.split(',') : []);
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getBattleSkillsInfo = (json) => {
    const battleSkillList = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getBattleSkillList(json);
    
    const skillMap = {};
    battleSkillList.forEach((name)=>{
        if(io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.BATTLE_SKILLS.LIST[name]) {
            const targetSkill = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.BATTLE_SKILLS.LIST[name];
            if(! targetSkill.skip) {
                const cursor = targetSkill.group || name;
                if(! skillMap[cursor]) {
                    skillMap[cursor] = {
                        timing: [],
                        list: []
                    };
                }
                const text = targetSkill.replace || (targetSkill.replaceFunction ? targetSkill.replaceFunction(json) : name);
                skillMap[cursor].timing.push(targetSkill.timing);
                skillMap[cursor].list.push(text);
            }
        } else {
            skillMap[name] = {
                timing: ['常'], list: [name]
            }
        }
    });
    const result = [];
    for(var key in skillMap) {
        const target = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.BATTLE_SKILLS.FILTER[key] ? io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.BATTLE_SKILLS.FILTER[key](skillMap[key]) : skillMap[key];
        const icons = target.timing.flat().filter((elem, index, self) => {
            return self.indexOf(elem) === index;
        }).map((elem)=>{
            return io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.BATTLE_SKILLS.TIMING[elem];
        }).join('');
        const names = target.list.join('、');
        result.push(`${icons}${names}`);
    }
    return {
        texts: result
    };
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.FAIRY_ELEMENTS = {
    Earth: '土', Water: '水・氷', Fire:'炎', Wind:'風', Light:'光', Dark:'闇'
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.MAGIC_SUFFIX = {
    'Sor': {name:'真語魔法'},
    'Con': {name:'操霊魔法'},
    'Pri': {name:'神聖魔法'},
    'Mag': {name:'魔動機術'},
    'Fai': {name:'妖精魔法', secondLine: (json)=>{
        const list = [];
        for(var key in io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.FAIRY_ELEMENTS) {
            if(json[`fairyContract${key}`]) {
                list.push(`「${io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.FAIRY_ELEMENTS[key]}」`);
            }
        }
        return `使用する属性は${list.join('')}です。`;
    }},
    'Dem': {name:'召異魔法'},
    'Dru': {name:'森羅魔法'},
    'Gri': {name:'秘奥魔法', skill:'magicGramarye'}
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getMagicInfo = (json) => {
    const result = {
        max: 0,
        texts: []
    };
    const magicList = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.MAGIC_SUFFIX;
    for(var key in magicList) {
        if(json[`lv${key}`]) {
            const category = magicList[key];
            const power = Number(json[`magicPower${key}`]);
            if( power > result.max) {
                result.max = power;
            }
            if(category.secondLine) {
                result.texts.push(`▶${category.name}${json[`lv${key}`]}レベル／魔力${power}（${power + 7}）&lt;br&gt;${category.secondLine(json)}`);
            }else if(category.skill) {
                let i = 1;
                const skillList = [];
                while(json[`${category.skill}${i}`]) {
                    skillList.push(`【${json[`${category.skill}${i}`]}】`);
                    i++;
                }
                result.texts.push(`▶${category.name}${json[`lv${key}`]}レベル／魔力${power}（${power + 7}）&lt;br&gt;${skillList.join('')}の${category.name}を使用します。`);
            } else {
                result.texts.push(`▶${category.name}${json[`lv${key}`]}レベル／魔力${power}（${power + 7}）`);
            }
        }
    }
    return result;
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.NOMAGIC_SUFFIX = {
    'Enh': {name:'練技', skill:'craftEnhance',    mark:'▶≫△'},
    'Alc': {name:'賦術', skill:'craftAlchemy',    mark:'≫△'},
    'Geo': {name:'相域', skill:'craftGeomancy',   mark:'≫'},
    'War': {name:'鼓咆', skill:'craftCommand',    mark:'≫'},
    'Mys': {name:'占瞳', skill:'craftDivination', mark:'▶'}
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getMagicLikeInfo = (json) => {
    const result = {
        max: 0,
        texts: []
    };
    const magicList = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.NOMAGIC_SUFFIX;
    for(var key in magicList) {
        if(json[`lv${key}`]) {
            const category = magicList[key];
            const power = Number(json[`magicPower${key}`] || '0');
            if( power > result.max) {
                result.max = power;
            }
            let i = 1;
            const skillList = [];
            while(json[`${category.skill}${i}`]) {
                skillList.push(`【${json[`${category.skill}${i}`]}】`);
                i++;
            }
            result.texts.push(`${category.mark}${category.name}${power ? `／${power}（${power + 7}）` : '' }&lt;br&gt;${skillList.join('')}の${category.name}を使用します。`);
        }
    }
    return result;
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
        status1Accuracy:   expectedWeapons.accTotal,
        status1AccuracyFix:expectedWeapons.accTotal + 7,
        status1Damage:     `2d6+${expectedWeapons.expected - 7}`,
        status1Style:      expectedWeapons.name
    };
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getLanguage = (json) => {
    const languageCount = Number(json.languageNum);
    const list = [];
    for(var i = 0; i < languageCount; i++) {
        if(json[`language${i + 1}Talk`]) { list.push(json[`language${i + 1}`]) }
    }
    return list.join('、');
};
