var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ytsheet = io.github.shunshun94.trpg.ytsheet || {};
io.github.shunshun94.trpg.ytsheet.ytsheetSW2_5 = class {
	constructor(url, callback = io.github.shunshun94.trpg.ytsheet.ytsheetSW2_5.defaultCallback) {
		this.sendRequest(url).done((data) => {
			this.name = data.characterName;
			
			callback(this, data);
		});
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