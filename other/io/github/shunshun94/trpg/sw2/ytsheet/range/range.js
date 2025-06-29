var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.ytsheet = io.github.shunshun94.trpg.sw2.ytsheet || {};
io.github.shunshun94.trpg.sw2.ytsheet.range = io.github.shunshun94.trpg.sw2.ytsheet.range || {};

io.github.shunshun94.trpg.sw2.ytsheet.range.calculate = (json) => {
    return (
        Number(json.level) +
        io.github.shunshun94.trpg.sw2.ytsheet.range.calculateFromExperience(json) +
        io.github.shunshun94.trpg.sw2.ytsheet.range.calculateFromMoney(json) +
        io.github.shunshun94.trpg.sw2.ytsheet.range.calculateFromGrow(json)
    ) / 4;
};

io.github.shunshun94.trpg.sw2.ytsheet.range.calculateFromExperience = (json) => {
    const experience = json.expTotal - json.expRest;
    return io.github.shunshun94.trpg.sw2.ytsheet.range.calculateQuadraticFormula(
        604,
        -122,
        68.5 - experience
    );
};

io.github.shunshun94.trpg.sw2.ytsheet.range.calculateFromMoney = (json) => {
    const money = json.historyMoneyTotal - json.moneyTotal - Number(json.depositTotal || 0) + Number(json.debtTotal || 0);
    return io.github.shunshun94.trpg.sw2.ytsheet.range.calculateQuadraticFormula(
        2758,
        -14101,
        20483 - money
    );
};

io.github.shunshun94.trpg.sw2.ytsheet.range.calculateFromGrow = (json) => {
    const grow = json.historyGrowTotal;
    return io.github.shunshun94.trpg.sw2.ytsheet.range.calculateQuadraticFormula(
        0.262,
        1.12,
        -3.45 - grow
    );
};

io.github.shunshun94.trpg.sw2.ytsheet.range.calculateQuadraticFormula = (a, b, c) => {
    const discriminant = Math.max(b * b - 4 * a * c, 0);
    const sqrtDiscriminant = Math.sqrt(discriminant);
    return (-b + sqrtDiscriminant) / (2 * a);
};
