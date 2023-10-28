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
                console.log(key, json[key]);
                return true;
            }
        }
    }
    return false;
};

io.github.shunshun94.trpg.sw2.ytsheet.validation.when = io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatch;

io.github.shunshun94.trpg.sw2.ytsheet.validation.getKeyValues = (json, key) => {
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
