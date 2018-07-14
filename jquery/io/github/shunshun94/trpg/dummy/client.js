var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.dummy = io.github.shunshun94.trpg.dummy || {};


io.github.shunshun94.trpg.dummy.Server = class extends io.github.shunshun94.trpg.ClientInterface.Server {
	constructor($dom, opts = {}) {
		super();
	}
	
	getRoomInfo(opt_requiredRoom = io.github.shunshun94.trpg.dummy.Server.SERVER_ROOM_DATA) {
		return new Promise((resolve, reject) => {
			resolve({
				result: 'OK',
				playRoomStates: opt_requiredRoom
			});
		})
	}
};

io.github.shunshun94.trpg.dummy.Server.SERVER_ROOM_DATA = [{
	canVisit: false,
	gameType: 'unsupported',
	lastUpdateTime: 'unsupported',
	playRoomName: 'RoomA',
	roomName: 'RoomA',
	loginUsers: [],
	passwordLockState: false,
	id: 0,
	result: 'OK',
	chatTab: ['メイン', '雑談', 'うちの子自慢'],
	counter: [],
	game: 'unsupported',
	outerImage: true,
	visit: false,
	result: 'OK'
},  {
	canVisit: false,
	gameType: 'unsupported',
	lastUpdateTime: 'unsupported',
	playRoomName: 'RoomB',
	roomName: 'RoomB',
	loginUsers: [],
	passwordLockState: false,
	id: 0,
	result: 'OK',
	chatTab: ['メイン'],
	counter: [],
	game: 'unsupported',
	outerImage: true,
	visit: false,
	result: 'OK'
}];

io.github.shunshun94.trpg.dummy.Room = class extends io.github.shunshun94.trpg.ClientInterface.Room {
	constructor($dom, opts = {}) {
		super();
		this.$html = $($dom);
		this.id = this.$html.attr('id') || this.generateRandomId();
		this.initiativeTable = {};
		this.tableColumn = []; 
		if(opts.dicebot) {
			if(opts.dicebot === true) {
				this.diceSystem = new io.github.shunshun94.trpg.dummy.DummyDiceSystem();
			} else if(this.isNumber_(opts.dicebot)) {
				this.diceSystem = {rollDice: function(command) {
					return new Promise(function(resolve, reject) {
						resolve({ok: true, result: ` \n→ ${opts.dicebot}`,secret: false});
					});
				}};
			} else {
				this.diceSystem = opts.dicebot;
			}
		}else if(opts.dice) {
			if(opts.dice === true) {
				this.diceSystem = new io.github.shunshun94.trpg.dummy.DummyDiceSystem();
			} else if(this.isNumber_(opts.dice)) {
				this.diceSystem = {rollDice: function(command) {
					return new Promise(function(resolve, reject) {
						resolve({ok: true, result: ` \n→ ${opts.dice}`,secret: false});
					});
				}};
			} else {
				this.diceSystem = opts.dice;
			}
		} else {
			this.diceSystem = {rollDice: function(command) {
				return new Promise(function(resolve, reject) {
					resolve({ok: false, result: '',secret: false});
				});
			}};
		}
		this.system = opts.system || false;
		console.log(this.diceSystem)
		this.$html.append(`<p class="${this.id}-chat" style="color:#000000">` +
				`<span class="${this.id}-chat-name">System</span>@channel<span class="${this.id}-chat-channel">0</span>: <span class="${this.id}-chat-message">オンセプラットフォームのモックです</span>` +
				` (<span class="${this.id}-chat-time">${Number(new Date()) + 1}</span>)</p>`);
		this.$html.append(`<p class="${this.id}-chat" style="color:#000000">` +
				`<span class="${this.id}-chat-name">System</span>@channel<span class="${this.id}-chat-channel">0</span>: <span class="${this.id}-chat-message">開始しました</span>` +
				` (<span class="${this.id}-chat-time">${Number(new Date())}</span>)</p>`);
	}
	
	generateRandomId() {
		var randomString = 'tmpClass-';
		const baseString ='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
		for(var i = 0; i < 17; i++) {
			randomString += baseString.charAt( Math.floor( Math.random() * baseString.length));
		}
		return randomString;
	}; 
	
	appendChat(args) {
		$(`.${this.id}-chat:first`).before(`<p class="${this.id}-chat" style="color:#${args.color || '000000'}">` +
				`<span class="${this.id}-chat-name">${args.name}</span>@channel<span class="${this.id}-chat-channel">${args.channel || 0}</span>: ` +
				`<span class="${this.id}-chat-message">${args.msg || args.message}</span>` +
				` (<span class="${this.id}-chat-time">${Number(new Date())}</span>)</p>`);
	}
	
	updateInitiative() {
		var str = '<tr><th>名前</th><th>イニシアティブ</th>';
		str += this.tableColumn.map((col) => {return `<th>${col}</th>`}).join('') + '</tr>';
		for(var name in this.initiativeTable) {
			str += `<tr><th>${name}</th><th>${this.initiativeTable[name].initiative}</th>`;
			str +=  this.tableColumn.map((col) => {return `<td>${this.initiativeTable[name].counters[col] || 0}</td>`}).join('');
			str += '</tr>';
		}
		$(`.${this.id}-chat:first`).before(`<p class="${this.id}-chat" style="color:#000000">` +
				`<span class="${this.id}-chat-name">System</span>@channel<span class="${this.id}-chat-channel">0</span>: ` +
				`<span class="${this.id}-chat-message">イニシアティブ表が更新されました</span>` +
				` (<span class="${this.id}-chat-time">${Number(new Date())}</span>)</p>` +
				`<table border="1">${str}</table>`);
	}

	getRoomInfo() {
		return new Promise((resolve, reject) => {resolve(io.github.shunshun94.trpg.dummy.Server.SERVER_ROOM_DATA[0])})
	}

	getChat(opt_from) {
		return new Promise((resolve, reject) => {
			var list = [];
			$(`.${this.id}-chat`).each((i, msg) => {
				const $msg = $(msg);
				const time = Number($msg.find(`.${this.id}-chat-time`).text());
				list.push([time, {
			        		color: $msg.css('color'),
			        		message: $msg.find(`.${this.id}-chat-message`).text(),
			        		senderName: $msg.find(`.${this.id}-chat-name`).text(),
			        		uniqueId: time,
			        		channel: Number($msg.find(`.${this.id}-chat-channel`).text()),
			        		metadata: {}
			        	}]);
			});
			if(opt_from) {
				resolve({
					result: 'OK',
					chatMessageDataLog: list.filter((msg) => {
						return opt_from < msg[0];
					}).reverse()
				});
			} else {
				resolve({result: 'OK',chatMessageDataLog: list.reverse()});
			}
		});
	}
	 
	sendChat (args) {
		return new Promise((resolve, reject) => {
			if(! (Boolean(args.message) && Boolean(args.name))) {
				reject({result:'name と message は必須です', args: args});
				return;
			}
			this.diceSystem.rollDice(args.message, args.bot || this.system).then((rollResult) => {
				args.msg = rollResult.ok ? `${args.message}\n${rollResult.result.substr(2)}` : args.message;
				this.appendChat(args);
				resolve({result: 'OK'});
			});
		});
	};
	
	dummyDiceSystem(msg) {
		const calcRegExpResult = /C\((.*)\)/.exec(msg);
		if(calcRegExpResult) {
			return `${msg}\n→ ${eval(calcRegExpResult[1])}`;
		} else {
			const value =  Math.floor(Math.random() * 43);
			if(value % 5 === 0) {
				return `${msg}\n→ ファンブル`;
			} else {
				return `${msg}\n→ ${value}`;
			}
		}
	}
	
	isNumber_ (num_candidate) {
		// http://aoking.hatenablog.jp/entry/20120217/1329452700
		if( typeof(num_candidate) !== 'number' && typeof(num_candidate) !== 'string' ) {
			return false;
		} else {
			return (num_candidate == parseFloat(num_candidate) && isFinite(num_candidate));
		}
	}
	
	numberlize_ (num_candidate, opt_default = 0) {
		return this.isNumber_(num_candidate) ? Number(num_candidate) : (opt_default);
	}
	
	convertCounters(string) {
		var result = {};
		if(string === '') {
			return result;
		}
		string.split(',').forEach(function(v) {
			var kv = v.split(':');
			result[kv[0]] = kv[1];
		});
		return result;
	};
	
	updateCharacter (args) {
		return new Promise((resolve, reject) => {
			if(! args.targetName) {
				reject({result:'targetName は必須です'});
				return;
			}
			if(! this.initiativeTable[args.targetName]) {
				reject({result:`${args.targetName} が見つかりません`});
				return;	
			}
			
			if(args.name && args.targetName !== args.name) {
				if(this.initiativeTable[args.name]) {
					reject({result:`既に ${args.name} はいます`});
					return;					
				} else {
					this.initiativeTable[args.name] = this.initiativeTable[args.targetName];
					delete this.initiativeTable[args.targetName];
				}
			}
			
			const name = args.name || args.targetName;
			delete args.targetName;
			
			for(var key in args) {
				if(io.github.shunshun94.trpg.dummy.Room.CHARACTER_PARAMS.includes(key)) {
					this.initiativeTable[name][key] = args[key];
				} else {
					this.initiativeTable[name].counters[key] = args[key];
					if(! this.tableColumn.includes(key)) {
						this.tableColumn.push(key);
					}
				}
			}
			this.updateInitiative();
			resolve({result:'OK'});
		});
	}
	
	addCharacter (args) {
		return new Promise((resolve, reject) => {
			if(! args.name) {
				reject({result:'name は必須です'});
				return;
			}
			if(this.initiativeTable[args.name]) {
				reject({result:`既に ${args.name} はいます`});
				return;
			}
			
			var data　= {
					type: 'characterData',
					name: args.name,
					size: 1,
					x: 0,
					y: 0,
					rotation: 0,
					dogTag: false,
					draggable: false,
					initiative: 0,
					imageName: 'https://shunshun94.github.io/manaT/images/default.png',
					counters: {}
			};
			
			for(var key in args) {
				if(io.github.shunshun94.trpg.dummy.Room.CHARACTER_PARAMS.includes(key)) {
					data[key] = args[key];
				} else {
					data.counters[key] = args[key];
					if(! this.tableColumn.includes(key)) {
						this.tableColumn.push(key);
					}
				}
			}
			
			this.initiativeTable[args.name] = data;
			this.updateInitiative();
			resolve({result:'OK'});
		});
	}

	getCharacters() {
		return new Promise((resolve, reject) => {
			var list = [];
			for(var name in this.initiativeTable) {
				list.push(this.initiativeTable[name]);
			}
			resolve({
				result: 'OK',
				characters: list,
				graveyard: []
			});
		});
	}
};

io.github.shunshun94.trpg.dummy.Room.CHARACTER_PARAMS = [
	'name', 'targetName', 'info','x', 'y', 
	'size', 'initiative',
    'rotation', 'image', 'dogTag', 'draggable',
    'isHide', 'url'];

io.github.shunshun94.trpg.dummy.DummyDiceSystem = class {
	constructor() {}
	
	rollDice(msg) {
		return new Promise(function(resolve, reject) {
			const calcRegExpResult = /C\((.*)\)/.exec(msg);
			if(calcRegExpResult) {
				resolve({ok: true, result: `\n → ${eval(calcRegExpResult[1])}`,secret: false});
			} else {
				const value =  Math.floor(Math.random() * 43);
				if(value % 5 === 0) {
					resolve({ok: true, result: `\n → ファンブル`,secret: false});
				} else {
					resolve({ok: true, result: `\n → ${value}`,secret: false});
				}
			}
		});
	}
};
