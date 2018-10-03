var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.discord = io.github.shunshun94.trpg.discord || {};

io.github.shunshun94.trpg.discord.generateClient = (token) => {
	const discord = new Discord.Client({
		  token: token,
		  autorun: true
	});
	return discord;
};

io.github.shunshun94.trpg.discord.generateRoomInfo = (rawData, memberList = {}, serverName='') => {
	var users = [];
	try {
		for(var userId in rawData.members) {
			users.push(memberList[userId].nick || memberList[userId].username);
		}
	} catch(e) {
		console.error(e, rawData, memberList);
	}
	return {
		canVisit: false,
		gameType: 'unsupported',
		lastUpdateTime: 'unsupported',
		playRoomName: `${rawData.name}${serverName ? ' @ ' : ''}${serverName}`,
		roomName: `${rawData.name}${serverName ? ' @ ' : ''}${serverName}`,
		loginUsers: users,
		passwordLockState: false,
		id: rawData.id,
		index: rawData.id,
		chatTab: ['メイン'],
		counter: [],
		game: 'unsupported',
		outerImage: true,
		visit: false,
		server: rawData.guild_id,
		result: 'OK'
	};
};

io.github.shunshun94.trpg.discord.generateRoomsInfo = (client, roomType = 0) => {
	var result = {
		result: 'OK',
		playRoomStates: []
	};
	
	for(var serverId in client.servers) {
		const server = client.servers[serverId];
		for(var channelId in server.channels) {
			var room = server.channels[channelId];
			if(room.type === roomType) {
				result.playRoomStates.push(
						io.github.shunshun94.trpg.discord.generateRoomInfo(room, server.members, server.name)
				);
			}	
		}
	}
	return result;
};

io.github.shunshun94.trpg.discord.flattenRoomList = (client, roomType = 0) => {
	var result = {};
	for(var serverId in client.servers) {
		const server = client.servers[serverId];
		for(var channelId in server.channels) {
			var room = server.channels[channelId];
			if(room.type === roomType) {
				result[channelId] = room;
			}	
		}
	}
	return result;
};

io.github.shunshun94.trpg.discord.Server = class extends io.github.shunshun94.trpg.ClientInterface.Server{
	constructor(token) {
		super();
		this.discord = io.github.shunshun94.trpg.discord.generateClient(token);
		this.token = token;
		this.platform = 'Discord';
	}
	
	getRoom (room, dummy, opt_dicebot) {
		const rooms = io.github.shunshun94.trpg.discord.generateRoomsInfo(this.discord).playRoomStates.map((r) => {
			return r.id;
		});
		return new io.github.shunshun94.trpg.discord.Room(this.token, rooms[room], opt_dicebot || dummy || false);
	}
	
	getRoomList () {
		return new Promise(function(resolve, reject){
			resolve(io.github.shunshun94.trpg.discord.generateRoomsInfo(this.discord));
		}.bind(this));
	}
};

io.github.shunshun94.trpg.discord.Room = class extends io.github.shunshun94.trpg.ClientInterface.Room {
	constructor (token, roomId, opt_dicebot) {
		super();
		this.discord = io.github.shunshun94.trpg.discord.generateClient(token);
		this.roomId = roomId;
		this.isVoiceActive = false;
		this.platform = 'Discord';

		this.dicebot = opt_dicebot || {rollDice: function(command) {
			return new Promise(function(resolve, reject) {
				resolve({ok: false, result: '',secret: false});
			});
		}};
		this.lastMsgId = 0
	}

	_getRoomInfo() {
		const list = io.github.shunshun94.trpg.discord.flattenRoomList(this.discord);
		return io.github.shunshun94.trpg.discord.flattenRoomList(this.discord)[this.roomId];
	}

	convertRawMessage(raw) {
		return raw.reverse().map((raw) => {
			return [
	        	Number(new Date(raw.timestamp)),
	        	{
	        		color: '000000',
	        		message: raw.content,
	        		senderName: raw.author.username,
	        		uniqueId: raw.id,
	        		channel: 0,
	        		metadata: {
	        			channel: raw.channel_id,
	        			senderId: raw.author.id
	        		}
	        	}
	        ];
		});
	}
	
	sendChat (args) {
		return new Promise(function(resolve, reject) {
			if(! Boolean(args.message)) {
				reject({result:'Necessary infomration is lacked.'});
				return;
			}
			this.dicebot.rollDice(args.message, args.bot).then(function(rollResult) {
				var msg = rollResult.ok ? `${args.message}\n${rollResult.result.substr(2)}` : args.message;
				if(args.name) {
					msg = '**' + args.name + '**: ' + msg;
				}
				this.discord.sendMessage({
					to: this.roomId, message: msg
				}, function(err, response) {
					if(err) {
						console.error(err);
						reject({result: err});
					} else {
						resolve({result: 'OK'});
					}
				});			
			}.bind(this),
			function(failed){
				console.error(failed);
				reject({result: failed});
			});
		}.bind(this));
	}
	
	getLatestChat (opt_to) {
		return new Promise((resolve, reject) => {
			this.discord.getMessages({
				channelID: this.roomId, limit: 100
			}, (err, array) => {
				if(err) {
					reject({result: err});
				} else {
					resolve({
						result: 'OK',
						chatMessageDataLog: this.convertRawMessage(array)
					});
				}
			});
		});
	}

	getChat (opt_from) {
		if(opt_from) {
			return new Promise((resolve, reject) => {
				this.discord.getMessages({
					channelID: this.roomId, after: opt_from, limit: 100
				}, (err, array) => {
					if(err) {
						reject({result: err});
					} else {
						resolve({
							result: 'OK',
							chatMessageDataLog: this.convertRawMessage(array)
						});
						if(array.length) {
							this.lastMsgId = array[0].id;
						}
					}
				});
			});
		} else {
			return this.getLatestChat();
		}
	}

	getRoomInfo () {
		return new Promise((resolve, reject) => {
			const room = this._getRoomInfo();
			resolve(io.github.shunshun94.trpg.discord.generateRoomInfo(room, this.discord.servers[room.guild_id].members));
		});
	}
	
	getId () {
		return new Promise((resolve, reject) => {
			resolve({uniqueId: this.discord.id});
		});
	}
	
	getUserList () {
		return new Promise((resolve, reject) => {
			var result = [];
			for(var id in this.discord.channels[this.roomId].members) {
				result.push({
					userId: id,
					userName: this.discord.users[id]
				});
			}
			resolve(result);
		});
	}

	showInitTable(tableString) {
		this.sendChat({message: `表形式で確認する\nhttps://shunshun94.github.io/shared/other/io/github/shunshun94/trpg/discord/initTable.html?${encodeURI(tableString)}`});
	}

	addCharacter(args = {}) {
		return new Promise((resolve, reject) => {
			if(! Boolean(args.name)) {
				reject({result:'addCharacter reuqires name as argument property.'});
				return;
			}
			this.getCharacters().then((result) => {
				if(result.result !== 'OK') {
					reject({
						result: `Failed to get current character list`, detail: result, args: args
					});
					return;
				}
				const isExist = result.characters.filter((c) => {return c.name === args.name});
				if(isExist.length) {
					reject({
						result: `キャラクターの追加に失敗しました。同じ名前のキャラクターがすでに存在しないか確認してください。`,
						detail: isExist, args: args
					});
					return;
				}
				let newCharacter = {counters:{}, type:'characterData'};
				for(var key in args) {
					if(key === 'targetName' || key==='counters'){ // SKIP
					}else if(io.github.shunshun94.trpg.discord.Room.CHARACTER_PARAMS.includes(key)) {
						newCharacter[key] = args[key];
					} else {
						newCharacter.counters[key] = args[key];
					}
				}
				result.characters.push(newCharacter);
				this.sendChat({message: 'Initiative Table\n```json\n' + JSON.stringify(result.characters) + '\n```'}).then(() => {
					resolve({
						result: 'OK',
						characters: result.characters
					});
					this.showInitTable(JSON.stringify(result.characters));
				}, (error) => {
					reject({
						result: error, args: args
					});
				});
			}, (error) => {
				reject({
					result: `Failed to get current character list`, detail: error, args: args
				})
			});
		});
	}
	
	updateCharacter(args) {
		return new Promise((resolve, reject) => {
			if(! Boolean(args.targetName)) {
				reject({result:'updateCharacter reuqires targetName as argument property.'});
				return;
			}
			this.getCharacters().then((result) => {
				if(result.result !== 'OK') {
					reject({
						result: `Failed to get current character list`, detail: result, args: args
					});
					return;
				}
				let index = -1;
				result.characters.forEach((c, i) => {
					if(c.name === args.targetName) {
						index = i;
					}
				});
				if(index === -1) {
					reject({
						result: `${args.targetName}は見つかりませんでした`, args: args
					});
					return;
				}
				for(var key in args) {
					if(key === 'targetName' || key==='counters'){ // SKIP
					}else if(io.github.shunshun94.trpg.discord.Room.CHARACTER_PARAMS.includes(key)) {
						result.characters[index][key] = args[key];
					} else {
						result.characters[index].counters[key] = args[key];
					}
				}
				this.sendChat({message: 'Initiative Table\n```json\n' + JSON.stringify(result.characters) + '\n```'}).then(() => {
					resolve({
						result: 'OK',
						characters: result.characters
					});
					this.showInitTable(JSON.stringify(result.characters));
				}, (error) => {
					reject({
						result: error
					});
				});
			}, (error) => {
				reject({
					result: `Failed to get current character list`, detail: error, args: args
				})
			});
		});
	}

	getCharacters() {
		return new Promise((resolve, reject) => {
			this.getLatestChat().then((getChatResult) => {
				const rawList = getChatResult.chatMessageDataLog.filter((msgData) => {
					return msgData[1].message.startsWith('Initiative Table\n```json');
				}).reverse();
				if(rawList.length === 0) {
					resolve({
						result: 'OK',
						characters: [],
						chatLogs: getChatResult.chatMessageDataLog
					});
					console.log('Could not find any initiative table data', getChatResult.chatMessageDataLog);
					return;
				}
				try {
					const result = JSON.parse(/Initiative Table```json(.*)```/.exec(rawList[0][1].message.replace(/\n/gm, ''))[1]);
					resolve({
						result: 'OK',
						characters: result
					});
				} catch(e) {
					reject({
						result: e
					});
				}
			}, (error) => {reject({
				result: error
			})});
		});
	}

	accessToVoiceChannel (channel = ''){
		return new Promise((resolve, reject)=>{
			if(this.isVoiceActive) {
				resolve(roomCandidate[0].id);
				return;
			}
			if(channel === '') {
				this.getRoomInfo().then((result)=>{
					const roomName = `${result.roomName} @`;
					const roomCandidate = io.github.shunshun94.trpg.discord.generateRoomsInfo(this.discord, 2).playRoomStates.filter((room)=>{
						return (result.server === room.server) && (room.roomName.startsWith(roomName)); 
					});
					if(roomCandidate.length) {
						this.discord.joinVoiceChannel(roomCandidate[0].id ,(error, result)=>{
							if(error) {
								console.error(`Couldn't access to ${roomCandidate[0].id} (${roomCandidate[0].roomName})`);
								reject(error);
							} else {
								resolve(roomCandidate[0].id);
								this.isVoiceActive = roomCandidate[0].id;
							}
						});
					} else {
						reject(`The voice channel is not found. Is the voice channel named "${result.roomName}" is exist in server?`);
					}
				}, (error)=>{
					reject(error);
				});
			} else {
				this.discord.joinVoiceChannel(channel ,(error, result)=>{
					if(error) {
						console.error(`Couldn't access to ${channel}`);
						reject(error);
					} else {
						resolve(roomCandidate[0].id);
						this.isVoiceActive = roomCandidate[0].id;
					}
				});
			}
		});

		
	}

	/**
	 * Be CAREFUL!! Library isn't supported this function.
	 */
	playBGM(path, msg) {
		return new Promise((resolve, reject)=>{
			this.accessToVoiceChannel().then((id)=>{
				this.discord.getAudioContext(id, (error, stream) =>{
					if(error) {
						console.error('Failed to getAudioContext', error);
						reject({
							result: 'failed', error: error
						});
						return;
					}
					fetch(path).then((response) => {
						console.log(response);
						return response.body;
					}).then((body)=>{
						console.log(body);
						return body.pipeThrough(new ReadableStream())
					}).then(rs => rs.pipeTo(stream));
				});
			}, (error)=>{
				console.error('Failed to accessToVoiceChannel', error);
				reject({
					result: 'failed', error: error
				});
			});
		});
	}
};

io.github.shunshun94.trpg.discord.Room.CHARACTER_PARAMS = [
	'name', 'targetName', 'info','x', 'y',
    'size', 'initiative',
    'rotation', 'image', 'dogTag', 'draggable', 'url'];
