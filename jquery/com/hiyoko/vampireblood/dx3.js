var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.VampireBlood = com.hiyoko.VampireBlood || {};

com.hiyoko.VampireBlood.DX3 = class extends com.hiyoko.VampireBlood.Client {
	constructor (id, opt_callback) {
		super();
		this.sendRequest(id).done((data) => {
			this.basicParse(data);
			this.leftSide(data);
			this.rightSide(data);
			if(opt_callback) {
				opt_callback(this);
			} else {
				console.log('input', data)
				console.log('output', this);
			}
		});
	}
	
	leftSide (json) {
		this.codename = json.pc_codename;
		this.player = '';
		this.age = json.age;
		this.sex = json.sex;
		this.works = json.works_name; this.cover = json.cover_name;
		this.syndromes = [
			json.class1_name, json.class2_name, json.class3_name
		].filter((name) => {return name}).filter((name, i, self) => {return self.indexOf(name) === i});
		this.status = {
			body: json.NP1,　'肉体': json.NP1,
			mind: json.NP3,　'精神': json.NP3,
			sense: json.NP2,　'感覚': json.NP2,
			society: json.NP4,　'社会': json.NP4
		};
		this.skills = {
				'白兵': {status: 'body', lv: (Number(json.skill_tokugi[0]) || 0) + (Number(json.skill_sonota[0]) || 0)},
				'回避': {status: 'body', lv: (Number(json.skill_tokugi[1]) || 0) + (Number(json.skill_sonota[1]) || 0)},
				'射撃': {status: 'sense', lv: (Number(json.skill_tokugi[3]) || 0) + (Number(json.skill_sonota[3]) || 0)},
				'知覚': {status: 'sense', lv: (Number(json.skill_tokugi[4]) || 0) + (Number(json.skill_sonota[4]) || 0)},
				'RC': {status: 'mind', lv: (Number(json.skill_tokugi[6]) || 0) + (Number(json.skill_sonota[6]) || 0)},
				'意志': {status: 'mind', lv: (Number(json.skill_tokugi[7]) || 0) + (Number(json.skill_sonota[7]) || 0)},
				'交渉': {status: 'society', lv: (Number(json.skill_tokugi[9]) || 0) + (Number(json.skill_sonota[9]) || 0)},
				'調達': {status: 'society', lv: (Number(json.skill_tokugi[10]) || 0) + (Number(json.skill_sonota[10]) || 0)},
				'運転': {status: 'body', lv: 0 },
				'芸術': {status: 'sense', lv: 0},
				'知識': {status: 'sense', lv: 0},
				'情報': {status: 'society', lv: 0}
		};
		
		if(json.skill_tokugi[2]) {
			this.skills['運転:' + json.skill_memo[2]] = {
					status: 'body',
					lv: (Number(json.skill_tokugi[2]) || 0) + (Number(json.skill_sonota[2]) || 0)
			};
		}
		if(json.skill_tokugi[5]) {
			this.skills['芸術:' + json.skill_memo[5]] = {
					status: 'sense',
					lv: (Number(json.skill_tokugi[5]) || 0) + (Number(json.skill_sonota[5]) || 0)
			};
		}
		if(json.skill_tokugi[8]) {
			this.skills['知識:' + json.skill_memo[8]] = {
					status: 'mind',
					lv: (Number(json.skill_tokugi[8]) || 0) + (Number(json.skill_sonota[8]) || 0)
			};
		}
		if(json.skill_tokugi[11]) {
			this.skills['情報:' + json.skill_memo[11]] = {
					status: 'society',
					lv: (Number(json.skill_tokugi[11]) || 0) + (Number(json.skill_sonota[11]) || 0)
			};
		}
		
		const skillTableName = ['エラー:', '運転:', '芸術:', '知識:', '情報:'];
		const skillTableStatus = ['', 'body', 'sense', 'mind', 'society'];
		(json.skill_id || []).forEach((strId, i) => {
			const id = Number(strId) || 0;
			this.skills[skillTableName[id] + json.skill_memo[12 + i]] = {
					status: skillTableStatus[id],
					lv: (Number(json.skill_tokugi[12 + i]) || 0) + (Number(json.skill_sonota[12 + i]) || 0)
			};
		});
		this.subStatus = {
				HP: Number(json.NP5), hp: Number(json.NP5),
				MHP: Number(json.NP5), mhp: Number(json.NP5), 
				erotion: Number(json.NP6), '侵蝕率': Number(json.NP6),
				initialErotion: Number(json.NP6), '侵蝕率基本値': Number(json.NP6),
				speed: Number(json.NP7), '行動値': Number(json.NP7),
				standing: Number(json.money_point), '常備化ポイント': Number(json.money_point),
				property: Number(json.money_point) - Number(json.price_all_sum),
				'財産ポイント': Number(json.money_point) - Number(json.price_all_sum)
		};
		this.lois = [];
		json.roice_name.forEach((name, i) => {
			this.lois.push({
				name: name,
				Nfeel: json.roice_neg[i],
				Pfeel: json.roice_pos[i],
				tet: json.roice_memo[i]
			});
		});
	}

	rightSide (json) {
		this.effects = json.effect_name.map((name, i) => {
			return {
				check: json.effect_shozoku[i],
				cost: json.effect_cost[i],
				judge: json.effect_hantei[i],
				level: com.hiyoko.VampireBlood.DX3.convertEffectLevel(json.effect_lv[i]),
				limit: json.effect_page[i],
				name: name,
				notes: json.effect_memo[i],
				range: json.effect_range[i],
				target: json.effect_taisho[i],
				timing: json.effect_timing[i],
				type: null
			};
		});
		json.easyeffect_name.forEach((name, i) => {
			this.effects.push({
				check: 'イージー',
				cost: json.easyeffect_cost[i],
				judge: json.easyeffect_hantei[i],
				level: com.hiyoko.VampireBlood.DX3.convertEffectLevel(json.easyeffect_lv[i]),
				limit: json.easyeffect_page[i],
				name: name,
				notes: json.easyeffect_memo[i],
				range: json.easyeffect_range[i],
				target: json.easyeffect_taisho[i],
				timing: json.easyeffect_timing[i],
				type: null
			})
		});
		
		const WEAPON_SKILL = ['', '白兵', '射撃', 'RC', '運転', '交渉'];
		const REGEXP = {
			COST: new RegExp("[侵浸コ][蝕食ス][率値ト]?([0-9]+\\+?[0-9]?D?)"),
			CRIT: new RegExp("C値([0-9]+)|クリテ?ィ?カ?ル?値?([0-9]+)")
		};
		this.weapons = json.arms_name.map((name, i) => {
			const cost = (REGEXP.COST.exec(json.arms_sonota[i]) || [0,0])[1];
			const tmpCritical = (REGEXP.CRIT.exec(json.arms_sonota[i]) || [0,10]);
			const critical = tmpCritical[1] || tmpCritical[2];
			const diceAndHit = json.arms_hit[i].split(/r\+?-?/);
			return {
				attack: Number(json.arms_power[i]) || json.arms_power[i] || 0,
				guard: Number(json.arms_guard_level[i]) || json.arms_guard_level[i] || 0,
				hit: Number(diceAndHit[1]) || 0,
				critical: Number(critical),
				dice: Number(diceAndHit[0]) || 0,
				cost: Number(cost) || cost,
				name: name,
				notes: json.arms_sonota[i],
				combination: null,
				target: null,
				range: json.arms_range[i],
				skill: WEAPON_SKILL[Number(json.arms_hit_param[i])],
				exp: null,
				standing: Number(json.arms_price[i]) || json.arms_price[i] || 0,
				type: null
			};
		});
		
	}
};

com.hiyoko.VampireBlood.DX3.convertEffectLevel = (level) => {
	const num = Number(level);
	if(num > 9) {
		return num - 10;
	}
	if(num > 5) {
		return num - 5;
	}
	return num;
};

com.hiyoko.VampireBlood.DX3.getSheet = function(url) {
	var promise = new $.Deferred;
	new com.hiyoko.VampireBlood.DX3(/(\d+)$/.exec(url)[1], function(instance) {
		promise.resolve(instance);
	});
	return promise;
};