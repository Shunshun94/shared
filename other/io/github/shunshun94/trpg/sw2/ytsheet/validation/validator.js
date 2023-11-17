var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.ytsheet = io.github.shunshun94.trpg.sw2.ytsheet || {};
io.github.shunshun94.trpg.sw2.ytsheet.validation = io.github.shunshun94.trpg.sw2.ytsheet.validation || {};

io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatch = (json, conditions) => {
    console.log(conditions);
    if( conditions.and ) {
        let result = true;
        for(var key in conditions.and) {
            console.log(result, key);
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

io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatchSingle = (key, value, action, json) => {
    try {
        if(action.ormore) { return Number(value) >= Number(action.ormore);  }
        if(action.morethan) { return Number(value) > Number(action.morethan); }
        if(action.orless) { return Number(value) <= Number(action.orless);  }
        if(action.lessthan) { return Number(value) < Number(action.lessthan); }
        if(action.equal) { 
            if( action.equal.some ) {
                return action.equal.some((d)=>{ return value === d; });
            } else {
                return value === (action.equal);
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
