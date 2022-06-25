var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.dx3 = io.github.shunshun94.trpg.dx3 || {};
io.github.shunshun94.trpg.dx3.FairyHands = io.github.shunshun94.trpg.dx3.FairyHands || {};

io.github.shunshun94.trpg.dx3.FairyHands.DEFAULT_OPTS = {
    prefix: '',
    suffix: '妖精の手による再計算'
};

io.github.shunshun94.trpg.dx3.FairyHands.REGEXPS = {
    CRITICAL_VALUE: /\(\d+DX(\d+)[\+\-]?\d*\)/,
    CURRENT_RESULT: /＞ (\d+)$/,
    TMP_FUMBLE: /1\[[1,]+\]\+?(\d*) ＞ 0 \(ファンブル\)$/,
    LAST_DICE_RESULT: /(\d+)\[[\d,]+\]\+?\d* ＞ \d+$/
};

io.github.shunshun94.trpg.dx3.FairyHands.fumbleToCommonResult = (input) => {
    if(! input.endsWith('＞ 0 (ファンブル)')) {
        return input;
    }
    const fixValue = io.github.shunshun94.trpg.dx3.FairyHands.REGEXPS.TMP_FUMBLE.exec(input)[1];
    const tmpResult = Number(fixValue) + 1;
    return input.replaceAll('0 (ファンブル)', tmpResult);
};

io.github.shunshun94.trpg.dx3.FairyHands.getLastDice = (input) => {
    return Number(io.github.shunshun94.trpg.dx3.FairyHands.REGEXPS.LAST_DICE_RESULT.exec(input)[1]);
};

io.github.shunshun94.trpg.dx3.FairyHands.calc = (inputString, opts=io.github.shunshun94.trpg.dx3.FairyHands.DEFAULT_OPTS) => {
    try {
        const input = io.github.shunshun94.trpg.dx3.FairyHands.fumbleToCommonResult(inputString.trim());
        const critical = io.github.shunshun94.trpg.dx3.FairyHands.REGEXPS.CRITICAL_VALUE.exec(input)[1];
        const currentResult = io.github.shunshun94.trpg.dx3.FairyHands.REGEXPS.CURRENT_RESULT.exec(input)[1];
        const lastDice = io.github.shunshun94.trpg.dx3.FairyHands.getLastDice(input);
        const newFixedValue = Number(currentResult) + (10 - lastDice);
        if(Number(critical) > 10) {
            return String(newFixedValue);
        } else {
            return `${opts.prefix || ''} 1dx+${newFixedValue}@${critical} ${opts.suffix || ''}`.trim();
        }
    } catch (e) {
        console.error(e, inputString.trim(), opts);
        console.log(`{
            input: '${inputString.trim()}',
            expected: ''
        }`)
        return 'なんかうまく計算できませんでした。入力した値を開発者に共有してうまく動かない旨を教えてあげてください';
    }
};

