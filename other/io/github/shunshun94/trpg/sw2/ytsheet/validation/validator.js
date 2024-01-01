var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.ytsheet = io.github.shunshun94.trpg.sw2.ytsheet || {};
io.github.shunshun94.trpg.sw2.ytsheet.validation = io.github.shunshun94.trpg.sw2.ytsheet.validation || {};

io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatch = (json, conditions) => {
    if( conditions === 'always' ) { return true; }
    const list = conditions.or || conditions;
    for(var key in list) {
        if( key === 'and') {
            let result = true;
            for(var keyInAnd in  list[key]) {
                const tmpMap = {};
                tmpMap[keyInAnd] = list[key][keyInAnd];
                result = result && io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatch(json, tmpMap);
            }
            if(result) { return true; }
        } else {
            const map = io.github.shunshun94.trpg.sw2.ytsheet.validation.getKeyValues(key, json);
            for(var key2 in map) {
                if(io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatchSingle(key2, map[key2], list[key], json)) {
                    return true;
                }
            }
        }
    }
    return false;
};

io.github.shunshun94.trpg.sw2.ytsheet.validation.isValid = io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatch;
io.github.shunshun94.trpg.sw2.ytsheet.validation.when = io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatch;

io.github.shunshun94.trpg.sw2.ytsheet.validation.CONSTS = io.github.shunshun94.trpg.sw2.ytsheet.validation.CONSTS || {};
io.github.shunshun94.trpg.sw2.ytsheet.validation.CONSTS.ADDTIONAL_SKILL_COUNT_MAP = {
    "NONE": 0,
    "Ⅰ": 1,
    "Ⅱ": 2,
    "Ⅲ": 3,
    "Ⅳ": 4,
    "Ⅴ": 5,
};

io.github.shunshun94.trpg.sw2.ytsheet.validation.appendSkillCountBattleSkill = (skillPrefix, json) => {
    if(! skillPrefix) {return 0;}
    const level = Number(json.level);
    for(var i = 0; i < level; i += 2) {
        if( json[`combatFeatsLv${ i + 1}`].startsWith(skillPrefix) ) {
            return io.github.shunshun94.trpg.sw2.ytsheet.validation.CONSTS.ADDTIONAL_SKILL_COUNT_MAP[(json[`combatFeatsLv${ i + 1}`].match(/ⅠⅡⅢⅣⅤ/) || ['NONE'])[0]];
        }
    }
    return 0;
};

io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatchSingle = (key, value, action, json) => {
    try {
        if(action.and) {
            return io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatch(json, action);
        }
        if(action.levelLimitaion) {
            const level = Number(json[action.levelLimitaion.level]) + io.github.shunshun94.trpg.sw2.ytsheet.validation.appendSkillCountBattleSkill(action.levelLimitaion.skillPrefix, json);
            const itemNumber = Number(key.match(/\d+/));
            if(itemNumber > level) {
                return false;
            }
        }
        if(action.ormore) { return Number(value) >= Number(action.ormore);  }
        if(action.morethan) { return Number(value) > Number(action.morethan); }
        if(action.orless) { return Number(value) <= Number(action.orless);  }
        if(action.lessthan) { return Number(value) < Number(action.lessthan); }
        if(action.isEnoughLevel && key.startsWith('lv')) {
            const advLevel = Number(json.level);
            const skiLevel = Number(value);
            return io.github.shunshun94.trpg.sw2.ytsheet.validation.isEnoughLevel(advLevel, skiLevel);
        }
        if(action.isFrontMember) {
            return io.github.shunshun94.trpg.sw2.ytsheet.validation.isFrontMember(json);
        }
        if(action.equal || action.equals) {
            if( action.equal && action.equals ) {
                console.warn('action includes equal and equals. In this case, Application use only equal', action);
            }
            if( (action.equal || action.equals).some ) {
                return (action.equal || action.equals).some((d)=>{ return value === d; });
            } else {
                return value === ((action.equal || action.equals));
            }
        }
        if(action.includes) { 
            if( action.includes.some ) {
                return action.includes.some((d)=>{ return value.includes(d); });
            } else {
                return value.includes(action.includes);
            }
        }
        if(action.count || action.counts) {
            console.log('count に in');
            const countTargetValues = io.github.shunshun94.trpg.sw2.ytsheet.validation.getKeyValues((action.count || action.counts).key, json);
            const countResult = Object.keys(countTargetValues).filter((internalKey)=>{
                return io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatchSingle(internalKey, countTargetValues[internalKey], (action.count || action.counts), json);
            }).length;
            console.log(countResult);
            return io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatchSingle('', countResult, (action.count || action.counts).required, json);
        }
        if(action.func) { return action.func(key, value, json); }
        if(key.startsWith('lv') && value === '0') { return false; }
        return Boolean(value);
    } catch (e) {
        console.error(e, key, value, action, json);
        throw e;
    }

};

io.github.shunshun94.trpg.sw2.ytsheet.validation.getKeyValues = (key, json) => {
    const result = {};
    if(json[key]) {
        result[key] = json[key];
        return result;
    }
    const re = new RegExp(key);
    
    for(var key in json) {
        if(re.test(key)) { result[key] = json[key]; }
    }
    return result;
};

io.github.shunshun94.trpg.sw2.ytsheet.validation.isEnoughLevel = (adventurerLevel, skillLevel) => {
    return ( skillLevel >= Math.max(Math.floor(Math.min(adventurerLevel * 0.8, adventurerLevel - 2)), 1) );
};


io.github.shunshun94.trpg.sw2.ytsheet.validation.isFrontMember = (json) => {
    return io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatch(json, {
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
        'lvDem': {
            and: {
                'lvDem': { isEnoughLevel: true },
                and: { 'lvDem': { ormore: 2 } }
            }
        }
    });
};

