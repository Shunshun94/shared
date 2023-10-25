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
            if( io.github.shunshun94.trpg.sw2.ytsheet.validation.isMatch(json, {key: list[key]}) ) {
                return true;
            }
        }
    }
};