var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ClientInterface = io.github.shunshun94.trpg.ClientInterface || {};

io.github.shunshun94.trpg.ClientInterface.Server = class  {
	getRoom (room, pass) {
		throw {
			result: 'getRoom is not supported',
			params: {room: room, pass: pass}
		}
	}

	getStress () {
		return new Promise(function(resolve, reject) {
			reject({result: 'getStress is not supported'})
		});
	}
	
	getDiceList () {
		return new Promise(function(resolve, reject) {
			reject({result: 'getDiceList is not supported'})
		});
	}
	
	getCardList () {
		return new Promise(function(resolve, reject) {
			reject({result: 'getCardList is not supported'})
		});
	}
	
	getRoomList () {
		return new Promise(function(resolve, reject) {
			reject({result: 'getRoomList is not supported'})
		});
	}
};

io.github.shunshun94.trpg.ClientInterface.Room = class {
	getRoomInfo () {
		return new Promise(function(resolve, reject) {
			reject({result: 'getRoomInfo is not supported'});
		});
	}
	getId () {
		return new Promise(function(resolve, reject) {
			reject({result: 'getId is not supported'});
		});
	}
	getUserList () {
		return new Promise(function(resolve, reject) {
			reject({result: 'getUserList is not supported'});
		});
	}
	getChat () {
		return new Promise(function(resolve, reject) {
			reject({result: 'getChat is not supported'});
		});
	}
	sendChat () {
		return new Promise(function(resolve, reject) {
			reject({result: 'sendChat is not supported'});
		});
	}
	playBGM () {
		return new Promise(function(resolve, reject) {
			reject({result: 'playBGM is not supported'});
		});
	}
	addMemo () {
		return new Promise(function(resolve, reject) {
			reject({result: 'addMemo is not supported'});
		});
	}
	updateMemo () {
		return new Promise(function(resolve, reject) {
			reject({result: 'updateMemo is not supported'});
		});
	}
	characterListUrlConverter () {
		return new Promise(function(resolve, reject) {
			reject({result: 'characterListUrlConverter is not supported'});
		});
	}
	getMap () {
		return new Promise(function(resolve, reject) {
			reject({result: 'getMap is not supported'});
		});
	}
	getCharacters () {
		return new Promise(function(resolve, reject) {
			reject({result: 'getCharacters is not supported'});
		});
	}
	updateCharacter () {
		return new Promise(function(resolve, reject) {
			reject({result: 'updateCharacter is not supported'});
		});
	}
	forceUpdateCharacter () {
		return new Promise(function(resolve, reject) {
			reject({result: 'forceUpdateCharacter is not supported'});
		});
	}
	addCharacter () {
		return new Promise(function(resolve, reject) {
			reject({result: 'addCharacter is not supported'});
		});
	}
	isExistUploadPicture () {
		return new Promise(function(resolve, reject) {
			reject({result: 'isExistUploadPicture is not supported'});
		});
	}
	uploadPicture () {
		return new Promise(function(resolve, reject) {
			reject({result: 'uploadPicture is not supported'});
		});
	}
	getImageUrl () {
		return new Promise(function(resolve, reject) {
			reject({result: 'getImageUrl is not supported'});
		});
	}
}

/*
 * jQuery Promise like interface
 * */
Promise.prototype.done = function(sucFunc) {this.then(sucFunc); return this;};
Promise.prototype.fail = function(failFunc) {this.catch(failFunc); return this;};
