var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.BCDiceAPIClient = function(url, opt_defaultSystem) {
	this.url = url + (url.endsWith('/') ? '' : '/');
	this.version = 'v1'
	this.system = {};
	
	var diceBot = opt_defaultSystem || 'DiceBot';
	
	this.getSystemInfo(diceBot).done(function(result){
		this.system = result.systeminfo;
		console.log('com.hiyoko.BCDiceAPIClient@' + url + ' is ready', this.system);
	}.bind(this)).fail(function(){
		this.isValid().done(function(){
			throw 'DiceBot (named ' + diceBot + ') is not found in ' + url;
		}).fail(function(){
			throw 'URL (' + url + ') should be invalid.';
		})
	}.bind(this));
	
};

com.hiyoko.BCDiceAPIClient.prototype.sendRequest = function(urlSuffix, args) {
	return $.ajax({
		type:'get',
		url: this.url + this.version + '/' + urlSuffix,
		data: args,
		async:true,
		dataType:'jsonp'
	});
};

com.hiyoko.BCDiceAPIClient.prototype.isValid = function() {
	var promise = new $.Deferred;
	this.getVersion().done(function(){
		promise.resolve();
	}).fail(function(){
		promise.reject();
	})
	return promise;
};

com.hiyoko.BCDiceAPIClient.prototype.setSystem = function(opt_system) {
	var system = opt_system || 'DiceBot';
	var promise = new $.Deferred;
	this.getSystemInfo(system).done(function(result){
		this.system = result.systeminfo;
		promise.resolve(this.system);
	}.bind(this)).fail(function(){
		promise.reject({ok: false, reason: 'System "' + system + '" is not found.'});
	});
	return promise;
};

com.hiyoko.BCDiceAPIClient.prototype.getVersion = function() {
	return this.sendRequest('version');
};

com.hiyoko.BCDiceAPIClient.prototype.getSystems = function() {
	return this.sendRequest('systems');
};

com.hiyoko.BCDiceAPIClient.prototype.getSystemInfo = function(opt_system) {
	if(opt_system) {
		return this.sendRequest('systeminfo', {system: opt_system});
	} else {
		var promise = new $.Deferred;
		promise.resolve(this.system);
		return promise;
	}
};

com.hiyoko.BCDiceAPIClient.prototype.rollDice = function(command, opt_system) {
	var promise = new $.Deferred;
	this.sendRequest('diceroll', {
		system: opt_system || this.system.gameType,
		command: command
	}).done(function(result) {
		promise.resolve(result);
	}).fail(function(result) {
		promise.resolve({
			ok: false,
			result: ': ' + command,
			secret: false
		})
	});
	
	return promise;
};
