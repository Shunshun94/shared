var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.FateAlteration = io.github.shunshun94.trpg.sw2.FateAlteration || {};

io.github.shunshun94.trpg.sw2.FateAlteration.calcAlternatedDamageValue = (damageListString) => {
    const fixedValue = /[+-]\d+$/.test(damageListString) ? /[+-]\d+$/.exec(damageListString)[0] : '';
    const dicedDamageValue = damageListString.replace(fixedValue, '').split(',').slice(0, -1).reduce((acc, cur) => acc + Number(cur), 0);
    return dicedDamageValue + Number(fixedValue);
};

/**
 * ソード・ワールド2.Xのダメージ計算時の運命変転の結果を計算する関数
 * @param {string} input 変転前のダメージ計算結果のログ
 * @param {number} boost 変転後の結果への加算量。主に種族特徴強化による修正値を入力する
 * @returns {string} 変転後のダメージ計算用のコマンド
 */
io.github.shunshun94.trpg.sw2.FateAlteration.calc = (input, boost = 0) => {
    try {
        const executioner = /r\[(\d+)\]/.exec(input)?.[1] || '0';
        const criticalCount = /(\d+)回転/.exec(input)?.[1] || '0';

        const key = Number(/KeyNo\.(\d+)/.exec(input)[1]) + (Number(executioner) * Number(criticalCount));
        const critical = /KeyNo\.\d+c\[(\d+)\]/.exec(input)?.[1] || '13';

        const sharpValue = /a\[\+?(-?\d+)\]/.test(input) ? Number(/a\[\+?(-?\d+)\]/.exec(input)[1]) : 0;
        const sharpValueString = sharpValue < 0 ? `-${sharpValue}` : `+${sharpValue}`;
        const inputDiceResult = Number(/\]=([\d,]+)/.exec(input)[1].split(',').at(-1));
        const actualDiceResult = inputDiceResult - sharpValue;
        const alternatedDiceResult = Math.min(12, (14 - actualDiceResult + boost));

        const greatestFortune = /gf/.test(input) ? 'gf' : '';

        const isFumble = /自動的失敗$/.test(input);
        const isHalfDamage = /\/2/.test(input);
        if(isFumble) {
            const alternatedDamageValue = Number(/\]([\-\+]?\d*)\s＞\s2D:\[/.exec(input)[1] || '0');
            return `k${key}[${critical}]+${alternatedDamageValue}$${alternatedDiceResult}#${sharpValueString}r${executioner}${greatestFortune}`;
        } else if(isHalfDamage) {
            const damageListString = /\]=[\d,]+\s＞\s(\([\d,*]+[\+\-]?\d*\)\/2[\+\-]?\d*)\s?＞?/.exec(input)[1];
            const notHalfedFixedValue = /[+-]\d+$/.test(damageListString) ? /[+-]\d+$/.exec(damageListString)[0] : '';
            const halfedDamageValuesString = /\(([\d,]+[\+\-]?\d*)\)\/2/.exec(damageListString)[1];
            const alternatedDamageValue = (Math.ceil(io.github.shunshun94.trpg.sw2.FateAlteration.calcAlternatedDamageValue(halfedDamageValuesString) / 2)) + Number(notHalfedFixedValue);
            return `k${key}[${critical}]+${alternatedDamageValue}$${alternatedDiceResult}#${sharpValueString}r${executioner}${greatestFortune}`;
        } else {
            const damageListString = /\]=[\d,]+\s＞\s([\d,*]+[\+\-]?\d*)\s?＞?/.exec(input)[1];
            const alternatedDamageValue = io.github.shunshun94.trpg.sw2.FateAlteration.calcAlternatedDamageValue(damageListString);
            return `k${key}[${critical}]+${alternatedDamageValue}$${alternatedDiceResult}#${sharpValueString}r${executioner}${greatestFortune}`;
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

