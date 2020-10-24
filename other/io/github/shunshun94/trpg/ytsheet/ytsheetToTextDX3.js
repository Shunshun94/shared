/* MIT License

Copyright 2020 @Shunshun94

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ytsheet = io.github.shunshun94.trpg.ytsheet || {};

io.github.shunshun94.trpg.ytsheet.length = (str='') => {
	// https://zukucode.com/2017/04/javascript-string-length.html
	let length = 0;
	for (let i = 0; i < str.length; i++) {
			const c = str.charCodeAt(i);
			if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
				length += 1;
			} else {
				length += 2;
			}
	}
	return length;
};

io.github.shunshun94.trpg.ytsheet._convertDoubleCrossStatus = (json, s) => {
	const result = [];
	result.push(`【${s.name}】：${json['sttTotal' + s.column]} (内成長：${json['sttGrow' + s.column] || 0})`);
	s.skills.forEach((skill)=>{
		result.push(`〈${skill.name}〉：SL${json['skill' + skill.column] || 0} / 判定 ${json['sttTotal' + s.column]}r+${json['skillTotal' + skill.column] || 0}`);
	});
	let cursor = 1;
	if(json[`skill${s.extendableSkill.column}${cursor}`]) {
		while(json[`skill${s.extendableSkill.column}${cursor}Name`]) {
			result.push('〈' + json[`skill${s.extendableSkill.column}${cursor}Name`] +`〉：SL${json[`skill${s.extendableSkill.column}${cursor}`]} / 判定 ${json['sttTotal' + s.column]}r+${json[`skill${s.extendableSkill.column}${cursor}`]}`);
			cursor++;
		}
	} else {
		result.push(`〈${s.extendableSkill.name}〉：SL0 / 判定 ${json['sttTotal' + s.column]}r+0`);
	}

	result.push('');
	return result.join('\n');
};

io.github.shunshun94.trpg.ytsheet._getColumnLength = (list, header) => {
	return list.reduce((currentMax, targetEffect)=>{
		const result = {};
		for(var key in currentMax) {
			result[key] = Math.max(io.github.shunshun94.trpg.ytsheet.length(targetEffect[key]), currentMax[key]);
		}
		return result;
	}, header);
};

io.github.shunshun94.trpg.ytsheet._convertList = (list, columns) => {
	const headerLength = io.github.shunshun94.trpg.ytsheet._getLengthWithoutNote(columns);
	const length = io.github.shunshun94.trpg.ytsheet._getColumnLength(list, headerLength);
	const convertDataToString = (data) => {
		const result = [];
		for(var key in headerLength) {
			result.push(`${data[key]}${''.padEnd(length[key] - io.github.shunshun94.trpg.ytsheet.length(data[key]), ' ')}`);
		}
		result.push(data.note);
		return result.join('/');
	};
	return [columns].concat(list).map(convertDataToString).join('\n');
};

io.github.shunshun94.trpg.ytsheet._getLengthWithoutNote = (baseHeader) => {
	const result = {};
	for(let key in baseHeader) {
		if(key !== 'note') {
			result[key] = io.github.shunshun94.trpg.ytsheet.length(baseHeader[key]);
		}
	}
	return result;
};

io.github.shunshun94.trpg.ytsheet._getDoubleCrossEffects = (json) => {
	let cursor = 1;
	const effectData = [];
	while(json[`effect${cursor}Name`]) {
		effectData.push({
			name: '《' + json[`effect${cursor}Name`] + '》',
			level: json[`effect${cursor}Lv`],
			timing: json[`effect${cursor}Timing`],
			difficulty: json[`effect${cursor}Dfclty`],
			target: json[`effect${cursor}Target`],
			range: json[`effect${cursor}Range`],
			cost: json[`effect${cursor}Encroach`],
			limitation: json[`effect${cursor}Restrict`],
			note: json[`effect${cursor}Note`]
		});
		cursor++;
	}
	return effectData;
};

io.github.shunshun94.trpg.ytsheet._getDoubleCrossCombos = (json) => {
	let cursor = 1;
	const comboData = [];
	while(json[`effect${cursor}Name`]) {
		let limitationCursor = 1;
		while(json[`combo${cursor}Condition${limitationCursor}`]) {
			comboData.push({
				name: json[`combo${cursor}Name`],
				combination: json[`combo${cursor}Combo`] || '',
				skill: json[`combo${cursor}Skill`] || '',
				hit: (`combo${cursor}Dice${limitationCursor}`) ? '(' + json[`combo${cursor}Dice${limitationCursor}`] + ')dx' +  ('+(' + json[`combo${cursor}Fixed${limitationCursor}`] + ')' || '+0') + '@' + (json[`combo${cursor}Crit${limitationCursor}`] || 10) : '',
				attack: json[`combo${cursor}Atk${limitationCursor}`] || '',
				target: json[`combo${cursor}Target`] || '',
				range: json[`combo${cursor}Range`] || '',
				cost: json[`combo${cursor}Encroach`] || '0',
				limitation: json[`combo${cursor}Condition${limitationCursor}`] || '',
				note: json[`combo${cursor}Note`] || ''
			});			
			limitationCursor++;
		}
		cursor++;
	}
	return comboData;
};

io.github.shunshun94.trpg.ytsheet.generateCharacterTextFromYtSheet2DoubleCrossPc = (json) => {
	const result = [];

	result.push(`タイトル：${json.characterName}`);
	result.push('');

	result.push(`キャラクター名：${json.characterName}
年齢：${json.age || ''}
性別：${json.gender || ''}
身長：${json.height || ''}
体重：${json.weight || ''}`);
	result.push('');

	result.push(`ワークス　　：${json.works || ''}
カヴァー　　：${json.cover || ''}
シンドローム：${json.syndrome1 || ''}${json.syndrome2 ? '、'+json.syndrome2 : ''}${json.syndrome3 ? '、'+json.syndrome3 : ''}`);
	result.push('');

	result.push(`■ライフパス■
覚醒：${json.lifepathAwaken || ''}
衝動：${json.lifepathImpulse || ''}`);
	result.push('');

	result.push('■能力値と技能■\n');
	io.github.shunshun94.trpg.ytsheet.consts.DX3_STATUS.forEach((statusPattern)=>{
		result.push(io.github.shunshun94.trpg.ytsheet._convertDoubleCrossStatus(json, statusPattern));
	});
	result.push('');
	result.push(`【ＨＰ】　　　${String(json.maxHpTotal).padStart(3, ' ')}
【侵蝕基本値】${String(json.baseEncroach).padStart(3, ' ')}％
【行動値】　　${String(json.initiativeTotal).padStart(3, ' ')}
【戦闘移動】　${String(json.moveTotal).padStart(3, ' ')}ｍ`);
	result.push('');

	result.push('■エフェクト■\n');
	const effectData = io.github.shunshun94.trpg.ytsheet._getDoubleCrossEffects(json);
	result.push(io.github.shunshun94.trpg.ytsheet._convertList(effectData, io.github.shunshun94.trpg.ytsheet.consts.EFFECT_COLUMNS));
	result.push('');
	result.push('');

	result.push('■コンボ■\n');
	const comboData = io.github.shunshun94.trpg.ytsheet._getDoubleCrossCombos(json);
	result.push(io.github.shunshun94.trpg.ytsheet._convertList(comboData, io.github.shunshun94.trpg.ytsheet.consts.COMBO_COLUMNS));
	result.push('');
	result.push('');

	
	result.push('■アイテム■');
	result.push('・武器');
	
	result.push('・防具');

	result.push('・その他');

	result.push('■アイテム■');

	result.push('■メモリー■');

	result.push('■その他■');
	result.push(json.freeNote.replace(/&lt;br&gt;/gm, '\n').replace(/&quot;/gm, '"'));
	
	return result.join('\n');
};