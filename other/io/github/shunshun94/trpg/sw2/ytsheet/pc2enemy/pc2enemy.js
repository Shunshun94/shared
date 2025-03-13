var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.ytsheet = io.github.shunshun94.trpg.sw2.ytsheet || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.exec = (json) => {
    let result = {
        author: json.playerName,
        initiative: Number(json.initiative) + 7 + io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.baseAppendCalcInitiative(json),
        intellect: (Number(json.sttInt) > 29) ? '高い' : '人間並み',
        language: io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getLanguage(json),
        lv: json.level,
        mndResist: json.mndResistTotal,
        mndResistFix: Number(json.mndResistTotal) + 7,
        mobility: json.mobilityTotal,
        monsterName: json.characterName,
        perception: (json.raceAbility.includes('［暗視］')) ? '五感（暗視）' : '五感',
        reputation: Number(json.level) + 3,
        sin: json.sin || 0,
        status1Defense:json.defenseTotal1Def,
        status1Evasion:Number(json.defenseTotal1Eva),
        status1EvasionFix:Number(json.defenseTotal1Eva) + 7,
        status1Hp:Number(json.hpTotal),
        status1Mp:Number(json.mpTotal),
        statusNum:1,
        taxa: '人族',
        type: 'm',
        vitResist: json.vitResistTotal,
        vitResistFix: Number(json.vitResistTotal) + 7
    };
    const weapon = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getAttackWay(json);
    for(var key in weapon) {
        if(key.startsWith('status1')) { result[key] = weapon[key]; }
    }

    const skills = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.generateSkills(json);
    result.skills = skills.text;
    result = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.mergeMap(result, weapon.modifyStatus);
    return io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.mergeMap(result, skills.modifyStatus);
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.baseAppendCalcInitiative = (json) => {
    let bonus = 0;
    if(json.combatFeatsAuto && json.combatFeatsAuto.includes('匠の技')) {
        //2回振る場合、期待値は +1 される
        bonus += 1;
    }
    return bonus;
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.calcForumula = (text, token) => {
    const parseResult = /(\d+)([\+\-])/.exec(text);
    if(parseResult) {
        if(token === '-') {
            return io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.calcForumula(text.replace(parseResult[0], ''), parseResult[2]) - Number(parseResult[1]);
        } else {
            return io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.calcForumula(text.replace(parseResult[0], ''), parseResult[2]) + Number(parseResult[1]);
        }
    } else {
        if(token === '-') {
            return Number(text) * -1;
        } else {
            return Number(text);
        }
    }
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
            rate:     io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.calcForumula(json[`weapon${id}Rate`]),
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
    const weapons = list.map((w)=>{
        w.expected = (w.rate && w.dmgTotal) ? io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.calcExpectedDamage(w) : 0;
        const func = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.ARROW_CATEGORY_WEAPON[w.category];
        return io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.mergeMapSimplyOverride(
            w, func ? func(w) : {});
    });
    return weapons;
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.calcExpectedDamage = (w) => {
    return w.dmgTotal + Math.round(((w.rate + 10) / 6) * (io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.CRITICAL_COEFFCIENTS[w.crit] || 1));
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.mergeMap = (base, append) => {
    for(var key in append) {
        if (append[key].startsWith && append[key].startsWith('=')) {
            base[key] = append[key].slice(1);
        } else if(base[key])  {
            base[key] += append[key];
        } else {
            base[key] = append[key];
        }
    }
    return base;
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.mergeMapSimplyOverride = (base, append) => {
    for(var key in append) {
        if (base[key])  {
            base[key] += append[key];
        } else {
            base[key] = append[key];
        }
    }
    return base;
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.generateSkills = (json) => {
    let resultText = [];
    let resultModifyStatus = {};

    [
        'getAbilityInfo',
        'getMagicInfo',
        'getMagicLikeInfo',
        'getBattleSkillsInfo',
        'getMysticArtsInfo'
    ].forEach((functionName)=>{
        const result = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY[functionName](json);
        resultText = resultText.concat(result.texts);
        resultModifyStatus = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.mergeMapSimplyOverride(resultModifyStatus, result.modifyStatus);
    });

    return {
        text: resultText.join('&lt;br&gt;&lt;br&gt;').trim(),
        modifyStatus: resultModifyStatus
    };
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getAbilityInfo = (json) => {
    const list = json.raceAbility.substr(1, json.raceAbility.length - 2).split('］［');
    const map = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.RACE_ABILITY.LIST;
    let modifyStatus = {};
    const textsArray = list.map((ability)=>{
        const target = map[ability];
        if( target ) {
            if(target.modifyStatus) {
                modifyStatus = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.mergeMapSimplyOverride(modifyStatus, target.modifyStatus(json));
            }
            if(target.replaceFunction) {
                return target.replaceFunction(json);
            }
            if(target.replace) {
                return target.replace;
            }
            if(target.skip) {return '';}
        }
        return '○' + ability;
    }).filter((d)=>{return d});
    return {
        texts: textsArray,
        modifyStatus: modifyStatus
    };
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getBattleSkillList = (json) => {
    const list = [];
    if(json.lvGra) {
        list.push('投げ攻撃');
    }
    if(json.combatFeatsLv1bat && json.lvBat) {
        list.push(json.combatFeatsLv1bat);
    }
    const level = Math.max(Number(json.level));
    for(var i = 0; i < level; i++) {
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
        const target = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.BATTLE_SKILLS.FILTER[key] ? io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.BATTLE_SKILLS.FILTER[key](skillMap[key], json) : skillMap[key];
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
            const level = category.calcLevel ? category.calcLevel(json) : json[`lv${key}`];
            if( power > result.max) {
                result.max = power;
            }
            if(category.secondLine) {
                result.texts.push(`▶${category.name}${level}レベル／魔力${power}（${power + 7}）&lt;br&gt;${category.secondLine(json)}`);
            }else if(category.skill) {
                let i = 1;
                const skillList = [];
                while(json[`${category.skill}${i}`]) {
                    skillList.push(`【${json[`${category.skill}${i}`]}】`);
                    i++;
                }
                result.texts.push(`▶${category.name}${level}レベル／魔力${power}（${power + 7}）&lt;br&gt;${skillList.join('')}の${category.name}を使用します。`);
            } else {
                result.texts.push(`▶${category.name}${level}レベル／魔力${power}（${power + 7}）`);
            }
        }
    }
    return result;
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.ADDTIONAL_SKILL_COUNT_MAP = {
    "Ⅰ": 1,
    "Ⅱ": 2,
    "Ⅲ": 3,
    "Ⅳ": 4,
    "Ⅴ": 5,
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.countHowManyAdditionalskills = (json, skillName) => {
    const levelCap  = Number(json.level) + 1;
    const regexp    = new RegExp(skillName + '.*追加([ⅠⅡⅢⅣⅤ])');
    for(var i = 1; i < levelCap; i++) {
        if(json[`combatFeatsLv${i}`]) {
            const execResult = regexp.exec(json[`combatFeatsLv${i}`]);
            if(execResult) {
                return io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.ADDTIONAL_SKILL_COUNT_MAP[execResult[1]];
            }
        }
    }
    return 0;
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getMysticArtsInfo = (json) => {
    const count = Number(json.mysticArtsNum || '0');
    const result = { texts: [] }
    for(var i = 1; i <= count; i++) {
        result.texts.push( '🗨' + json[`mysticArts${i}`] );
    }
    return result;
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
            const skillCount = Number(json[`lv${key}`]) + io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.countHowManyAdditionalskills(json, category.name);
            const power = Number(json[`magicPower${key}`] || '0');
            if( power > result.max) {
                result.max = power;
            }
            let i = 1;
            const skillList = [];
            while(json[`${category.skill}${i}`] && i <= skillCount ) {
                skillList.push(`【${json[`${category.skill}${i}`]}】`);
                i++;
            }
            result.texts.push(`${category.mark}${category.name}${power ? `／${power}（${power + 7}）` : '' }&lt;br&gt;${skillList.join('')}の${category.name}を使用します。`);
        }
    }
    return result;
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getAttackWay = (json) => {
    const weapons = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getWeaponList(json);
    let modifyStatus = {};
    weapons.push(io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.DEFAULT_WEAPON);
    weapons.forEach((w)=>{
        if(w.notMain && w.modifyStatus) {
            modifyStatus = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.mergeMapSimplyOverride(modifyStatus, w.modifyStatus);
        }
    });
    const expectedWeapons = weapons.sort((a,b)=>{return b.expected - a.expected;})[0];
    return {
        status1Accuracy:   expectedWeapons.accTotal,
        status1AccuracyFix:expectedWeapons.accTotal + 7,
        status1Damage:     `2d+${expectedWeapons.expected - 7}`,
        status1Style:      expectedWeapons.name,
        modifyStatus:      io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.mergeMapSimplyOverride(modifyStatus, expectedWeapons.modifyStatus || {})
    };
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getLanguage = (json) => {
    const languageCount = Number(json.languageNum);
    const list = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.RACE_LANGUAGE.LIST[json.race] ? io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.CONSTS.RACE_LANGUAGE.LIST[json.race].language : [];
    for(var i = 0; i < languageCount; i++) {
        if(json[`language${i + 1}Talk`]) { list.push(json[`language${i + 1}`]) }
    }
    return list.join('、');
};
