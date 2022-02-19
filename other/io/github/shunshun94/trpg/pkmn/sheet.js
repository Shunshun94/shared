var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.pkmn = io.github.shunshun94.trpg.pkmn || {};
io.github.shunshun94.trpg.pkmn.sheet = io.github.shunshun94.trpg.pkmn.sheet || {};

io.github.shunshun94.trpg.pkmn.sheet.generateChatPallete = (data) => {
    const types = [data['pkmn-type1'].trim(), data['pkmn-type2'].trim()].filter((d)=>{return d;});
    return ['こうげき', 'ぼうぎょ', 'とくこう', 'とくぼう', 'すばやさ'].map((d)=>{
        return `2d6+{${d}} ${d}`
    }).join('\n') +
    `\n{すばやさ}+1d100 回避\n` +
    [1,2,3,4].map((d)=>{
        const name = (data[`pkmn-skill_${d}-name`] || '').trim();
        if(name === '') {return false;}
        const rawPower  = Number(data[`pkmn-skill_${d}-power`]);
        const hit       = data[`pkmn-skill_${d}-hit`];
        const type      = data[`pkmn-skill_${d}-type`];
        const power     = types.includes(type) ? rawPower * 1.5 : rawPower;
        const effect    = data[`pkmn-skill_${d}-effect`].trim();
        const reference = data[`pkmn-skill_${d}-reference`];

        if(reference === 'other') {
            return `${name}を使用 / 命中${hit}${effect ? ' /' + effect : ''}`
        }

        return [
            `${name}を使用 / 威力${Math.floor(power)} / 命中${hit} / タイプ${type}${effect ? ' /' + effect : ''}`,
            `2d6+{${reference}}+${Math.floor(power/10)} ${name}:ダメージ(等倍)（${reference === 'こうげき' ? 'ぼうぎょ' : 'とくぼう'}で軽減）`,
            `2d6+{${reference}}+${Math.floor(2*power/10)} ${name}:ダメージ(弱点)（${reference === 'こうげき' ? 'ぼうぎょ' : 'とくぼう'}で軽減）`,
            `2d6+{${reference}}+${Math.floor(4*power/10)} ${name}:ダメージ(4倍弱点)（${reference === 'こうげき' ? 'ぼうぎょ' : 'とくぼう'}で軽減）`,
            `2d6+{${reference}}+${Math.floor(0.5*power/10)} ${name}:ダメージ(半減)（${reference === 'こうげき' ? 'ぼうぎょ' : 'とくぼう'}で軽減）`
        ].join('\n')
    }).filter((d)=>{return d;}).join('\n');
};

io.github.shunshun94.trpg.pkmn.sheet.getStatus = (data) => {
    const result = [{
        label: 'HP',
        value: Number(data['pkmn-hp'] || Math.floor((Number(data['pkmn-physical']) * 10 + 75)/ 2)),
        max: Number(data['pkmn-hp'] || Math.floor((Number(data['pkmn-physical']) * 10 + 75)/ 2))
    }];
    [1,2,3,4].map((d)=>{
        const name = (data[`pkmn-skill_${d}-name`] || '').trim();
        if(name === '') {return false}
        return {
            label: `PP_${name}`,
            value: Number(data[`pkmn-skill_${d}-pp`]),
            max: Number(data[`pkmn-skill_${d}-pp`])
        };
    }).filter((d)=>{return d;}).forEach((d)=>{result.push(d);});
    return result;
};