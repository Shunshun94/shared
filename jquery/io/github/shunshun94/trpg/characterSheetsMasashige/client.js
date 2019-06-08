var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.characterSheetsMasashige = io.github.shunshun94.trpg.characterSheetsMasashige || {};
io.github.shunshun94.trpg.characterSheetsMasashige.client = class  {
	constructor (system) {
		this.system = system;
	}
	
	basicParse(json) {
		this.name = json.base.name;
		this.title = json.base.name;
		this.id = json.id;
		this.memo = json.pc_making_memo;
	}
	
	sendRequest(id) {
		var promise = new $.Deferred;
		$.ajax({
			type:'get',
			url:`http://character-sheets.appspot.com/${this.system}/display?ajax=1&key=${id}`,
			async:true,
			dataType:'jsonp'
		}).done((result) => {
			result.id = id;
			promise.resolve(result);
		}).fail(promise.reject);
		return promise;
	}
};
