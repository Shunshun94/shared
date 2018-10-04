var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ytsheet = io.github.shunshun94.trpg.ytsheet || {};
io.github.shunshun94.trpg.ytsheet.ytsheetMSW2_5 = class {
	constructor(autokeep = false) {
		this.autoKeep = autokeep;
	}
	
	getSharedData(data) {
		let result = {};
		result.result = 'OK';
		result.level = data.lv;
		result.name = data.monsterName;
		result.category = data.taxa;

		result.vitality = Number(data.vitResist) || 0;
		result.mentality = Number(data.mndResist) || 0;
		
		result.wise = data.intellect;
		result.eyeSight = data.perception;
		result.response = data.disposition;
		result.languages = data.language;
		result.place = data.habitat;
		
		result.known = Number(data.reputation) || 0;
		result.week = Number(data['reputation+']) || 0;
		result.weekPoint = data.weakness;

		result.inisiative = Number(data.initiative) || 0;
		result.speed = Number(data.mobility) || data.mobility;

		result.booty = this.getLoots(data);

		result.info = data.description;
		return result;
	}
	
	getLoots(data) {
		let result = [];
		const lootsLength = Number(data.lootsNum);
		for(var i = 0; i < lootsLength; i++) {
			result.push({
				dice: data[`loots${i+1}Num`],
				item: data[`loots${i+1}Item`]
			});
		}
		return result;
	}
	
	getPartsData(data) {
		let result = [];
		let names = {};
		const partsLength = Number(data.statusNum);
		for(var i = 0; i < partsLength; i++) {
			const prefix = `status${i+1}`;
			let name = data[`${prefix}Style`];
			if(names[name]) {
				if($.isNumeric(names[name])) {
					result[names[name]].name = `${name} A`;
					names[`${name} A`] = names[name];
					names[name] = 'B';
					name = `${name} B`;
					names[`${name} B`] = i;
				} else {
					const lastCharCode = names[name].charCodeAt(0);
					names[name] = String.fromCharCode(lastCharCode + 1);
					name = `${name} ${names[name]}`;
					names[`${name} ${names[name]}`] = i;
				}
			} else {
				names[name] = i; 
			}

			result.push({
				armor: Number(data[`${prefix}Defense`]) || 0,
				dodge: Number(data[`${prefix}Evasion`]) || 0,
				hp: Number(data[`${prefix}Hp`]) || 0,
				mp: Number(data[`${prefix}Mp`]) || 0,
				name: name,
				skills: [],
				attackWays: []
			});
			
			const a_Damage = data[`${prefix}Damage`].replace('2d6', '');
			if($.isNumeric(a_Damage)) {
				result[i].attackWays.push({
					damage: Number(a_Damage),
					isMagic: false,
					name: '通常攻撃',
					value: Number(data[`${prefix}Accuracy`]) || 0
				});
			}
		}
		return this.insertSkills(data.skills, result);
		
	}
	
	isMagic(skill) {
		return skill.raw.indexOf('魔力') > -1;
	}
	
	getCheckBase(skill) {
		try{
	        let trialSkillName = skill.raw.split('／');
	        console.log(trialSkillName);
	        if(trialSkillName.length > 2) {
	            return /(\d+)/.exec(trialSkillName[1])[1];
	        }
	        trialSkillName = skill.raw.split('/');
	        console.log(trialSkillName);
	        if(trialSkillName.length > 2) {
	            return /(\d+)/.exec(trialSkillName[1])[1];
	        }
	    } catch(e) {
	    	console.error(e);
	        return 0;
	    }
	    return 0;
	}

	convertToAttackWay(skill) {
		skill.raw = skill.raw.replace(/０/gm, '0').replace(/１/gm, '1').replace(/２/gm, '2').replace(/３/gm, '3')
							.replace(/４/gm, '4').replace(/５/gm, '5').replace(/６/gm, '6')
							.replace(/７/gm, '7').replace(/８/gm, '8').replace(/９/gm, '9')
							.replace(/－/gm, '-').replace(/ー/gm, '-').replace(/＋/gm, '+').replace(/ｄ/gm, 'd');
		if(this.isMagic(skill)) {
			const base = /魔力(\d+)/.exec(skill.raw);
			return {
				damage: 0,
				isMagic: true,
				name: skill.summary,
				value: base ? base[1] : 0
			}
		} else {
			const damage = /「2d6?([-+]\d+)」/gm.exec(skill.raw);
			return {
				damage: damage ? Number(damage[1]) : 0,
				isMagic: false,
				name: skill.summary,
				value: Number(this.getCheckBase(skill))
			}
		}
	}

	parseSkillText(skillText) {
		const SKILL_PREFIX_REGEXP = /([○◯〇△＞▶〆≫☆🗨□☑]+)/gm;
		const NAME_REGEXP = /^[^/／]+/;
		const majorActionType = ['＞', '▶', '〆'];
		const splitedText = skillText.split('\n');

		const category = SKILL_PREFIX_REGEXP.exec(skillText)[0];
		return {
			category: category,
			detail: splitedText.slice(1).join('\n'),
			raw: skillText,
			summary: NAME_REGEXP.exec(splitedText[0].replace(category, ''))[0],
			isMajor: majorActionType.filter((c)=>{return category.indexOf(c) > -1}).length
		};
	}

	splitSkillsBySkill(skillText) {
		let searchTarget = skillText.split('\n').map((line, index)=>{
			return {text: line.replace('>>', '≫'), index: index};
		});
		searchTarget.push({
			text: '○', index: searchTarget.length
		});
		const splitPoints = searchTarget.filter((d)=>{
			return io.github.shunshun94.trpg.ytsheet.ytsheetMSW2_5.SKILL_PREFIX.filter((prefix)=>{
				return d.text.startsWith(prefix);
			}).length;
		});
		const splitPointsCount = splitPoints.length - 1;
		let result = [];
		for(var i = 0; i < splitPointsCount; i++) {
			result.push(searchTarget.slice(splitPoints[i].index, splitPoints[i + 1].index).map((d)=>{return d.text;}).join('\n').trim());
		}
		return result;
	}

	splitSkillsByPartsName(skillText) {
		const title = '●';
		let searchTarget = skillText.split('\n').map((line, index)=>{
			return {text: line, index: index};
		});
		searchTarget.push({
			text: title, index: searchTarget.length
		});
		const splitPoints = searchTarget.filter((d)=>{
			return d.text.startsWith(title);
		});
		const splitPointsCount = splitPoints.length - 1;
		let result = {};
		for(var i = 0; i < splitPointsCount; i++) {
			result[splitPoints[i].text.replace(title, '').trim()] =
				searchTarget.slice(splitPoints[i].index + 1, splitPoints[i + 1].index - 1).map((d)=>{return d.text;}).join('\n');
		}
		return result;
	}

	insertSkillsSingle(skillText, parts) {
		const skills = this.splitSkillsBySkill(skillText).map((rawSkill)=>{
			return this.parseSkillText(rawSkill);
		});
		parts[0].skills.push.apply(parts[0].skills, skills);
		parts[0].attackWays.push.apply(parts[0].attackWays,
			skills.filter((skill)=>{return skill.isMajor}).map((skill)=>{return this.convertToAttackWay(skill)})
		);

		return parts;
	}
	
	isLearnedSkills(partsName, skillPartsName) {
		if(['全身', '全て', '全部', '全部位', '各部位'].includes(skillPartsName)) {
			return true;
		}
		if(partsName.indexOf(skillPartsName) !== -1) {
			return true;
		}
		if(skillPartsName.indexOf(partsName) !== -1) {
			return true;
		}
		return false;
	}

	insertSkillsMulti(skillText, parts) {
		const skillsByParts = this.splitSkillsByPartsName(skillText);
		for(var partsName in skillsByParts) {
			const skills = this.splitSkillsBySkill(skillsByParts[partsName]).map((rawSkill)=>{
				return this.parseSkillText(rawSkill);
			}); 
			parts.forEach((part)=>{
				if(this.isLearnedSkills(part.name, partsName)) {
					part.skills.push.apply(part.skills, skills);
					part.attackWays.push.apply(part.attackWays,
						skills.filter((skill)=>{return skill.isMajor}).map((skill)=>{return this.convertToAttackWay(skill)})
					);
				}
			});
		}
		
		return parts;
	}

	insertSkills(skillText, parts) {
		if(parts.length === 1) {
			return this.insertSkillsSingle(skillText.replace(/&lt;br&gt;/gm, '\n'), parts);
		} else {
			return this.insertSkillsMulti(skillText.replace(/&lt;br&gt;/gm, '\n'), parts);
		}
		return parts;
	}

	parse(data) {
		let result = this.getSharedData(data);
		result.parts = this.getPartsData(data);
		return result;
	}
	
	getSaveData() {
		return JSON.parse(localStorage.getItem('io-github-shunshun94-trpg-ytsheet-ytsheetSW2_5') || '{}');
	}
	addSaveData(url, name) {
		let current = this.getSaveData();
		current[name] = url;
		localStorage.setItem('io-github-shunshun94-trpg-ytsheet-ytsheetSW2_5', JSON.stringify(current));
	}
	
	getSheet(url='') {
		return new Promise((resolve, reject)=>{
			if(url === '') {
				reject({result: 'URL がありません'});
				return;
			}
			$.ajax({
				type:'get',
				url:`${url}&mode=json`,
				async:true,
				dataType:'jsonp'
			}).done((result)=>{
				try {
					const enemyData = this.parse(result);
					resolve(enemyData);
					if(this.autoKeep) {
						this.addSaveData(url, enemyData.name);
					}
					
					
				}catch(e) {
					console.error(e.stack);
					reject({
						result: e.message,
						error: e.stack
					});
				}
			}).fail((error)=>{
				reject({
					result: 'ゆとシートⅡ for SW2.5 のデータではないと思われます',
					error: error
				});
			});
		});
	}
};

io.github.shunshun94.trpg.ytsheet.ytsheetMSW2_5.SKILL_PREFIX = [
	'○','◯','〇',	// 常時
	'△',			// 準備
	'＞', '▶', '〆',	// 主動作
	'≫', '☆',		// 補助動作 >> は事前処理して消してある
	'🗨', '□', '☑'	// 宣言
];