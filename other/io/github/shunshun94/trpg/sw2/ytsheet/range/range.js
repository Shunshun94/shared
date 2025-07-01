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
        sentinel: 50000,
        low:  { a: 604,    b: -122,    c: 68.5    },
        high: { a: 893,    b: 2702,    c: -50310  }
    },
    money: {
        sentinel: 120000,
        low:  { a: 2758,   b: -14101,  c: 20483   },
        high: { a: 3539,   b: 1487,    c: -192675 }
    },
    grow: {
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

io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateFromExperience = (json) => {
    const experience = json.expTotal - json.expRest;
    const highLowValue = experience < io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.experience.sentinel ? 'low' : 'high';
    
    return io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateQuadraticFormula(
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.experience[highLowValue].a,
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.experience[highLowValue].b,
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.experience[highLowValue].c - experience
    );
};

io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateFromMoney = (json) => {
    const money = json.historyMoneyTotal - json.moneyTotal - Number(json.depositTotal || 0) + Number(json.debtTotal || 0);
    const highLowValue = money < io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.money.sentinel ? 'low' : 'high';
    return io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateQuadraticFormula(
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.money[highLowValue].a,
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.money[highLowValue].b,
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.money[highLowValue].c - money
    );
};

io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateFromGrow = (json) => {
    const grow = json.historyGrowTotal;
    const highLowValue = grow < io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.grow.sentinel ? 'low' : 'high';
    return io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateQuadraticFormula(
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.grow[highLowValue].a,
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.grow[highLowValue].b,
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.grow[highLowValue].c - grow
    );
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
