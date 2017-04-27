var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.VampireBlood = com.hiyoko.VampireBlood || {};

com.hiyoko.VampireBlood.SW2 = function(id, opt_callback) {
	this.sendRequest(id).done(function(data) {
		this.basicParse(data);
		this.parseBaseStatus(data);
		this.parseMagics(data);
		this.parseWeapons(data);
		this.parseGuards(data);
		this.parseAccessories(data);
		if(opt_callback) {
			opt_callback(this);
		} else {
			console.log('input', data)
			console.log('output', this);
		}
	}.bind(this));
};

com.hiyoko.util.extend(com.hiyoko.VampireBlood.Client, com.hiyoko.VampireBlood.SW2);

com.hiyoko.VampireBlood.SW2.prototype.parseAccessories = function(json) {
	this.accessories = [];
	var sheetAccessoriesMaxCount = 15;
	for(var i = 1; i < sheetAccessoriesMaxCount; i++) {
		if(json['acce' + i + '_name']) {
			this.accessories.push({
				name: json['acce' + i + '_name'],
				note: json['acce' + i + '_memo']
			});
		}
	}
};

com.hiyoko.VampireBlood.SW2.prototype.parseGuards = function(json) {
	this.guards = ['armor', 'shield', 'shield2'].filter(function(v){
		return json[v + '_name'];
	}).map(function(v) {
		return {
			name: json[v + '_name'],
			guard: Number(json[v + '_bougo'] || 0),
			dodge: Number(json[v + '_kaihi'] || 0),
			note: json[v + '_memo']
		};
	}.bind(this));
	
	
};

com.hiyoko.VampireBlood.SW2.prototype.parseWeapons = function(json) {
	var names = json.arms_name;
	var ranks = json.arms_rank;
	var hands = json.arms_yoho;
	var notes = json.arms_memo;
	var cates = json.arms_cate;
	var rates = json.arms_iryoku;
	var crits = json.arms_critical;
	var dams = json.arms_damage;
	var hits = json.arms_hit;
	
	this.weapons = names.map(function(v, i) {
		return {
			name: v,
			rank: ranks[i], hand: hands[i], note: notes[i],
			category: cates[i],
			rate: Number(rates[i]), crit: Number(crits[i]),
			damage: Number(dams[i]), hit: Number(hits[i])
		};
	});
};

com.hiyoko.VampireBlood.SW2.prototype.parseMagics = function(json) {
	this.magic = com.hiyoko.util.filterMap(com.hiyoko.util.mapMap({
		'真語魔法': json.maryoku5,
		'操霊魔法': json.maryoku6, 
		'神聖魔法': json.maryoku7,
		'妖精魔法': json.maryoku8,
		'魔動機術': json.maryoku9,
		'召異魔法': json.maryoku17,
	}, function(value) {
		return Number(value);
	}), function(value) {
		return value;
	});
	
	if(this.magic['真語魔法'] && this.magic['操霊魔法']) {
		this.magic['深智魔法'] = this.magic['真語魔法'] > this.magic['操霊魔法'] ?
				this.magic['真語魔法'] : this.magic['操霊魔法'];
	}
};

com.hiyoko.VampireBlood.SW2.prototype.parseBaseStatus = function(json) {
	this.race = json.shuzoku_name;
	this.level = Number(json.lv);
	this.hp = Number(json.HP);
	this.mp = Number(json.MP);
	this.status = [json.NB1, json.NB2,
	               json.NB3, json.NB4,
	               json.NB5, json.NB6].map(function(v){return Number(v)});
	this.skills = com.hiyoko.util.filterMap(com.hiyoko.util.mapMap({
		'ファイター': json.V_GLv1, 'グラップラー': json.V_GLv2, 'フェンサー': json.V_GLv3, 'シューター': json.V_GLv4,
		'ソーサラー': json.V_GLv5, 'コンジャラー': json.V_GLv6, 'プリースト': json.V_GLv7,
		'フェアリーテイマー': json.V_GLv8, 'マギテック': json.V_GLv9, 'デーモンルーラー': json.V_GLv17,
		'スカウト': json.V_GLv10, 'レンジャー': json.V_GLv11, 'セージ': json.V_GLv12,
		'エンハンサー': json.V_GLv13 , 'バード': json.V_GLv14,
		'ライダー': json.V_GLv16,
		'アルケミスト': json.V_GLv15, 'ウォーリーダー': json.V_GLv18, 'ミスティック': json.V_GLv19, 'フィジカルマスター': json.V_GLv20
	}, function(value) {
		return Number(value);
	}), function(value) {
		return value;
	});
	
	this.dodge = json.kaihi;
	this.guard = json.bougo;
	this.mental = json.life_regist;
	this.physical = json.mental_regist;
};

com.hiyoko.VampireBlood.SW2.Status = ['器用', '敏捷',
                                      '筋力', '生命力',
                                      '知力', '精神力'];

com.hiyoko.VampireBlood.SW2.getSheet = function(id) {
	var promise = new $.Deferred;
	new com.hiyoko.VampireBlood.SW2(id, function(instance) {
		promise.resolve(instance);
	});
	return promise;
};
