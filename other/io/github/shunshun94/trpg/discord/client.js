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

io.github.shunshun94.trpg.discord.generateRoomInfo = (rawData, memberList) => {
	var users = [];
	for(var userId in rawData.members) {
		users.push(memberList[userId].username);
	}
	return {
		canVisit: false,
		gameType: 'unsupported',
		lastUpdateTime: 'unsupported',
		playRoomName: rawData.name,
		loginUsers: users,
		passwordLockState: false,
		id: rawData.id,
		index: rawData.id
	};
};

io.github.shunshun94.trpg.discord.generateRoomsInfo = (client) => {
	var result = {
		result: 'OK',
		playRoomStates: []
	};
	for(var id in client.channels) {
		var room = client.channels[id];
		if(room.type === 0) {
			result.playRoomStates.push(
					io.github.shunshun94.trpg.discord.generateRoomInfo(room, client.users)
			);
		}
	}
	return result;
};

io.github.shunshun94.trpg.discord.Server = class extends io.github.shunshun94.trpg.ClientInterface.Server{
	constructor(token) {
		super();
		this.discord = io.github.shunshun94.trpg.discord.generateClient(token);
		this.token = token;
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
		this.dicebot = opt_dicebot || {rollDice: function(command) {
			return new Promise(function(resolve, reject) {
				resolve({ok: false, result: '',secret: false});
			});
		}};
	}
	
	sendChat (args) {
		return new Promise(function(resolve, reject) {
			if(! Boolean(args.message)) {
				reject({result:'Necessary infomration is lacked.'});
				return;
			}
			this.dicebot.rollDice(args.message).then(function(rollResult) {
				var msg = rollResult.ok ? `${args.message}\n${rollResult.result.substr(2)}` : args.message;
				if(args.name) {
					msg = args.name + ': ' + msg;
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
	
	getChat (opt_from) {
		return new Promise(function(resolve, reject) {
			this.discord.getMessages({
				channelID: this.roomId, after: (Number(opt_from) || 0) + 1
			}, function(err, array) {
				if(err) {
					reject({result: err});
				} else {
					resolve({
						result: 'OK',
						chatMessageDataLog: array.reverse().map((raw) => {
							return [
							        	Number(new Date(raw.timestamp)),
							        	{
							        		color: '000000',
							        		message: raw.content,
							        		senderName: raw.author.username,
							        		uniqueId: raw.id,
							        		metadata: {
							        			channel: raw.channel_id,
							        			senderId: raw.author.id
							        		}
							        	}
							        ];
						})
					});
				}
			});
		}.bind(this));
	}
	
	getRoomInfo () {
		return new Promise((resolve, reject) => {
			resolve(io.github.shunshun94.trpg.discord.generateRoomInfo(this.discord.channels[this.roomId], this.discord.users));
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
	
};