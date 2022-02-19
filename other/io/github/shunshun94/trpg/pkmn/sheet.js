var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.pkmn = io.github.shunshun94.trpg.pkmn || {};
io.github.shunshun94.trpg.pkmn.sheet = io.github.shunshun94.trpg.pkmn.sheet || {};

io.github.shunshun94.trpg.pkmn.sheet.generateChatPallete = (data) => {
    return ['こうげき', 'ぼうぎょ', 'とくこう', 'とくぼう', 'すばやさ'].map((d)=>{
        return `2d6+{${d}} ${d}`
    }).join('\n') + '\n' + [1,2,3,4].map((d)=>{
        const name = (data[`pkmn-skill_${d}-name`] || '').trim();
        if(name === '') {return false;}
        const power     = data[`pkmn-skill_${d}-power`];
        const hit       = data[`pkmn-skill_${d}-hit`];
        const type      = data[`pkmn-skill_${d}-type`];
        const effect    = data[`pkmn-skill_${d}-effect`].trim();
        const reference = data[`pkmn-skill_${d}-reference`];

        if(reference === 'other') {
            return `${name}を使用 / 威力${power} / 命中${hit}${effect ? ' /' + effect : ''}`
        }

        return [
            `${name}を使用 / 威力${power} / 命中${hit} / タイプ${type}${effect ? ' /' + effect : ''}`,
            `2d6+{${reference}}+${Math.floor(Number(power)/10)} ${name}:ダメージ（${reference === 'こうげき' ? 'ぼうぎょ' : 'とくぼう'}で軽減）`
        ].join('\n')
    }).filter((d)=>{return d;}).join('\n');
};

io.github.shunshun94.trpg.pkmn.sheet.getStatus = (data) => {
    const result = [{
        label: 'HP',
        value: Number(data['pkmn-hp'] || Math.floor((data['pkmn-physical'] + 75)/ 2)),
        max: Number(data['pkmn-hp'] || Math.floor((data['pkmn-physical'] + 75)/ 2))
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