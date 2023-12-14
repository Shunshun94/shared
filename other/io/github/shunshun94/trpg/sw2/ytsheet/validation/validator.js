var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.ytsheet = io.github.shunshun94.trpg.sw2.ytsheet || {};
io.github.shunshun94.trpg.sw2.ytsheet.validation = io.github.shunshun94.trpg.sw2.ytsheet.validation || {};

io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatch = (json, conditions) => {
    if( conditions === 'always' ) { return true; }
    if( conditions.and ) {
        let result = true;
        for(var key in conditions.and) {
            const tmpMap = {};
            tmpMap[key] = conditions.and[key];
            result = result && io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatch(json, tmpMap);
        }
        return result;
    } else {
        const list = conditions.or || conditions;
        for(var key in list) {
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
        if(action.func) { return action.func(key, value, json); }
        if(key.startsWith('lv') && value === '0') { return false; }
        return true;
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
