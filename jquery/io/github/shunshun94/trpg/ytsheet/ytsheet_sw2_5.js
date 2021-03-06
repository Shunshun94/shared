var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ytsheet = io.github.shunshun94.trpg.ytsheet || {};
io.github.shunshun94.trpg.ytsheet.ytsheetSW2_5 = class {
	constructor(url, callback = io.github.shunshun94.trpg.ytsheet.ytsheetSW2_5.defaultCallback) {
		this.sendRequest(url).done((data) => {
			this.system = '2.5';
			this.basicParse(data);
			this.parseBaseStatus(data);
			this.parseBattleSkills(data);
			this.parseMagics(data);
			this.parseWeapons(data);
			this.parseGuards(data);
			this.parseAccessories(data);
			this.parseSubSkills(data);
			this.parsePets(data);
			callback(this, data);
		});
	}

	basicParse(data) {
		this.name = data.characterName;
		this.title = data.characterName;
		this.id = data.id;
		this.memo = data.freeNote;
	}
	parseBaseStatus(data) {
		this.race = data.race;
		this.level = data.level;
		this.hp = Number(data.hpTotal);
		this.mhp = Number(data.hpTotal);
		this.mp = Number(data.mpTotal);
		this.mmp = Number(data.mpTotal);
		this.status = [
			Number(data.bonusDex),
			Number(data.bonusAgi),
			Number(data.bonusStr),
			Number(data.bonusVit),
			Number(data.bonusInt),
			Number(data.bonusMnd)
		];
		this.skills = com.hiyoko.util.filterMap(com.hiyoko.util.mapMap({
			'ファイター': data.lvFig, 'グラップラー': data.lvGra, 'フェンサー': data.lvFen, 'シューター': data.lvSho,
			'ソーサラー': data.lvSor, 'コンジャラー': data.lvCon, 'プリースト': data.lvPri, 'マギテック': data.lvMag,
			'フェアリーテイマー': data.lvFai,
			'スカウト': data.lvSco, 'レンジャー': data.lvRan, 'セージ': data.lvSag,
			'エンハンサー': data.lvEnh , 'バード': data.lvBar,
			'ライダー': data.lvRid,
			'アルケミスト': data.lvAlc,
			'ウォーリーダー': data.lvWar, 'ミスティック': data.lvMys, 'デーモンルーラー': data.lvDem,
			'ドルイド':data.lvDru,
			'フィジカルマスター': data.lvPhy,
			'グリモワール': data.lvGri, 'アーティザン': data.lvArt, 'アリストクラシー': data.lvAri
		}, function(value) {
			return Number(value);
		}), function(value) {
			return value;
		});
		
		let commonSkillCursor = 1;
		while (data[`commonClass${commonSkillCursor}`] && data[`lvCommon${commonSkillCursor}`]) {
			this.skills[data[`commonClass${commonSkillCursor}`]] = Number(data[`lvCommon${commonSkillCursor}`]);
			commonSkillCursor++;
		}
		
		
		this.dodge = Number(data.DefenseTotalAllEva);
		this.dodgeSkill = data.evasionClass || '';
		this.guard = Number(data.DefenseTotalAllDef);
		this.physical = Number(data.vitResistTotal)
		this.mental = Number(data.mndResistTotal)
	}
	parseBattleSkills(data) {
		this.battleSkills = (data.combatFeatsAuto || '').split(',');
		for(var i = 1; i < 18; i++) {
			this.battleSkills.push(data[`combatFeatsLv${i}`]);
		}
		this.battleSkills = this.battleSkills.filter((d)=>{return d}).map((d) => {
			return {
				name: d, note: ''
			};
		});
	}
	parseMagics(data) {
		const bonus = Number(data.magicPowerAdd) || 0;
		this.magic = com.hiyoko.util.filterMap(com.hiyoko.util.mapMap({
			'真語魔法': data.magicPowerSor ? Number(data.magicPowerSor) : this.skills['ソーサラー'] + this.status[4] + bonus,
			'操霊魔法': data.magicPowerCon ? Number(data.magicPowerCon) : this.skills['コンジャラー'] + this.status[4] + bonus, 
			'神聖魔法': data.magicPowerPri ? Number(data.magicPowerPri) : this.skills['プリースト'] + this.status[4] + bonus,
			'妖精魔法': data.magicPowerFai ? Number(data.magicPowerFai) : this.skills['フェアリーテイマー'] + this.status[4] + bonus,
			'魔動機術': data.magicPowerMag ? Number(data.magicPowerMag) : this.skills['マギテック'] + this.status[4] + bonus,
			'召異魔法': data.magicPowerDem ? Number(data.magicPowerDem) : this.skills['デーモンルーラー'] + this.status[4] + bonus,
			'森羅魔法': data.magicPowerDru ? Number(data.magicPowerDru) : this.skills['ドルイド'] + this.status[4] + bonus,
			'秘奥魔法': data.magicPowerGri ? Number(data.magicPowerGri) : this.skills['グリモワール'] + this.status[4] + bonus
		}, function(value) {
			return Number(value);
		}), function(value) {
			return value;
		});
		/*
		if(this.magic['真語魔法'] && this.magic['操霊魔法']) {
			this.magic['深智魔法'] = this.magic['真語魔法'] > this.magic['操霊魔法'] ?
					this.magic['真語魔法'] : this.magic['操霊魔法'];
		}*/
	}
	parseWeapons(data) {
		let i = 1;
		let flag = true;
		this.weapons = [];
		while(flag) {
			flag = Boolean(data[`weapon${i}Name`]);
			if(flag) {
				this.weapons.push({
					name: data[`weapon${i}Name`],
					rank: '', hand: data[`weapon${i}Usage`] || '-',
					note: data[`weapon${i}Note`] || '-',
					category: data[`weapon${i}Category`] || '-',
					rate: Number(data[`weapon${i}Rate`]) || data[`weapon${i}Rate`] || 0,
					crit: Number(data[`weapon${i}Crit`]) || data[`weapon${i}Crit`] || 10,
					damage: Number(data[`weapon${i}DmgTotal`]) || data[`weapon${i}DmgTotal`] || 0,
					hit: Number(data[`weapon${i}AccTotal`]) || data[`weapon${i}AccTotal`] || 0,
					skill: data[`weapon${i}Class`] || ''
				});
			}
			i++;
		}
	}
	parseGuards(data) {
		this.guards = [];
		if(data.armourName) {
			this.guards.push({
				name: data.armourName,
				guard: Number(data.armourDef) || data.armourDef || 0,
				dodge: Number(data.armourEva) || data.armourEva || 0,
				note: data.armourNote
			});
		}
		if(data.shieldName) {
			this.guards.push({
				name: data.shieldName,
				guard: Number(data.shieldDef) || data.shieldDef || 0,
				dodge: Number(data.shieldEva) || data.shieldEva || 0,
				note: data.shieldNote
			});
		}
		if(data.defOtherName) {
			this.guards.push({
				name: data.defOtherName,
				guard: Number(data.defOtherDef) || data.defOtherDef || 0,
				dodge: Number(data.defOtherEva) || data.defOtherEva || 0,
				note: data.defOtherNote
			});
		}
	}
	parseAccessories(data) {
		this.accessories = ['Head', 'Ear', 'Face', 'Neck', 'Back', 'HandR', 'HandL', 'Waist', 'Leg', 'Other'].map((name) => {
			return {
				name: data[`accessory${name}Name`], note: data[`accessory${name}Note`]
			};
		}).filter((d) => {return d.name});
	}
	parseSubSkills(data) {
		const getSkills = (name, template={}) => {
			let cursor = 1;
			let skills = [];
			while(data[`${name}${cursor}`]) {
				const skill = Object.assign({name: data[`${name}${cursor}`]}, template);
				skills.push(skill);
				cursor++;
			}
			return skills;
		};
		
		
		this.subSkills = {};
		this.subSkills.tempTech = getSkills('craftEnhance', {time: '', effect: '', reference: ''});
		this.subSkills.spellSong = getSkills('craftSong', {prepare: '', effect: '', singer: '', reference: ''});
		this.subSkills.horsemanship = getSkills('craftRiding', {timing: '', effect: '', prepare: '', reference: '',
																type: {animal: '', machine: '', fantasy: ''}});
		this.subSkills.alchemicCard = getSkills('craftAlchemy', {color:'', color: '', effect:'', reference: '',
																size: {B:'', A:'', S:'', SS:''}});
		
		this.subSkills.leadersOrder = [];
		this.subSkills.fortuneTelling = [];
		this.subSkills.aristocratDignity = [];
		this.subSkills.spellSeal = [];
	}
	parsePets(data) {
		this.pets = {};
		this.pets.character = [];
		this.pets.parts = [];
	}

	sendRequest(url) {
		url += "&mode=json";
		return $.ajax({
			type:'get',
			url: url,
			async:true,
			dataType:'jsonp'
		});
	}
};

io.github.shunshun94.trpg.ytsheet.ytsheetSW2_5.defaultCallback = (result, rawData) => {
	console.log('input', rawData)
	console.log('output', result);
};
io.github.shunshun94.trpg.ytsheet.ytsheetSW2_5.getSheet = (url) => {
	var promise = new $.Deferred;
	new io.github.shunshun94.trpg.ytsheet.ytsheetSW2_5(url, (instance) => {
		promise.resolve(instance);
	});
	return promise;
};