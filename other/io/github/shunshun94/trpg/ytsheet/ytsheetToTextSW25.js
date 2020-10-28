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

io.github.shunshun94.trpg.ytsheet.generateCharacterTextFromYtSheet2SwordWorldEnemy = (json) => {
	const result = [];

	result.push(`種族名：${json.monsterName}`);
	if(json.characterName) {result.push(`個体名：${json.characterName}`);}
	if(json.taxa) {result.push(`　分類：${json.taxa}`);}
	if(json.sin) {result.push(`　穢れ：${json.sin}`);}
	result.push('');

	result.push(`知能：${(json.intellect || '').padEnd(12 - (json.intellect || '').length, ' ')}知覚：${(json.perception || '').padEnd(14-(json.perception || '').length, ' ')}反応：${json.disposition || ''}`);
	result.push(`言語：${json.language || ''}  生息地：${json.habitat || ''}`);
	result.push('');
	result.push('');

	result.push('□基本能力');
	result.push(`　知名度/弱点：${json.reputation || 0}/${json['reputation+'] || 0}  ` + `${json.weakness ? '弱点：' + json.weakness : ''}`);
	result.push(`　先制値：${json.initiative || 0}  移動速度：${json.mobility || 0}`);
	result.push(`　生命抵抗力：${json.vitResist || 0}  精神抵抗力：${json.mndResist || 0}`);
	result.push('');

	const partsLength = Number(json.statusNum);
	const partBaseValueLength = 5;
	const partAttackValueLength = 7;
	const partBaseXPLength = 5;
	result.push(`　      命中力| 打撃点 |回避力|防護点|   HP |   MP`);
	for(let i = 0; i < partsLength; i++) {
		result.push(`　${json[`status${i + 1}Style`] || ''}\n　      ${(json[`status${i + 1}Accuracy`] || '0').padStart(partBaseValueLength, ' ')} |${(json[`status${i + 1}Damage`] || '0').padStart(partAttackValueLength, ' ')} |${(json[`status${i + 1}Evasion`] || '0').padStart(partBaseValueLength, ' ')} |${(json[`status${i + 1}Defense`] || '0').padStart(partBaseValueLength, ' ')} |${(json[`status${i + 1}Hp`] || '0').padStart(partBaseValueLength, ' ')} |${(json[`status${i + 1}Mp`] || '0').padStart(partBaseValueLength, ' ')}`)
	}
	if(partsLength !== 1) {
		result.push(`　部位数：${partsLength}（${json.parts || '?'}） コア部位：${json.coreParts || '?'}`);
	}
	result.push('');
	result.push('');

	result.push('□特殊能力');
	result.push('　' + (json.skills || '').replaceAll('&lt;br&gt;', '\n　'));
	result.push('');
	result.push('');

	result.push('□戦利品');
	const lootsLength = Number(json.lootsNum);
	for(let i = 0; i < lootsLength; i++) {
		if(json[`loots${i + 1}Num`] && json[`loots${i + 1}Item`]) {
			result.push(`　${json[`loots${i + 1}Num`]}\n　　${json[`loots${i + 1}Item`]}`);
		}
	}
	result.push('');
	result.push('');

	result.push('□説明');
	result.push('　' + (json.description || '').replaceAll('&lt;br&gt;', '\n　'));
	return result.join('\n');
};

io.github.shunshun94.trpg.ytsheet.generateCharacterTextFromYtSheet2SwordWorldPC = (json) => {
	const result = [];
	result.push(`キャラクター名：${json.characterName}`);
	result.push(`種族：${json.race || ''} ${json.raceAbility || ''}`);
	result.push(`生まれ：${json.birth || ''}`);
	if(json.faith) { result.push(`信仰：${json.faith}`); }
	result.push(`年齢：${json.age || '?'}`);
	result.push(`性別：${json.gender || '?'}`);
	result.push(`穢れ度：${json.sin || '0'}`);
	result.push('');

	result.push('●能力値');
	const leftThLength = 9;
	const singleColumnLength = 10;
	const halfColumnLength = singleColumnLength / 2;
	const doubleColumnLength = singleColumnLength * 2;
	const baseValuesPrefixSpaces = ''.padStart(leftThLength, ' '); 
	result.push(`${baseValuesPrefixSpaces}${'技'.padStart(singleColumnLength - 1, ' ')}${'体'.padStart(doubleColumnLength - 1, ' ')}${'心'.padStart(doubleColumnLength  - 1, ' ')}`);
	result.push(`${baseValuesPrefixSpaces}${(json.sttBaseTec || '').padStart(singleColumnLength, ' ')}${(json.sttBasePhy || '').padStart(doubleColumnLength, ' ')}${(json.sttBaseSpi || '').padStart(doubleColumnLength, ' ')}`);
	result.push(`${baseValuesPrefixSpaces}${'器用'.padStart(halfColumnLength - 2, ' ')}${'敏捷'.padStart(singleColumnLength - 2, ' ')}${'筋力'.padStart(singleColumnLength - 2, ' ')}${'生命'.padStart(singleColumnLength - 2, ' ')}${'知力'.padStart(singleColumnLength - 2, ' ')}${'精神'.padStart(singleColumnLength - 2, ' ')}`);
	result.push(`${'ダイス'.padEnd(leftThLength - 3, ' ')}${(json.sttBaseA || '').padStart(halfColumnLength, ' ')}${(json.sttBaseB || '').padStart(singleColumnLength, ' ')}${(json.sttBaseC || '').padStart(singleColumnLength, ' ')}${(json.sttBaseD || '').padStart(singleColumnLength, ' ')}${(json.sttBaseE || '').padStart(singleColumnLength, ' ')}${(json.sttBaseF || '').padStart(singleColumnLength, ' ')}`);
	result.push(`${'成長'.padEnd(leftThLength - 2, ' ')}${json.sttGrowA.padStart(halfColumnLength, ' ')}${json.sttGrowB.padStart(singleColumnLength, ' ')}${json.sttGrowC.padStart(singleColumnLength, ' ')}${json.sttGrowD.padStart(singleColumnLength, ' ')}${json.sttGrowE.padStart(singleColumnLength, ' ')}${json.sttGrowF.padStart(singleColumnLength, ' ')}`);
	result.push(''.padEnd(leftThLength + doubleColumnLength * 3, '-'));
	result.push(`${'合計'.padEnd(leftThLength - 2, ' ')}${json.sttDex.padStart(halfColumnLength, ' ')}${json.sttAgi.padStart(singleColumnLength, ' ')}${json.sttStr.padStart(singleColumnLength, ' ')}${json.sttVit.padStart(singleColumnLength, ' ')}${json.sttInt.padStart(singleColumnLength, ' ')}${json.sttMnd.padStart(singleColumnLength, ' ')}`);
	result.push(`${'修正'.padEnd(leftThLength - 2, ' ')}${(json.sttAddA || '').padStart(halfColumnLength, ' ')}${(json.sttAddB || '').padStart(singleColumnLength, ' ')}${(json.sttAddC || '').padStart(singleColumnLength, ' ')}${(json.sttAddD || '').padStart(singleColumnLength, ' ')}${(json.sttAddE || '').padStart(singleColumnLength, ' ')}${(json.sttAddF || '').padStart(singleColumnLength, ' ')}`);
	result.push(''.padEnd(leftThLength + doubleColumnLength * 3, '-'));
	result.push(`${'ボーナス'.padEnd(leftThLength - 4, ' ')}${json.bonusDex.padStart(halfColumnLength, ' ')}${json.bonusAgi.padStart(singleColumnLength, ' ')}${json.bonusStr.padStart(singleColumnLength, ' ')}${json.bonusVit.padStart(singleColumnLength, ' ')}${json.bonusInt.padStart(singleColumnLength, ' ')}${json.bonusMnd.padStart(singleColumnLength, ' ')}`)
	result.push('');

	result.push(`${baseValuesPrefixSpaces}${'生命抵抗'.padStart(singleColumnLength - 4, ' ')}${'精神抵抗'.padStart(singleColumnLength - 4, ' ')}${'HP'.padStart(singleColumnLength, ' ')}${'MP'.padStart(singleColumnLength, ' ')}`);
	result.push(`${'基本'.padEnd(leftThLength - 2, ' ')}${json.vitResistBase.padStart(singleColumnLength, ' ')}${json.mndResistBase.padStart(singleColumnLength, ' ')}${json.hpBase.padStart(singleColumnLength, ' ')}${json.mpBase.padStart(singleColumnLength, ' ')}`);
	result.push(`${'修正'.padEnd(leftThLength - 2, ' ')}${( json.vitResistAddTotal || '0' ).padStart(singleColumnLength, ' ')}${( json.mndResistAddTotal || '0' ).padStart(singleColumnLength, ' ')}${( json.hpAddTotal || '0' ).padStart(singleColumnLength, ' ')}${( json.mpAddTotal || '0' ).padStart(singleColumnLength, ' ')}`);
	result.push(''.padEnd(leftThLength + singleColumnLength * 4, '-'));
	result.push(`${'合計'.padEnd(leftThLength - 2, ' ')}${json.vitResistTotal.padStart(singleColumnLength, ' ')}${json.mndResistTotal.padStart(singleColumnLength, ' ')}${json.hpTotal.padStart(singleColumnLength, ' ')}${json.mpTotal.padStart(singleColumnLength, ' ')}`);
	result.push('');
	
	result.push(`${baseValuesPrefixSpaces}${'先制'.padStart(singleColumnLength - 4, ' ')}${'魔物知識'.padStart(singleColumnLength - 2, ' ')}${'通常移動'.padStart(singleColumnLength - 4, ' ')}`);
	result.push(`${'基本'.padEnd(leftThLength - 2, ' ')}${String( Number(json.initiative) - Number(json.initiativeAdd || '0') ).padStart(singleColumnLength, ' ')}${String( Number(json.monsterLore) - Number(json.monsterLoreAdd || '0') ).padStart(singleColumnLength, ' ')}${json.mobilityBase.padStart(singleColumnLength, ' ')}`);
	result.push(`${'修正'.padEnd(leftThLength - 2, ' ')}${( json.initiativeAdd || '0' ).padStart(singleColumnLength, ' ')}${( json.monsterLoreAdd || '0' ).padStart(singleColumnLength, ' ')}${( json.mobilityAddTotal || '0' ).padStart(singleColumnLength, ' ')}`);
	result.push(''.padEnd(leftThLength + singleColumnLength * 4, '-'));
	result.push(`${'合計'.padEnd(leftThLength - 2, ' ')}${json.initiative.padStart(singleColumnLength, ' ')}${json.monsterLore.padStart(singleColumnLength, ' ')}${json.mobilityTotal.padStart(singleColumnLength, ' ')}`);
	result.push('');

	result.push('●レベル・技能');
	const skillNameColumnLength = 20;
	result.push(`${'冒険者レベル'.padEnd(skillNameColumnLength - 6, ' ')}: ${(json.level || '').padStart(3, ' ')} Lv`);
	for(let key in io.github.shunshun94.trpg.ytsheet.consts.skills) {
		if(json[key]) {
			const name = io.github.shunshun94.trpg.ytsheet.consts.skills[key];
			result.push(`${name.padEnd(skillNameColumnLength - name.length, ' ')}: ${json[key].padStart(3, ' ')} Lv`);
		}
	}
	result.push('');

	result.push('●戦闘特技 (自動習得は省略)');
	for(let i = 0; i < io.github.shunshun94.trpg.ytsheet.consts.maxLevel; i++) {
		if(json[`combatFeatsLv${i + 1}`]) {
			result.push(`${String(i + 1).padStart(4, ' ')}： ${json[`combatFeatsLv${i + 1}`]}`);
		} 
	}
	const mysticArtsLength = json.mysticArtsNum ? Number(json.mysticArtsNum) : 0;
	for(let i = 0; i < mysticArtsLength; i++) {
		result.push(`秘伝：${json[`mysticArts${i+1}`]}`);
	}
	result.push('');

	result.push('●習得特技');
	for(var key in io.github.shunshun94.trpg.ytsheet.consts.levelSkills) {
		if(json[`${key}1`]) {			
			result.push(`　- ${io.github.shunshun94.trpg.ytsheet.consts.levelSkills[key]}`);
			for(let i = 0; i < io.github.shunshun94.trpg.ytsheet.consts.maxLevel; i++) {
				if(json[`${key}${i + 1}`]) {
					result.push(`${String(i + 1).padStart(2, ' ')}： ${json[`${key}${i + 1}`]}`);
				}
			}
		}
	}
	result.push('');

	result.push('●装備');
	const weaponCount = Number(json.weaponNum);
	const equipsColumnLength = 10;
	const equipsPrefix = '    ';
	const equipsWeaponHeader = `${equipsPrefix}${'用法'.padStart(equipsColumnLength-2, ' ')}${'必筋'.padStart(equipsColumnLength-2, ' ')}${'命中修正'.padStart(equipsColumnLength-4, ' ')}${'命中'.padStart(equipsColumnLength-2, ' ')}${'威力'.padStart(equipsColumnLength-2, ' ')}${'C値'.padStart(equipsColumnLength-1, ' ')}${'ダメ修正'.padStart(equipsColumnLength-4, ' ')}${'追加ダメ'.padStart(equipsColumnLength-4, ' ')}`;
	const equipsHeader = ``;
	const equipsProtectorPrefix = `${equipsPrefix}${'必筋'.padStart(equipsColumnLength-2, ' ')}${'回避'.padStart(equipsColumnLength-2, ' ')}${'防護'.padStart(equipsColumnLength-2, ' ')}${'メモ'.padStart(equipsColumnLength-2, ' ')}`;
	if(weaponCount) {
		result.push(`　- 武器`);
	}
	for(var i = 0; i < weaponCount; i++) {
		if(json[`weapon${i+1}Name`]) {
			result.push(`${equipsPrefix}名前：${json[`weapon${i+1}Name`]}${json[`weapon${i+1}Own`] ? '(専)' : ''} ${json[`weapon${i+1}Category`] ? `(カテゴリ ${json[`weapon${i+1}Category`]})` : ''}`);
			if(json[`weapon${i+1}Note`]){ result.push(`${equipsPrefix}メモ： ${json[`weapon${i+1}Note`]}`); }
			result.push(equipsWeaponHeader);
			result.push(`${equipsPrefix}${(json[`weapon${i+1}Usage`] || '').padStart(equipsColumnLength, ' ')}${(json[`weapon${i+1}Reqd`] || '').padStart(equipsColumnLength, ' ')}${(json[`weapon${i+1}Acc`] || '').padStart(equipsColumnLength, ' ')}${(json[`weapon${i+1}AccTotal`] || '').padStart(equipsColumnLength, ' ')}${(json[`weapon${i+1}Rate`] || '').padStart(equipsColumnLength, ' ')}${(json[`weapon${i+1}Crit`] || '').padStart(equipsColumnLength, ' ')}${(json[`weapon${i+1}Dmg`] || '').padStart(equipsColumnLength, ' ')}${(json[`weapon${i+1}DmgTotal`] || '').padStart(equipsColumnLength, ' ')}`)
		}
	}
	if(json.armourName || json.shieldName || json.defOtherName) {
		result.push(`　- 防具`);
	} else {
		result.push(`　- 回避・防護点`);
	}
	if(json.armourName) {
		result.push(`${equipsPrefix}鎧: ${json.armourName}${json.armourOwn ? '(専)' : ''}`);
		result.push(equipsProtectorPrefix)
		result.push(`${equipsPrefix}${(json.armourReqd || '0').padStart(equipsColumnLength, ' ')}${(json.armourEva || '0').padStart(equipsColumnLength, ' ')}${(json.armourDef || '0').padStart(equipsColumnLength, ' ')}      ${json.armourNote || ''}`);
	}
	if(json.shieldName) {
		result.push(`${equipsPrefix}盾: ${json.shieldName}${json.shieldOwn ? '(専)' : ''}`);
		result.push(equipsProtectorPrefix)
		result.push(`${equipsPrefix}${(json.shieldReqd || '0').padStart(equipsColumnLength, ' ')}${(json.shieldEva || '0').padStart(equipsColumnLength, ' ')}${(json.shieldDef || '0').padStart(equipsColumnLength, ' ')}      ${json.shieldNote || ''}`);
	}
	if(json.defOtherName) {
		result.push(`${equipsPrefix}他: ${json.defOtherName}`);
		result.push(equipsProtectorPrefix)
		result.push(`${equipsPrefix}${(json.defOtherReqd || '0').padStart(equipsColumnLength, ' ')}${(json.defOtherEva || '0').padStart(equipsColumnLength, ' ')}${(json.defOtherDef || '0').padStart(equipsColumnLength, ' ')}      ${json.defOtherNote || ''}`);
	}
	if(json.armourName || json.shieldName || json.defOtherName) {
		result.push(`${equipsPrefix}${''.padStart(equipsColumnLength*3, '-')}`);
	}
	result.push(`${equipsPrefix}${' '.padStart(equipsColumnLength, ' ')}${'回避'.padStart(equipsColumnLength-2, ' ')}${'防護'.padStart(equipsColumnLength-2, ' ')}`);
	result.push(`${equipsPrefix}${'合計'.padStart(equipsColumnLength-2, ' ')}${(json.defenseTotalAllEva || '0').padStart(equipsColumnLength, ' ')}${(json.defenseTotalAllDef || '0').padStart(equipsColumnLength, ' ')}`);

	const accessoryPartList = [];
	const accessoryPartsNameColumnLength = 6;
	for(let key in io.github.shunshun94.trpg.ytsheet.consts.accessory.part) {
		if(json[`accessory${key}Name`]) { accessoryPartList.push(key); }
	}
	if(accessoryPartList.length) {result.push(`　- 装飾品`);}
	accessoryPartList.forEach((part)=>{
		const rawPartName = io.github.shunshun94.trpg.ytsheet.consts.accessory.part[part];
		const partName = rawPartName.padEnd(accessoryPartsNameColumnLength - rawPartName.length, ' ');
		let i = 0;
		while(json[`accessory${part}${''.padStart(i, '_')}Name`]) {
			const name = json[`accessory${part}${''.padStart(i, '_')}Name`];
			const isCustom = json[`accessory${part}${''.padStart(i, '_')}Own`] ? '(先)' : '';
			const note = json[`accessory${part}${''.padStart(i, '_')}Note`] || '';
			result.push(`${equipsPrefix}${partName}： ${name}${isCustom} ${note}`);
			i++;
		}
	});
	result.push('');

	result.push('●所持品');
	const itemListPrefix = '  ';
	result.push(itemListPrefix + (json.items || '').replace(/&lt;br&gt;&lt;br&gt;/gm, '&lt;br&gt;').replace(/&lt;br&gt;/gm, '\n').replace(/\n/gm, '\n  '));
	if(json.lvAlc) {
		result.push('');
		const cardColumnLength = 5;
		const cardTopColumnLength = 8;
		let cardTableHader = '';
		for(var key in io.github.shunshun94.trpg.ytsheet.consts.card.color) {
			cardTableHader += `${io.github.shunshun94.trpg.ytsheet.consts.card.color[key].padStart(cardColumnLength - 1, ' ')}`;
		}
		result.push(`${itemListPrefix}${'カード'.padStart(cardTopColumnLength - 3, ' ')}${cardTableHader}`);
		io.github.shunshun94.trpg.ytsheet.consts.card.rank.forEach((rank)=>{
			let line = itemListPrefix + rank.padStart(cardTopColumnLength, ' ');
			for(var key in io.github.shunshun94.trpg.ytsheet.consts.card.color) {
				line += (json[`card${key}${rank}`] || '').padStart(cardColumnLength, ' ');
			}
			result.push(line);
		});
	}
	result.push('');

	result.push('●資金');
	result.push('  所持金：' + (json.moneyTotal　|| json.money || 0));
	result.push('  　預金：' + (json.depositTotal || 0));
	result.push('  　借金：' + (json.debtTotal || 0));
	result.push('');

	result.push('●魔力');
	const magicColumnLength = 8;
	for(let key in io.github.shunshun94.trpg.ytsheet.consts.magic) {
		if(json[key.replace('magicPower', 'lv')]) {
			const name = io.github.shunshun94.trpg.ytsheet.consts.magic[key];
			result.push(`  ${name.padStart(magicColumnLength - name.length, ' ')}：${json[key].padStart(3, ' ')}`);
		}
	}
	result.push('');

	result.push('●習得言語（初期習得の言語は除く）');
	const languageLength = Number(json.languageNum);
	const languageNameColumnLength = 24;
	const languageColumnLength = 5;
	result.push(`  ${'名称'.padStart(languageNameColumnLength - 2, ' ')}${'会話'.padStart(languageColumnLength - 2, ' ')}${'読文'.padStart(languageColumnLength - 2, ' ')}`);
	for(var i = 0; i < languageLength; i++) {
		const name = json[`language${i+1}`] || '？？？';
		const talk = json[`language${i+1}Talk`] ? '〇' : '　';
		const read = json[`language${i+1}Read`] ? '〇' : '　';
		if(json[`language${i+1}`] || json[`language${i+1}Talk`] || json[`language${i+1}Read`]) {
			result.push(`  ${name.padStart(languageNameColumnLength - name.length, ' ')}${talk.padStart(languageColumnLength - 1, ' ')}${read.padStart(languageColumnLength - 1, ' ')}`);
		}
	}
	result.push('');

	result.push('●名誉点');
	const historyLength = Number(json.historyNum || '0'); 
	let totalHonor = 0;
	let honorDiffCandidate = Number(json.honor);
	const honorPrefix = '  ';
	const honorLength = Number(json.honorItemsNum || '0');
	const dishonorLength = Number(json.dishonorItemsNum || '0')
	result.push(`　- 名誉`);
	result.push(`${honorPrefix}${honorPrefix}名誉点残高：${json.honor || 0}`);
	for(let i = 0; i < historyLength + 1; i++) {
		totalHonor += Number(json[`history${i}Honor`] || '0');
	}
	for(let i = 0; i < honorLength; i++) {
		if(json[`honorItem${i+1}`]) {
			result.push(`${honorPrefix}${honorPrefix}${json[`honorItem${i+1}`]}：${json[`honorItem${i+1}Pt`] || 0}`);
			honorDiffCandidate += Number(json[`honorItem${i+1}Pt`] || '0');
		}
	}
	if(totalHonor !== honorDiffCandidate) {
		result.push(`${honorPrefix}${honorPrefix}冒険者ランク(${json.rank || '？？？'})：${totalHonor - honorDiffCandidate}`);
	}
	result.push(`　- 不名誉`);
	for(let i = 0; i < dishonorLength; i++) {
		if(json[`dishonorItem${i+1}`]) {
			result.push(`${honorPrefix}${honorPrefix}${json[`dishonorItem${i+1}`]}：${json[`dishonorItem${i+1}Pt`] || 0}`);
		}
	}
	result.push(`${honorPrefix}${honorPrefix}合計：${json.dishonor || 0}`);
	result.push('');

	if(historyLength) {
		const historyCountColumnLength = 4;
		const historyColumnLength = 20;
		result.push('●成長');
		result.push(`${'回数'.padStart(historyCountColumnLength - 2, ' ')}${'名誉点'.padStart(historyColumnLength - 3, ' ')}${'経験点'.padStart(historyColumnLength - 3, ' ')}${'ガメル'.padStart(historyColumnLength - 3, ' ')}  情報`);		
		for(let i = 0; i < historyLength; i++) {
			result.push(`${String(i+1).padStart(historyCountColumnLength, ' ')}${(json[`history${i+1}Honor`] || '').padStart(historyColumnLength, ' ')}${(json[`history${i+1}Exp`] || '').padStart(historyColumnLength, ' ')}${(json[`history${i+1}Money`] || '').padStart(historyColumnLength, ' ')}  ${(json[`history${i+1}Title`] || '')}`);
		}		
	}


	return result.join('\n');
};
