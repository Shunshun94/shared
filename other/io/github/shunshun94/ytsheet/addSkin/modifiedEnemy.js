var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.ytsheet = io.github.shunshun94.ytsheet || {};
io.github.shunshun94.ytsheet.addSkin = io.github.shunshun94.ytsheet.addSkin || {};

io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy = io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy || {};

io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.addParamByColumn = (json, column, val) => {
    const current = Number(json[column]);
    if( current === 0 || current ) {
        return current + val;
    } else {
        return json[column];
    }
};

io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.addDamageValue = (current, val) => {
    const re = /2d6?([\+\-]?\d*)/;
    if( ! re.test(current) ) { return current; }
    const parsed = re.exec(current);
    const currentSuffix = parsed[1] ? Number(parsed[1]) : 0;
    const newValue = currentSuffix + val;
    if( newValue === 0 ) {
        return `2d`;
    } else if( newValue < 0 ) {
        return `2d${newValue}`;   
    } else {
        return `2d+${newValue}`;
    }
};

io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.addSkills = (json, skills, filter) => {
    const currentSkills = json.skills.trim().split('&lt;br&gt;').filter(filter);
    if( json.partsNum === '1' )  {
        return skills.join('\n\n') + '\n\n' + currentSkills.join('\n');
    }
    const fullBodyIndex = currentSkills.findIndex(line => line.includes('●全身'));
    if( fullBodyIndex === -1 ) {
        return '●全身\n' + skills.join('\n\n') + '\n\n' + currentSkills.join('\n');
    } else {
        return currentSkills.slice(0, fullBodyIndex + 1).join('\n') + '\n' + skills.join('\n\n') + '\n\n' + currentSkills.slice(fullBodyIndex　 + 1).join('\n');
    }
};

io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.modifiedEnemyConsts = {
	revenant: {
		static: {
			taxa: 'アンデッド',
			intellect: '低い',
			perception: '魔法',
			disposition: '敵対的',
			language: 'なし',
			habitat: 'さまざま',
			reputation: '8',
			'reputation+': '14',
			weakness: '回復効果ダメージ+3点',
			sin: 5,
			description: '',
			loots1Item: 'なし',
			loots1Num: '2～5',
			loots2Item: '穢れた骨（50G／赤B）',
			loots2Num: '6～10',
			loots3Item: '穢れた頭蓋骨（300G／赤A）',
			loots3Num: '11～',
			lootsNum: '3',
    	}, 
		dynamic: { Accuracy: 2, AccuracyFix: 2, Evasion: -2, EvasionFix: -2, Hp: 10 },
		sharedDynamic: { lv: 1, initiative: -2 },
		skillList: ['[常]精神効果無効', '[常]再生＝3点\n　手番の終了時、HPが「3」点、回復します。HPが0以下になると、この能力は失われます'],
		skillFilter: (line) => { return ! ((line.includes('魔法')) && (line.includes('レベル')) && (line.includes('魔力'))) }
	},
	hiRevenant: {
		static: {
			taxa: 'アンデッド',
			intellect: '人間並み',
			perception: '魔法',
			disposition: '中立',
			habitat: 'さまざま',
			reputation: '12',
			'reputation+': '17',
			weakness: '回復効果ダメージ+3点',
			sin: 5,
			description: '',
			loots1Item: '穢れた頭蓋骨（300G／赤A）',
			loots1Num: '自動',
			loots2Item: '穢れた骨（50G／赤B）',
			loots2Num: '2～10',
			loots3Item: '穢れた仙骨（2,400G／赤A）',
			loots3Num: '11～',
			lootsNum: '3'
    	}, 
		dynamic: { Accuracy: 2, AccuracyFix: 2, Evasion: -2, EvasionFix: -2, Hp: 20 },
		sharedDynamic: { lv: 1, initiative: -2, vitResist: 2, vitResistFix: 2, mndResist: 2, mndResistFix: 2 },
		skillList: ['[常]再生＝8点\n　手番の終了時、HPが「8」点、回復します。HPが0以下になると、この能力は失われます'],
		skillFilter: (_) => { return true; }
	},
	magiReplica: {
		static: {
			taxa: '魔動機',
			intellect: '命令を聞く',
			perception: '機会',
			disposition: '命令による',
			language: '魔動機文明語',
			habitat: '遺跡',
			weakness: '雷属性ダメージ+3点',
			description: '',
			loots1Item: '鉄（20G／黒B）',
			loots1Num: '自動',
			loots2Item: '粗悪な魔動部品（100G／黒白A）',
			loots2Num: '2～5',
			loots3Item: '魔動部品（300G／黒白A）',
			loots3Num: '6～9',
			loots4Item: '希少な魔動部品（900G／黒白A）',
			loots4Num: '10～',
			lootsNum: '4',
			coreParts: 'なし'
    	}, 
		dynamic: { Accuracy: 1, AccuracyFix: 1, Defense: 1, Hp: 5 },
		sharedDynamic: { lv: 1 },
		skillList: ['[常]機械の体\n　刃武器から、クリティカルを受けません。', 'TODO: 吸血や再生といった HP 回復効果を削除してください'],
		skillFilter: (_) => { return true; }
	}
};

io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.beRevenant = () => {
    const getModifedData = (json) => {
        if( Number(json.lv) > 6 ) {
            return io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.beModifiedEnemy(json, io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.modifiedEnemyConsts.hiRevenant, (name) => { return name + '・ハイレブナント'; });
        } else {
            return io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.beModifiedEnemy(json, io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.modifiedEnemyConsts.revenant, (name) => { return name + '・レブナント'; });
        }
    };
    getJsonData('ccfolia').then((json) => {
        const modifedJson = getModifedData(json);
        downloadFile(
            modifedJson.monsterName + '.json', 
            window.URL.createObjectURL(new Blob([ JSON.stringify(modifedJson) ], { "type" : 'text/plain;charset=utf-8;' })));
    });
};

io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.beMagiReplica = (_) => {
    getJsonData('ccfolia').then((json) => {
        const modifiedJson = io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.beModifiedEnemy(json, io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.modifiedEnemyConsts.magiReplica, (name) => { return name + '・魔機人形'; });
        downloadFile(
            modifiedJson.monsterName + '.json', 
            window.URL.createObjectURL(new Blob([ JSON.stringify(modifiedJson) ], { "type" : 'text/plain;charset=utf-8;' })));
    });
};

io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.beModifiedEnemy = (json, modifiedEnemyConsts, nameFunction) => {
    Object.assign(json, modifiedEnemyConsts.static);
	Object.keys(modifiedEnemyConsts.sharedDynamic).forEach(column => { json[column] = io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.addParamByColumn(json, column, modifiedEnemyConsts.sharedDynamic[column]); });
    json.monsterName = nameFunction(json.monsterName);
    const partsNum = Number(json.partsNum) + 1;
    for(var i = 1; i < partsNum; i++) {
        Object.keys(modifiedEnemyConsts.dynamic).forEach(column => { json[`status${i}${column}`] = io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.addParamByColumn(json, `status${i}${column}`, modifiedEnemyConsts.dynamic[column]); });
        json[`status${i}Damage`] = io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.addDamageValue(json[`status${i}Damage`], 2);
    }
    json.skills = io.github.shunshun94.ytsheet.addSkin.ModifiedEnemy.addSkills(json, modifiedEnemyConsts.skillList, modifiedEnemyConsts.skillFilter);

    return json;
};
