var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.VampireBlood = com.hiyoko.VampireBlood || {};

com.hiyoko.VampireBlood.DX3 = class extends com.hiyoko.VampireBlood.Client {
	constructor (id, opt_callback) {
		super();
		this.sendRequest(id).done(function(data) {
			this.basicParse(json);
			this.leftSide(json);
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
			this.class1_name, this.class2_name, this.class3_name
		].filter((name) => {return name}).filter((name, i, self) => {return self.indexOf(name) === i});
		this.status = {
			body: json.NP1,　'肉体': json.NP1,
			mind: json.NP3,　'精神': json.NP3,
			sense: json.NP2,　'感覚': json.NP2,
			society: json.NP4,　'社会': json.NP4
		};
	}
};