var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.BCDiceAPIClient = function(url, opt_defaultSystem) {
	this.url = url + (url.endsWith('/') ? '' : '/');
	this.system = opt_defaultSystem || 'DiceBot';
	this.version = 'v1'
};

com.hiyoko.BCDiceAPIClient.prototype.setSystem = function(opt_system) {
	this.system = opt_system || 'DiceBot';
	return this.system;
};

com.hiyoko.BCDiceAPIClient.prototype.sendRequest = function(urlSuffix, args) {
	return $.ajax({
		type:'get',
		url: this.url + this.version + '/' + urlSuffix
		data: args,
		async:true,
		dataType:'jsonp'
	});
};


com.hiyoko.BCDiceAPIClient.prototype.getVersion = function() {
	
};

com.hiyoko.BCDiceAPIClient.prototype.getSystems = function() {};

com.hiyoko.BCDiceAPIClient.prototype.getSystemInfo = function() {};

com.hiyoko.BCDiceAPIClient.prototype.rollDice = function() {};
com.hiyoko.BCDiceAPIClient.prototype.rollOnset = function() {};

com.hiyoko.BCDiceAPIClient.prototype;
com.hiyoko.BCDiceAPIClient.prototype;
com.hiyoko.BCDiceAPIClient.prototype;
com.hiyoko.BCDiceAPIClient.prototype;
com.hiyoko.BCDiceAPIClient.prototype;