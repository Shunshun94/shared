/**
 * http://www.dodontof.com/DodontoF/README.html#aboutWebIf
 * @fileoverview どどんとふを利用するクライアントです
 * @author @Shunshun94 (しゅんしゅんひよこ)
 */

var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.DodontoF = com.hiyoko.DodontoF || {};
com.hiyoko.DodontoF.V2 = com.hiyoko.DodontoF.V2 || {};

com.hiyoko.DodontoF.V2.versionName = 'あゆみ';

com.hiyoko.DodontoF.V2.Server = function(url) {
	this.url = com.hiyoko.DodontoF.V2.util.urlSuiter_(url);
};

com.hiyoko.DodontoF.V2.Room = function(url, room, opt_pass) {
	this.url = com.hiyoko.DodontoF.V2.util.urlSuiter_(url);
	this.base = {
			room: room,
			pass: opt_pass || ''
	};
};

(function(tofServer){
	tofServer.API_NAMES = {
			BUSY_INFO: 'getBusyInfo',
			SERVER_INFO: 'getServerInfo',
			ROOM_LIST: 'getRoomList'
	};
	
	tofServer.prototype.buildRequest_ = function(params) {
		var args = [];
		for(var key in params) {
			args.push(key + '=' + encodeURIComponent(params[key]));
		}
		return this.url + args.join('&');
	};
	
	tofServer.prototype.sendRequest_ = function(apiName, params, opt_additionalParams) {
		params.webif = apiName;
		return $.ajax({
			type:'get',
			url:this.buildRequest_(params),
			async:true,
			dataType:'jsonp'
		});
	};
	
	tofServer.prototype.getRoom = function(room, pass) {
		return new com.hiyoko.DodontoF.V2.Room(this.url, room, pass);
	};
	
	tofServer.prototype.getStress = function() {
		return this.sendRequest_(tofServer.API_NAMES.BUSY_INFO, {});
	};
	
	tofServer.prototype.getDiceList = function() {
		return this.sendRequest_(tofServer.API_NAMES.SERVER_INFO, {dice:true});
	};
	
	tofServer.prototype.getCardList = function() {
		return this.sendRequest_(tofServer.API_NAMES.SERVER_INFO, {card:true});
	};
	
	tofServer.prototype.getRoomList = function() {
		return this.sendRequest_(tofServer.API_NAMES.ROOM_LIST, {dice:true});
	};
	
})(com.hiyoko.DodontoF.V2.Server);

(function(tofRoom){
	tofRoom.API_NAMES = {
			LOGIN_INFO: 'getLoginInfo',
			LOGIN_USER_INFO: 'getLoginUserInfo',
			GET_CHAT: 'chat',
			SEND_CHAT: 'talk',
			CHAT_COLOR: 'getChatColor',
			ADD_CHARACTER: 'addCharacter',
			CHANGE_CHARACTER: 'changeCharacter',
			GET_ROOM_INFO: 'getRoomInfo',
			SET_ROOM_INFO: 'setRoomInfo',
			ADD_MEMO: 'addMemo',
			CHANGE_MEMO: 'changeMemo',
			REFRESH: 'refresh',
			GET_CHARACTER: 'refresh',
			GET_MAP: 'refresh',
			UPLOAD_IMAGE_DATA: 'uploadImageData'
	};
	
	tofRoom.CHARACTER_PARAMS = ['name', 'targetName', 'info','x', 'y',
	                            'size', 'inisiative',
	                            'rotation', 'image', 'dogTag', 'draggable',
	                            'isHide', 'url'];
	
	tofRoom.prototype.buildRequest_ = function(params) {
		var args = [];
		for(var key in params) {
			args.push(key + '=' + encodeURIComponent(params[key]));
		}
		args.push('room=' + this.base.room);
		args.push('password=' + this.base.pass);
		return this.url + args.join('&');
	};
	
	tofRoom.prototype.sendRequest_ = function(apiName, params, opt_additionalParams) {
		params.webif = apiName;
		return $.ajax({
			type:'get',
			url:this.buildRequest_(params),
			async:true,
			dataType:'jsonp'
		});
	};

	tofRoom.prototype.getRoomInfo = function() {
		return this.sendRequest_(tofRoom.API_NAMES.GET_ROOM_INFO, {});
	};
	
	tofRoom.prototype.getId = function() {
		return this.sendRequest_(tofRoom.API_NAMES.LOGIN_INFO, {});
	};
	
	tofRoom.prototype.getUserList = function(opt_name, opt_id) {
		var param = {};
		if(opt_name && opt_id) {
			param.name = opt_name;
			param.uniqueId = opt_id;
		}
		return this.sendRequest_(tofRoom.API_NAMES.LOGIN_USER_INGO, param);
	};
	
	tofRoom.prototype.getChat = function(opt_from) {
		var param = {};
		if(opt_from) {
			param.time = opt_from;
		} else {
			param.sec = 'all';
		}
		return this.sendRequest_(tofRoom.API_NAMES.GET_CHAT, param);
	};
	
	tofRoom.prototype.sendChat = function(args) {
		var promise = new $.Deferred;
		if(Boolean(args.name) && Boolean(args.message)) {
			this.sendRequest_(tofRoom.API_NAMES.SEND_CHAT, args)
			.done(function(r){
				if(r.result !== 'OK') {
					promise.reject(r);
				}
				promise.resolve(r);
			})
			.fail(function(r){
				promise.reject(r);
			});		
		} else {
			promise.reject({result:'Necessary infomration is lacked.'});
		}
		return promise;
	};
	
	tofRoom.prototype.playBGM = function(url, msg, opt_volume, opt_name) {
		var volume = opt_volume || '0.5';
		return this.sendChat({
			name: opt_name || com.hiyoko.DodontoF.V2.versionName,
			message: com.hiyoko.util.format('###CutInMovie###{' +
					'"source":"./image/defaultImageSet/pawn/pawnBlack.png",' +
					'"volume":%s,"message":"%s",' +
					'"cutInTag":"BGM","displaySeconds":0,"height":0,"isSoundLoop":true,' +
					'"soundSource":"%s",' +
					'"width":0,"position":"up,right","isTail":false}',
					volume, msg, url)
		});
	};
	
	tofRoom.prototype.addMemo = function(msg) {
		return this.sendRequest_(tofRoom.API_NAMES.ADD_MEMO, {message:msg});
	};
	
	tofRoom.prototype.updateMemo = function(msg, opt_id) {
		var updateMemoPromise = new $.Deferred; 
		if(opt_id) {
			this.sendRequest_(tofRoom.API_NAMES.CHANGE_MEMO, {message:msg, targetId: opt_id}).done(function(result){
				result.tofMethod = tofRoom.API_NAMES.CHANGE_MEMO;
				if(result.result === 'OK') {
					updateMemoPromise.resolve(result);
				} else {
					updateMemoPromise.reject(result);
				}
			}).fail(function(result){
				result.tofMethod = tofRoom.API_NAMES.CHANGE_MEMO;
				updateMemoPromise.reject(result);
			});
		} else {
			this.addMemo(msg).done(function(result){
				result.tofMethod = tofRoom.API_NAMES.ADD_MEMO;
				if(result.result === 'OK') {
					updateMemoPromise.resolve(result);
				} else {
					updateMemoPromise.reject(result);
				}
			}).fail(function(result){
				result.tofMethod = tofRoom.API_NAMES.ADD_MEMO;
				updateMemoPromise.reject(result);
			});
		}
		return updateMemoPromise.promise();
	};

	tofRoom.prototype.characterListUrlConverter = function(list) {
		return list.map(function(c){
			if(c.imageUrl) {
				c.imageUrl = com.hiyoko.DodontoF.V2.util.getImageUrl(c.imageUrl, this.url);
			}
			if(c.imageName) {
				c.imageName = com.hiyoko.DodontoF.V2.util.getImageUrl(c.imageName, this.url);
			}
			return c;
		}.bind(this));
	};
	
	tofRoom.prototype.getMap = function() {
		var result = new $.Deferred;
		this.sendRequest_(tofRoom.API_NAMES.GET_CHARACTER, {'characters':0, 'map':0}).done(function(r){
			if(r.result !== 'OK') {
				result.reject(r.result);
				return;
			} else {
				r.mapData.imageSource = com.hiyoko.DodontoF.V2.util.getImageUrl(r.mapData.imageSource, this.url);
				r.characters = this.characterListUrlConverter(r.characters);
				r.graveyard = this.characterListUrlConverter(r.graveyard);
				result.resolve(r);
			}
		}.bind(this)).fail(function(r){
			result.reject(r);
		});
		
		return result;
	};
	
	tofRoom.prototype.getCharacters = function() {
		var result = new $.Deferred;
		this.sendRequest_(tofRoom.API_NAMES.GET_CHARACTER, {'characters':0}).done(function(r){
			if(r.result !== 'OK') {
				result.reject(r);
				return;
			} else {
				r.characters = this.characterListUrlConverter(r.characters);
				r.graveyard = this.characterListUrlConverter(r.graveyard);
				result.resolve(r);
			}
		}.bind(this)).fail(function(r){
			result.reject(r);
		});
		return result;
	};
	
	tofRoom.prototype.convertTofCharacterDataToForceUpdateCharacterArg = function(target) {
		var result = {
			targetName: target.name, info: target.info, x: target.x, y: target.y,
			size: target.size, inisiative: target.inisiative,
			rotation: target.rotation, image: target.imageName,
			dogTag: target.dogTag, draggable: target.draggable,
			isHide: target.isHide
		};
		
		com.hiyoko.util.forEachMap(target.counters, function(v, k) {
			result[k] = v;
		});
		
		return result;
	};
	
	tofRoom.prototype.updateCharacter = function(args) {
		var result = new $.Deferred;
		if(! args.targetName) {
			result.reject({result:'updateCharacter reuqires targetName as argument property.'});
		}
		this.getCharacters().done(function(getCharactersResult){
			var target = getCharactersResult.characters.filter(function(v){
				return v.type === 'characterData' && v.name === args.targetName;
			}.bind(this))[0];
			if(! Boolean(target)) {
				result.reject({result:'Could not find targetName "' + args.targetName + '".'});
				return;
			}
			
			var baseData = this.convertTofCharacterDataToForceUpdateCharacterArg(target);
			com.hiyoko.util.forEachMap(args, function(v, k) {
				baseData[k] = v;
			});
			
			this.forceUpdateCharacter(baseData).done(function(r){
				result.resolve(r);
			}.bind(this)).fail(function(r){
				result.reject(r);
			}.bind(this))
		}.bind(this)).fail(function(msg){
			result.reject(msg);
		}.bind(this));
		return result;
	};
	
	tofRoom.prototype.forceUpdateCharacter = function(args) {
		var promise = new $.Deferred;
		if(! args.targetName) {
			promise.reject({result:'updateCharacter reuqires targetName as argument property.'});
		} else {
			var param = {};
			var counter = [];
			
			for(var key in args) {
				if(tofRoom.CHARACTER_PARAMS.includes(key)) {
					param[key] = args[key];
				} else {
					counter.push(key + ':' + args[key]);
				}
			}
			if(counter.length > 0) {
				param.counters = counter.join(',');
			}
			
			this.sendRequest_(tofRoom.API_NAMES.CHANGE_CHARACTER, param).done(function(result){
				result.tofMethod = tofRoom.API_NAMES.CHANGE_CHARACTER;
				result.data = args;
				if(result.result === 'OK') {
					promise.resolve(result);
				} else {
					promise.reject(result);
				}
			}).fail(function(result){
				result.tofMethod = tofRoom.API_NAMES.CHANGE_CHARACTER;
				promise.reject(result);
			});			
		}
		
		return promise;
	};
	
	tofRoom.prototype.addCharacter = function(args) {
		var promise = new $.Deferred;
		if(! args.name) {
			promise.reject({result:'addCharacter reuqires name as argument property.'});
		} else {
			var param = {};
			var counter = [];
			
			for(var key in args) {
				if(tofRoom.CHARACTER_PARAMS.includes(key)) {
					param[key] = args[key];
				} else {
					counter.push(key + ':' + args[key]);
				}
			}
			if(counter.length > 0) {
				param.counters = counter.join(',');
			}
			
			this.sendRequest_(tofRoom.API_NAMES.ADD_CHARACTER, param).done(function(result){
				result.tofMethod = tofRoom.API_NAMES.ADD_CHARACTER;
				result.data = args;
				if(result.result === 'OK') {
					promise.resolve(result);
				} else {
					promise.reject(result);
				}
			}).fail(function(result){
				result.tofMethod = tofRoom.API_NAMES.ADD_CHARACTER;
				promise.reject(result);
			});			
		}
		
		return promise;
	};

	tofRoom.prototype.sendRequestPost_ = function(data, opt_callback) {
		var url = this.url;
		if(opt_callback) {
			data.append('callback', opt_callback);
		}
		
		return $.ajax({
			url  : url,
			type : 'POST',
			data : data,
			async: false,
			cache       : false,
			contentType : false,
			processData : false
		});
	};
	
	tofRoom.prototype.isExistUploadPicture = function() {
		return this.sendRequest_(tofRoom.API_NAMES.UPLOAD_IMAGE_DATA, {});
	};

	tofRoom.prototype.uploadPicture = function(args) {
		var promise = new $.Deferred;
		
		this.isExistUploadPicture().done(function(validationResult) {
			if(validationResult.result.endsWith('is NOT found')) {
				promise.reject({result: '[ERROR] どどんとふ Ver.1.48.28 以降でなければこの機能は使えません'});
				return;
			}
			if(! Boolean(args.fileData)) {
				promise.reject({result: '[ERROR] 画像が指定されていません。', detail: 'args.fileData が指定されている必要があります。'});
				return;
			}
			
			var formData = new FormData();
			formData.append('webif', tofRoom.API_NAMES.UPLOAD_IMAGE_DATA);
			formData.append('fileData', args.fileData);
			formData.append('room', this.base.room);

			if(this.base.pass) {
				formData.append('password', this.base.pass);
			}
			
			if(args.smallImageData) {
				formData.append('smallImageData', args.smallImageData);
			}
			if(args.tags) {
				var tmp_tags = Array.isArray(args.tags) ? args.tags.join(' ') : args.tags;
				formData.append('tags', tmp_tags);
			}
			
			this.sendRequestPost_(formData).done(function(result) {
				result.tofMethod = tofRoom.API_NAMES.UPLOAD_IMAGE_DATA;
				result.sentData = {};
				for(var key in formData.keys()) {
					result.sentData[key] = formData.get(key);
				}
				promise.resolve(result);
			}).fail(function(result) {
				result = result || {};
				result.result = 'OK';
				result.tofMethod = tofRoom.API_NAMES.UPLOAD_IMAGE_DATA;
				result.sentData = {};
				for(var key in formData.keys()) {
					result.sentData[key] = formData.get(key);
				}
				promise.reject(result);
			});
		});
		
		return promise;
	};
	
	tofRoom.prototype.getImageUrl = function(url) {
		var promise = new $.Deferred;
		promise.resolve(com.hiyoko.DodontoF.V2.util.getImageUrl(url, this.url));
		return promise;
	};
})(com.hiyoko.DodontoF.V2.Room);

com.hiyoko.DodontoF.V2.RoomDummy = com.hiyoko.DodontoF.V2.RoomDummy || {};
com.hiyoko.DodontoF.V2.RoomDummy.getRoomInfo = function() {
	return new $.Deferred;
};

com.hiyoko.DodontoF.V2.util = com.hiyoko.DodontoF.V2.util || {};

com.hiyoko.DodontoF.V2.util.urlSuiter_ = function(url) {
	var swf = "DodontoF.swf";
	var rb = "DodontoFServer.rb?";
	if(url.indexOf(rb) === url.length - rb.length) {
		// DodontoF/DodontoFServer.rb?
		return url;
	}
	if(url.slice(-3) === ".rb") {
		// DodontoF/DodontoFServer.rb
		return url + "?";
	}
	if(url.indexOf(swf) === url.length - swf.length ) {
		// DodontoF/DodontoF.swf
		return url.replace(swf, rb);
	}
	if(url.slice(-1) === "/") {
		// DodontoF/DodontoF.swf
		return url + rb;
	}
	if(url.indexOf(swf + '?') !== -1) {
		// DodontoF/DodontoF.swf?loginInfo
		return url.split(swf)[0] + rb;
	}
	// DodontoF
	return url + "/" + rb;
};

com.hiyoko.DodontoF.V2.util.getImageUrl = function(picUrl, urlBase){
	if(picUrl.startsWith("http")){
		return picUrl;
	}
	if(picUrl.startsWith("../") || picUrl.startsWith("/")){
		return urlBase.replace("DodontoFServer.rb?", picUrl);				
	}
	if(picUrl.startsWith("./")){
		return urlBase.replace("DodontoFServer.rb?", picUrl.substring(1));		
	}
	return urlBase.replace("DodontoFServer.rb?", "/" + picUrl);
};
