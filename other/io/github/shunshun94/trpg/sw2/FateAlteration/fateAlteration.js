var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.FateAlteration = io.github.shunshun94.trpg.sw2.FateAlteration || {};

io.github.shunshun94.trpg.sw2.FateAlteration.calc = (input, boost = 0) => {
    try {
        const key = /KeyNo\.(\d+)/.exec(input)[1];
        const critical = /KeyNo\.\d+c\[(\d+)\]/.exec(input)[1];

        const sharpValue = /a\[\+?(-?\d+)\]/.test(input) ? Number(/a\[\+?(-?\d+)\]/.exec(input)[1]) : 0;
        const sharpValueString = sharpValue < 0 ? `-${sharpValue}` : `+${sharpValue}`;
        const inputDiceResult = Number(/\]=([\d,]+)/.exec(input)[1].split(',').at(-1));
        const actualDiceResult = inputDiceResult - sharpValue;
        const alternatedDiceResult = Math.min(12, (14 - actualDiceResult + boost));

        const isFumble = /自動的失敗$/.test(input);
        if(isFumble) {
            const alternatedDamageValue = Number(/\]([\-\+]?\d*)\s＞\s2D:\[/.exec(input)[1] || '0');
            return `k${key}[${critical}]+${alternatedDamageValue}$${alternatedDiceResult}#${sharpValueString}`;
        } else {
            const damageListString = /\]=[\d,]+\s＞\s([\d,*]+[\+\-]?\d*)\s＞/.exec(input)[1];
            const fixedValue = /[+-]\d+$/.test(damageListString) ? /[+-]\d+$/.exec(damageListString)[0] : '';
            const dicedDamageValue = damageListString.replace(fixedValue, '').split(',').slice(0, -1).reduce((acc, cur) => acc + Number(cur), 0);
            const alternatedDamageValue = dicedDamageValue + Number(fixedValue);
            return `k${key}[${critical}]+${alternatedDamageValue}$${alternatedDiceResult}#${sharpValueString}`;
        }
    } catch (e) {
        console.error(e, input, boost);
        return 'なんかうまく計算できませんでした。入力した値を開発者に共有してうまく動かない旨を教えてあげてください';
    }
};

io.github.shunshun94.trpg.sw2.FateAlteration.DEFAULT_OPTS = {
    prefix: '',
    suffix: '運命変転による再計算'
};

