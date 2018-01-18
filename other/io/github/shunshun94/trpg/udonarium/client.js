/**
 * skyway-sdk is required.
 * See also https://webrtc.ecl.ntt.com/js-tutorial.html
 */

var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.udonarium = io.github.shunshun94.trpg.udonarium || {};

io.github.shunshun94.trpg.udonarium.client = class  {
	constructor(apiKey, opt_targetPeerId, opt_debugLevel) {
		this.peer = new Peer({
			key: apiKey, debug: opt_debugLevel || 0
		});
		this.peerId = opt_targetPeerId || '';
		this.isConnected = false;
		this._eventBind();
		this.grepWord = '';
	}
	
	debugGrepWord(word) {
		this.grepWord = word;
		return this.grepWord;
	}
	
	connect(opt_targetPeerId) {
		if(this.isConnected) {
			return true;
		}
		
		if(this.peer.open) {
			this.connection = this.peer.connect(opt_targetPeerId || this.peerId, {
				serialization: 'binary'
			});
			
			this.connection.on('data', data => {
				const tmp = new Uint8Array(data.data);
				try {
					const text = JSON.stringify(msgpack.decode(tmp));
					if(this.grepWord.length === 0 || text.indexOf(this.grepWord) > -1) {
						//console.log(data);
						console.log('getData', data, text);						
					}
				} catch (e) {
					console.error(e);
					console.error('raw', data.data);
					console.error('raw as array', tmp);
				}
			});
			
			this.isConnected = true;
			return true;
		}
		console.warn('Connection with SkyWay server is not started. You cannot connect to room, please wait.');
		return false;
	}
	
	rndString(length) {
		var randomString = '';
		var baseString ='0123456789abcdefghijklmnopqrstuvwxyz';
		for(var i=0; i<length; i++) {
			randomString += baseString.charAt( Math.floor( Math.random() * baseString.length));
		}
		return randomString;
	}
	
	generateIdentifier() {
		return `${this.rndString(8)}-${this.rndString(4)}-${this.rndString(4)}-${this.rndString(4)}-${this.rndString(12)}`;
	}
	
	send(data, peers, opt_isRelay) {
		const isRelay = Boolean(opt_isRelay)
		const dataPack = {
				data:msgpack.encode(data),
				isRelay: isRelay,
				peers: peers
			};
		console.log('putData', dataPack, data);
		this.connection.send(dataPack);
	}
	
	sendChat(args) {
		return new Promise((resolve, reject) => {
			this.getAllPeerIds().then((peers) => {
				if(Boolean(args.name) && Boolean(args.message)) {
					var sendData = [{
					    "sendFrom":this.peer.id,
					    "sendTo":null,
					    "eventName":"BROADCAST_MESSAGE",
					    "data":{
					      "from":this.peer.id,
					      "name":args.name,
					      "text":args.message,
					      "timestamp":Number(new Date()),
					      "tag":"",
					      "imageIdentifier":"none_icon",
					      "responseIdentifier":"",
					      "tabIdentifier":"MainTab",
					      "identifier":this.generateIdentifier()
					    }
					}];
					this.send(sendData, peers);
					sendData = [{
						"sendFrom":this.peer.id,
						"sendTo":null,
						"eventName":"UPDATE_GAME_OBJECT",
						"data":{
							"aliasName":"chat",
							"identifier":"e840d42a-6a90-4383-8e76-30ba1775e0e5",
							"majorVersion":14,
							"minorVersion":0.7658240715525684,
							"syncData":{
								"value":args.message,
								"attributes":{
									"from":this.peer.id,
									"name":args.name,
									"timestamp":Number(new Date()),
									"imageIdentifier":"testCharacter_3_image"
								},
								"parentIdentifier":"MainTab",
								"majorIndex":11,
								"minorIndex":0.07925108010656268
							}
						}
					}];
					this.send(sendData, peers);
					resolve({result: 'OK'});
				} else {
					reject({result:'Necessary infomration are lacked. name and message are required.'});
				}
			}, reject)
		});
	}
	
	getAllPeerIds() {
		return new Promise((resolve, reject) => {
			try {
				this.peer.listAllPeers(peers => {
					resolve(peers);
				});
			} catch (e) {
				reject(e);
			}
		});
	}
	
	toString() {
		return '';
	}
	
	_eventBind() {
		this.peer.on('connection', connection => {
			console.log(connection);
		});
	}
};

io.github.shunshun94.trpg.udonarium.client.LOG_LEVEL = {
	NONE: 0, ERROR: 1, ERR: 1, WARN: 2, WARNING: 2, INFO: 3, TRACE: 3, DEBUG: 3, FULL: 3
};

