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
        a: 604,
        b: -122,
        c: 68.5
    },
    money: {
        a: 2758,
        b: -14101,
        c: 20483
    },
    grow: {
        a: 0.262,
        b: 1.12,
        c: -3.45
    }
}

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
    return io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateQuadraticFormula(
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.experience.a,
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.experience.b,
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.experience.c - experience
    );
};

io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateFromMoney = (json) => {
    const money = json.historyMoneyTotal - json.moneyTotal - Number(json.depositTotal || 0) + Number(json.debtTotal || 0);
    return io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateQuadraticFormula(
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.money.a,
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.money.b,
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.money.c - money
    );
};

io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateFromGrow = (json) => {
    const grow = json.historyGrowTotal;
    return io.github.shunshun94.trpg.sw2.ytsheet.range.v1.calculateQuadraticFormula(
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.grow.a,
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.grow.b,
        io.github.shunshun94.trpg.sw2.ytsheet.range.v1.CONSTS.grow.c - grow
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
