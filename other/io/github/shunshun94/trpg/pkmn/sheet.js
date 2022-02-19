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
        const hit       = data[`pkmn-skill_${d}-hit`];
        const effect    = data[`pkmn-skill_${d}-effect`].trim();
        const reference = data[`pkmn-skill_${d}-reference`];

        if(reference === 'other') {
            return `${name}を使用 / 命中${hit}${effect ? ' /' + effect : ''}`
        }
        const type      = data[`pkmn-skill_${d}-type`];
        const rawPower  = Number(data[`pkmn-skill_${d}-power`]);
        const power     = types.includes(type) ? rawPower * 1.5 : rawPower;

        return [
            `${name}を使用 / 威力${Math.floor(power)} / 命中${hit} / タイプ${type}${effect ? ' /' + effect : ''}`,
            `2d6+{${reference}}+${Math.floor(power/10)} ${name}:ダメージ(等倍)（${reference === 'こうげき' ? 'ぼうぎょ' : 'とくぼう'}で軽減）`,
            `2d6+{${reference}}+${Math.floor(2*power/10)} ${name}:ダメージ(弱点)（${reference === 'こうげき' ? 'ぼうぎょ' : 'とくぼう'}で軽減）`,
            `2d6+{${reference}}+${Math.floor(4*power/10)} ${name}:ダメージ(4倍弱点)（${reference === 'こうげき' ? 'ぼうぎょ' : 'とくぼう'}で軽減）`,
            `2d6+{${reference}}+${Math.floor(0.5*power/10)} ${name}:ダメージ(半減)（${reference === 'こうげき' ? 'ぼうぎょ' : 'とくぼう'}で軽減）`
        ].join('\n')
    }).filter((d)=>{return d;}).join('\n');
};

io.github.shunshun94.trpg.pkmn.sheet.getCcfoliaStatus = (data) => {
    const result = [{
        label: 'HP',
        value: Number(data['pkmn-hp']),
        max: Number(data['pkmn-hp'])
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

io.github.shunshun94.trpg.pkmn.sheet.getText = (data) => {
    const result = [];
    result.push( data['pkmn-name'] ? `【${data['pkmn-name']}】（${data['pkmn-race']} ${data['pkmn-sex']}）` : `【${data['pkmn-race']}（${data['pkmn-sex']}）】`);
    [{
        label: 'HP', value: 'pkmn-hp'
    }, {
        label: 'たいりょく', value: 'pkmn-physical'
    }, {
        label: 'こうげき', value: 'pkmn-pattack'
    }, {
        label: 'ぼうぎょ', value: 'pkmn-pdefence'
    }, {
        label: 'とくこう', value: 'pkmn-sattack'
    }, {
        label: 'とくぼう', value: 'pkmn-sdefence'
    }, {
        label: 'すばやさ', value: 'pkmn-speed'
    }].forEach((d)=>{
        result.push(`${d.label}：${data[d.value]}`);
    });
    result.push('');
    result.push(`とくせい：${data['pkmn-charactaristic']}`);
    result.push('');
    [1,2,3,4].map((d)=>{
        const name = (data[`pkmn-skill_${d}-name`] || '').trim();
        if(name === '') {return false;}

        const hit    = data[`pkmn-skill_${d}-hit`];
        const effect = data[`pkmn-skill_${d}-effect`].trim();
        const reference = data[`pkmn-skill_${d}-reference`];
        const type   = data[`pkmn-skill_${d}-type`];
        const pp     = data[`pkmn-skill_${d}-pp`];

        if(reference === 'other') {
            return [
                `わざ${d}：${name}（${type}）`,
                `命中：${hit} PP：${pp}`,
                `${effect ? effect : ''}`
            ].filter((d)=>{return d;}).join('\n');
        } else {
            const power  = Math.floor(Number(data[`pkmn-skill_${d}-power`])/10);
            return [
                `わざ${d}：${name}（${type}）`,
                `威力：${power} 命中：${hit} PP：${pp}`,
                `${effect ? effect : ''}`
            ].filter((d)=>d).join('\n');
        }
    }).filter((d)=>d).forEach((d)=>{result.push(`${d}\n`);});
    return result.join('\n');
};