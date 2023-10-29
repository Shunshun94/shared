var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.ytsheet = io.github.shunshun94.trpg.sw2.ytsheet || {};
io.github.shunshun94.trpg.sw2.ytsheet.validation = io.github.shunshun94.trpg.sw2.ytsheet.validation || {};

io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatch = (json, conditions) => {
    if( conditions.and ) {
        let result = true;
        for(var key in conditions.and) {
            result = result && io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatch(json, {key: conditions[key]});
        }
    } else {
        const list = conditions.or || conditions;
        for(var key in list) {
            if( json[key] ) {
                const map = io.github.shunshun94.trpg.sw2.ytsheet.validation.getKeyValues(key, json);
                for(var key2 in map) {
                    return io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatchSingle(key2, map[key2], list[key], json);
                }
            }
        }
    }
    return false;
};

io.github.shunshun94.trpg.sw2.ytsheet.validation.when = io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatch;

io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatchSingle = (key, value, action, json) => {
    if(action.ormore) { return Number(value) >= Number(action.oremove);  }
    if(action.morethan) { return Number(value) > Number(action.oremove); }
    if(action.orless) { return Number(value) <= Number(action.oremove);  }
    if(action.lessthan) { return Number(value) < Number(action.oremove); }
    if(action.includes) { return action.includes.some((d)=>{ value.includes(d); }); }
    if(action.func) { return action.func(key, value, json); }
    return true;
};

io.github.shunshun94.trpg.sw2.ytsheet.validation.getKeyValues = (key, json) => {
    if(json[key]) {
        return { key: json[key] };
    }
    const re = new RegExp(key);
    const result = {};
    for(var key in json) {
        if(re.test(key)) { result[key] = json[key]; }
    }
    return result;
};
