var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.study = io.github.shunshun94.study || {};
io.github.shunshun94.study.math = io.github.shunshun94.study.math || {};
io.github.shunshun94.study.math.questions = io.github.shunshun94.study.math.questions || {};

io.github.shunshun94.study.math.questions.consts = {
    NUMBER_OF_DIGITS: 2,
    OPERATORS: [
        { OPERATOR: '＋', NAME: 'PLUS'},
        { OPERATOR: '－', NAME: 'MINUS'},
        { OPERATOR: '×', NAME: 'MULTIPLICATION'},
        { OPERATOR: '÷', NAME: 'DIVISION'},
    ]
};

io.github.shunshun94.study.math.questions.generateTwoNumbers = (nod = io.github.shunshun94.study.math.questions.consts.NUMBER_OF_DIGITS) => {
    return [
        Math.floor(Math.random() * Math.pow(10, nod)) + 1,
        Math.floor(Math.random() * Math.pow(10, nod)) + 1
    ].sort((a, b)=>{return b - a;});
};

io.github.shunshun94.study.math.questions.generateAnswer = (nums, operatorName) => {
    if(operatorName === 'PLUS'          ) { return nums[0] + nums[1]; }
    if(operatorName === 'MINUS'         ) { return nums[0] - nums[1]; }
    if(operatorName === 'MULTIPLICATION') { return nums[0] * nums[1]; }
    if(operatorName === 'DIVISION'      ) { return `${Math.floor(nums[0] / nums[1])} あまり ${nums[0] % nums[1]}`; }
    throw `UNKNOWN OPERATOR "${operatorName}"`;
};

io.github.shunshun94.study.math.questions.generate = () => {
    const nums = io.github.shunshun94.study.math.questions.generateTwoNumbers();
    const operator = io.github.shunshun94.study.math.questions.consts.OPERATORS[(Math.floor(Math.random() * 4))];
    return {
        text:   `${nums[0]}${operator.OPERATOR}${nums[1]}`,
        answer: io.github.shunshun94.study.math.questions.generateAnswer(nums, operator.NAME)
    }
};