var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
var jQuery = jQuery || {};

io.github.shunshun94.trpg.CharacterManager = function($base, opt_eventHandlers) {
	this.$dom = $base[0] || $base;
	var handlers = opt_eventHandlers || {};
	this.platformHandler = handlers.platformHandler || io.github.shunshun94.trpg.TofHandler;
	this.sheetHandler = handlers.sheetHandler || io.github.shunshun94.trpg.HiyokoSheetHandler;
	this.sheetConverter = handlers.sheetConverter || io.github.shunshun94.trpg.sheetToPlatformConverter;
	
	if(! Boolean(handlers.sheetConverter)) {
		console.warn('In most systems, you should use your original sheetConverter.')
	}
};

io.github.shunshun94.trpg.CharacterManager.prototype.getCharacters = function(characters){
	return this.appendCharacters(characters);
};

io.github.shunshun94.trpg.CharacterManager.prototype.appendCharacters = function(characters){
	var self = this;
	if(! Array.isArray(characters)) {
		characters = [characters];
	}
	return new Promise(function(resolve, reject) {
		self.platformHandler.getCharacters(self.$dom).then(
			function(characterListFromPlatform) {
				var nameList = characterListFromPlatform.map(function(character) {
					return character.name;
				});
				console.log(nameList);
				Promise.all(characters.map(function(character) {
					return new Promise(function(characterResolve, characterReject) {
						self.sheetHandler.getSheet(self.$dom, character).then(
							function(characterData) {
								var cursor = nameList.indexOf(characterData.name);
								if(cursor !== -1) {
									var dataInPlatform = characterListFromPlatform[cursor];
									for(var key in dataInPlatform.counters) {
										characterData[key] = dataInPlatform.counters[key];
										characterData[key.toUpperCase()] = dataInPlatform.counters[key];
										characterData[key.toLowerCase()] = dataInPlatform.counters[key];
									}
									characterResolve(characterData);
								} else {
									self.platformHandler.appendCharacter(self.$dom, self.sheetConverter(characterData)).then(
										function(result) {
											characterResolve(characterData);
										} ,
										function(failed) {
											characterReject('Failed to append Character to platform. Reason ' + JSON.stringify(failed));
										});
								}
							},
							function(failed) {
								characterReject('Failed to get Character from sheet. Reason ' + JSON.stringify(err));
							});
					});
				})).then(resolve, reject);
			}, function(failed) {
				reject('Failed to get Character List in platform. Reason ' + JSON.stringify(failed));
			});
	});
	
	return Promise.all(characters.map(function(character) {
	}));
};

io.github.shunshun94.trpg.redirectPromise = function(promise, event) {
	promise.then(event.resolve, event.reject);
};

io.github.shunshun94.trpg.getAsyncEvent = function(type, values) {
	var existJQuery = Boolean(jQuery.fn)
	var evt;
	
	values.resolve = values.resolve || function(v){console.log('resolve dummy', v)};
	values.reject = values.reject || function(v){console.log('reject dummy', v)};
	
	if(existJQuery) { // Confirming jQuery is installed or not
		evt = new $.Event(type, values);
	} else {
		evt = new Event(io.github.shunshun94.trpg.HiyokoSheetHandler.EVENTS.REQUEST);
		for(var key in values) {
			evt[key] = values[key];
		}
	}
	return evt;
};

io.github.shunshun94.trpg.fireEvent = function($base, evt) {
	if(Boolean(jQuery.fn)) { // Confirming jQuery is installed or not
		jQuery($base).trigger(evt);
	} else {
		$base.dispatchEvent(evt);
	}
	return evt;
};

io.github.shunshun94.trpg.TofHandler = io.github.shunshun94.trpg.TofHandler || {};
io.github.shunshun94.trpg.TofHandler.EVENTS = {
		ROOM: 'tofRoomRequest'
};
io.github.shunshun94.trpg.TofHandler.getCharacters = function($base) {
	return new Promise(function(resolve, reject){
		var event = io.github.shunshun94.trpg.getAsyncEvent(io.github.shunshun94.trpg.TofHandler.EVENTS.ROOM, {method: 'getCharacters'});
		event.resolve = function(result) {resolve(result.characters.filter(function(char) {
			return char.type === 'characterData';
		}));};
		event.reject = reject;
		io.github.shunshun94.trpg.fireEvent($base, event);
	});
};
io.github.shunshun94.trpg.TofHandler.appendCharacter = function($base, values) {
	return new Promise(function(resolve, reject){
		var event = io.github.shunshun94.trpg.getAsyncEvent(io.github.shunshun94.trpg.TofHandler.EVENTS.ROOM,
			{method: 'addCharacter', args: [values]});
		event.resolve = resolve;
		event.reject = reject;
		io.github.shunshun94.trpg.fireEvent($base, event);
	});	
};

io.github.shunshun94.trpg.HiyokoSheetHandler = io.github.shunshun94.trpg.HiyokoSheetHandler || {};
io.github.shunshun94.trpg.HiyokoSheetHandler.EVENTS = {
		REQUEST: 'io-github-shunshun94-trpg-HiyokoSheetHandler-EVENTS-REQUEST'
};
io.github.shunshun94.trpg.HiyokoSheetHandler.getSheet = function($base, id) {
	return new Promise(function(resolve, reject) {
		var event = io.github.shunshun94.trpg.getAsyncEvent(io.github.shunshun94.trpg.HiyokoSheetHandler.EVENTS.REQUEST, {sheet:id});
		event.resolve = resolve;
		event.reject = reject;
		io.github.shunshun94.trpg.fireEvent($base, event);
	});
};

io.github.shunshun94.trpg.sheetToPlatformConverter = function(basedData) {
	return {
		name:basedData.name,
		HP: basedData.hp || basedData.HP,
		最大HP: basedData.mhp,
		MHP: basedData.mhp,
		MP: basedData.mp || basedData.MP,
		最大MP: basedData.mmp,
		MMP: basedData.mmp,
 		info:io.github.shunshun94.trpg.SIGNATURE
	};
};

io.github.shunshun94.trpg.SIGNATURE = 'io-github-shunshun94-trpg-resourcemanager';






