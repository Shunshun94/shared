var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.characterSheetsMasashige = io.github.shunshun94.trpg.characterSheetsMasashige || {};

io.github.shunshun94.trpg.characterSheetsMasashige.DX3 = class extends io.github.shunshun94.trpg.characterSheetsMasashige.client {
	constructor (id, opt_callback) {
		super('dx3');
		this.sendRequest(id).done((json) => {
			this.basicParse(json);
			this.leftSide(json);
			this.rightSide(json);
			if(opt_callback) {
				opt_callback(this);
			} else {
				console.log('input', json);
				console.log('output', this);
			}	
		}).fail(function(fail) {
			alert(fail);
			throw fail;
		})
	}
	
	leftSide (json) {
		const base = json.base;
		const status = json.baseAbility
		const subStatus = json.subAbility;
		const skills = json.skills;
		
		this.codeName = base.nameKana;
		this.player = base.player;
		this.age = base.age;
		this.sex = base.sex;
		this.works = base.works; this.cover = base.cover;
		this.syndromes = io.github.shunshun94.trpg.characterSheetsMasashige.DX3.syndromeFilter(base.syndromes);
		this.status =  {
			body: status.body.subtotal,　'肉体': status.body.subtotal,
			mind: status.mind.subtotal,　'精神': status.mind.subtotal,
			sense: status.sense.subtotal,　'感覚': status.sense.subtotal,
			society: status.society.subtotal,　'社会': status.society.subtotal
		};
		this.skills = {
				'白兵': {status: 'body', lv: Number(skills.hak.A.lv) || 0},
				'回避': {status: 'body', lv: Number(skills.kai.A.lv) || 0},
				'射撃': {status: 'sense', lv: Number(skills.sha.A.lv) || 0},
				'知覚': {status: 'sense', lv: Number(skills.tik.A.lv) || 0},
				'RC': {status: 'mind', lv: Number(skills.rc.A.lv) || 0},
				'意志': {status: 'mind', lv: Number(skills.isi.A.lv) || 0},
				'交渉': {status: 'society', lv: Number(skills.kou.A.lv) || 0},
				'調達': {status: 'society', lv: Number(skills.tyo.A.lv) || 0},
				'運転': {status: 'body', lv: 0},
				'芸術': {status: 'sense', lv: 0},
				'知識': {status: 'sense', lv: 0},
				'情報': {status: 'society', lv: 0}
		};
		skills.B.forEach((cols) => {
			if(cols.lv1) {
				this.skills['運転:' + cols.name1] = {status: 'body', lv: Number(cols.lv1)};
			}
			if(cols.lv2) {
				this.skills['芸術:' + cols.name2] = {status: 'sense', lv: Number(cols.lv2)};
			}
			if(cols.lv3) {
				this.skills['知識:' + cols.name3] = {status: 'mind', lv: Number(cols.lv3)};
			}
			if(cols.lv4) {
				this.skills['情報:' + cols.name4] = {status: 'society', lv: Number(cols.lv4)};
			}
		});
		this.subStatus = {
			HP: subStatus.hp.current || subStatus.hp.total, hp: subStatus.hp.total || subStatus.hp.total,
			MHP: subStatus.hp.total, mhp: subStatus.hp.total, 
			erotion: json.erotion.shock || subStatus.erotion.total, '侵蝕率': json.erotion.shock || subStatus.erotion.total,
			initialErotion: subStatus.erotion.total, '侵蝕率基本値': subStatus.erotion.total,
			speed: subStatus.action.total, '行動値':  subStatus.action.total,
			standing: subStatus.standing.total, '常備化ポイント': subStatus.standing.total,
			property: subStatus.property.total, '財産ポイント': subStatus.property.total
		};
		this.lois = json.lois;
		this.memory = json.memory;
	}

	rightSide (json) {
		const EFFECT_CHECK = ['', '自動', 'Dロイス等', 'イージー', '', 'エネミー'];
		
		this.effects = json.arts.map((effect) => {
			effect.check = EFFECT_CHECK[Number(effect.check)];
			return effect;
		});
		this.weapons = json.weapons.map((weapon) => {
			return {
				attack: Number(weapon.attack) || weapon.attack || 0,
				guard: Number(weapon.guard) || weapon.guard || 0,
				hit: Number(weapon.judge) || weapon.judge || 0,
				critical: 10,
				dice: this.skills[weapon.skill] ? this.status[(this.skills[weapon.skill]).status] : Math.max(this.status.body, this.status.sense),
				cost: 0,
				name: weapon.name,
				notes: weapon.notes,
				combination: '',
				target: '',
				range: weapon.range,
				skill: weapon.skill,
				exp: weapon.exp || 0,
				standing: weapon.standing || 0,
				type: '武器'
			};
		});
		json.combo.forEach((combo) => {
			const over = combo.over100;
			const under = combo.under100;
			this.weapons.push({
				attack: Number(under.attack) || under.attack || 0,
				guard: 0,
				hit: Number(under.judge) || under.judge || 0,
				critical: Number(under.critical) || under.ciritical || 10,
				dice: Number(under.dice) || under.dice || Math.max(this.status.body, this.status.sense),
				cost: Number(under.cost) || under.cost,
				name: `${combo.name} (100% 未満)`,
				notes: under.notes,
				combination: under.combination,
				target: under.target,
				range: under.range,
				skill: under.type,
				judge: under.judge,
				timing: under.timing,
				exp: 0,
				standing: 0,
				type: 'コンボ'
			});
			this.weapons.push({
				attack: Number(over.attack) || over.attack || 0,
				guard: 0,
				hit: Number(over.judge) || over.judge || 0,
				critical: Number(over.critical) || over.ciritical || 10,
				dice: Number(over.dice) || over.dice || Math.max(this.status.body, this.status.sense),
				cost: Number(over.cost) || over.cost,
				name: `${combo.name} (100% 以上)`,
				notes: over.notes,
				combination: over.combination,
				target: over.target,
				range: over.range,
				skill: over.type,
				judge: over.judge,
				timing: over.timing,
				exp: 0,
				standing: 0,
				type: 'コンボ'
			});
		});
		this.items = json.items.filter((item)=>{
			return item.name;
		}).map((item) => {
			item.count = 1;
			item.standing = Number(item.standing) || 0;
			return item;
		});
		this.armours = json.armours.filter((item)=>{return item.name;});
	}
};

io.github.shunshun94.trpg.characterSheetsMasashige.DX3.syndromeFilter = (syndromeMap) => {
	var result = [];
	if(syndromeMap.primary.syndrome) {
		result.push(syndromeMap.primary.syndrome);
	}
	if(syndromeMap.secondary.syndrome) {
		result.push(syndromeMap.secondary.syndrome);
	}
	if(syndromeMap.tertiary.syndrome) {
		result.push(syndromeMap.tertiary.syndrome);
	}
	return result;
};

io.github.shunshun94.trpg.characterSheetsMasashige.DX3.getSheet = function(url) {
	var promise = new $.Deferred;
	new io.github.shunshun94.trpg.characterSheetsMasashige.DX3(/key=(.*)/.exec(url)[1], function(instance) {
		promise.resolve(instance);
	});
	return promise;
};
