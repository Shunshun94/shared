var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.ytsheet = io.github.shunshun94.trpg.sw2.ytsheet || {};
io.github.shunshun94.trpg.sw2.ytsheet.range = io.github.shunshun94.trpg.sw2.ytsheet.range || {};
io.github.shunshun94.trpg.sw2.ytsheet.range.v1 = io.github.shunshun94.trpg.sw2.ytsheet.range.v1 || {};

io.github.shunshun94.trpg.sw2.ytsheet.range.LATEST = 'v1';

io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS = {
    experience: {
        calculateCurrentValue: (json) => { return json.expTotal - json.expRest; },
        sentinel: 50000,
        low:  { a: 604,    b: -122,    c: 68.5    },
        high: { a: 893,    b: 2702,    c: -50310  }
    },
    money: {
        calculateCurrentValue: (json) => { return json.historyMoneyTotal - json.moneyTotal - Number(json.depositTotal || 0) + Number(json.debtTotal || 0); },
        sentinel: 120000,
        low:  { a: 2758,   b: -14101,  c: 20483   },
        high: { a: 3539,   b: 1487,    c: -192675 }
    },
    grow: {
        calculateCurrentValue: (json) => { return json.historyGrowTotal; },
        sentinel: 28,
        low:  { a: 0.262,  b: 1.12,    c: -3.45   },
        high: { a: 0.22,   b: 4.97,    c: -36.3   }
    }
};

io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculate = (json) => {
    return (
        Number(json.level) +
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateFromExperience(json) +
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateFromMoney(json) +
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateFromGrow(json)
    ) / 4;
};

io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateFromStatus = (json, statusName) => {
    const manipulater = io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS[statusName];
    const currentValue = manipulater.calculateCurrentValue(json);
    const highLowValue = currentValue < manipulater.sentinel ? 'low' : 'high';
    return io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateQuadraticFormula(
        manipulater[highLowValue].a,
        manipulater[highLowValue].b,
        manipulater[highLowValue].c - currentValue
    );
};

io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateFromExperience = (json) => {
    return io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateFromStatus(json, 'experience');
};

io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateFromMoney = (json) => {
    return io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateFromStatus(json, 'money');
};

io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateFromGrow = (json) => {
    return io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateFromStatus(json, 'grow');
};

io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateQuadraticFormula = (a, b, c) => {
    const discriminant = Math.max(b * b - 4 * a * c, 0);
    const sqrtDiscriminant = Math.sqrt(discriminant);
    return (-b + sqrtDiscriminant) / (2 * a);
};

for(var key in io.github.shunshun94.trpg.sw2.ytsheet.range[io.github.shunshun94.trpg.sw2.ytsheet.range.LATEST]) {
    if (io.github.shunshun94.trpg.sw2.ytsheet.range[io.github.shunshun94.trpg.sw2.ytsheet.range.LATEST].hasOwnProperty(key)) {
        io.github.shunshun94.trpg.sw2.ytsheet.range[key] = io.github.shunshun94.trpg.sw2.ytsheet.range[io.github.shunshun94.trpg.sw2.ytsheet.range.LATEST][key];
    }
}
