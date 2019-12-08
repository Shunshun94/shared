const Discord = require('discord.io');
const token = process.argv[2]
const channels = process.argv[3].split(',');
const server = process.argv[4] || 'dummy';
const client = new Discord.Client({
	  token: token,
	  autorun: true
});

const convertRawMessage = (raw) => {
	return raw.reverse().map((raw) => {
		return [
        	Number(new Date(raw.timestamp)),
        	{
        		color: '000000',
        		message: raw.content,
        		senderName: (raw.author) ? raw.author.username : 'not_exist_user',
        		uniqueId: raw.id,
        		metadata: {
        			channel: raw.channel_id,
        			senderId: (raw.author) ? raw.author.id : 'not_exist_id'
        		},
        		url: `https://discordapp.com/channels/${raw.guild_id || server}/${raw.channel_id}/${raw.id}`
        	}
        ];
	});
}

const getChat = (channel, opt_from = 0) => {
	return new Promise((resolve, reject) => {
		getChatWithChannel(channel, opt_from).then((messages)=>{
			resolve({
				result: 'OK',
				chatMessageDataLog: messages.chatMessageDataLog
			});
		}, (error)=>{
			reject(error);
		});
	});
}

const getChatWithChannel = (channel, opt_from) => {
	if(opt_from) {
		return new Promise((resolve, reject) => {
			client.getMessages({
				channelID: channel, after: opt_from, limit: 100
			}, (err, array) => {
				if(err) {
					reject({result: err, channel: channel});
				} else {
					resolve({
						result: 'OK',
						chatMessageDataLog: convertRawMessage(array)
					});
				}
			});
		});
	} else {
		return getLatestChat(channel);
	}
}

const getLatestChat = (channel) => {
	return new Promise((resolve, reject) => {
		client.getMessages({
			channelID: channel, limit: 100
		}, (err, array) => {
			if(err) {
				reject({result: err});
			} else {
				resolve({
					result: 'OK',
					chatMessageDataLog: convertRawMessage(array)
				});
			}
		});
	});
}

const getAllLogOfChannel = (channel, from=1, currentArray=[], retry=5) => {
	return new Promise((resolve, reject)=>{
		getChat(channel, from).then((getChatResult)=>{
			if(getChatResult.result === 'OK') {
				if(getChatResult.chatMessageDataLog.length && getChatResult.chatMessageDataLog[0][0]) {
					const lastId = getChatResult.chatMessageDataLog.reverse()[0][1].uniqueId;
					getAllLogOfChannel(channel, lastId, currentArray.concat(getChatResult.chatMessageDataLog.reverse()), 5).then((result)=>{
						resolve(result);
					}, (err)=>{
						reject(err);
					});
				} else {
					resolve(currentArray);
				}
			} else {
				if(retry) {
					console.warn(`Failed to get log of [channel = ${channel}, from = ${from}, failedCount = ${6 - retry}]. Retry!`);
					getAllLogOfChannel(channel, from, currentArray, retry - 1).then((result)=>{
						resolve(result);
					}, (err)=>{
						reject(err);
					});
				} else {
					console.error(`Failed to get log of [channel = ${channel}, from = ${from}, failedCount = ${6 - retry}]`);
					reject(getChatResult);
				}
			}
		}, (failed)=>{
				if(retry) {
					getAllLogOfChannel(channel, from, currentArray, retry - 1).then((result)=>{
						resolve(result);
					}, (err)=>{
						reject(err);
					});
				} else {
					reject(failed);
				}
		});
	});
};

const getEachChannelLogs = (channels, logResult={}) => {
	console.warn(`App will get more ${channels.length} channels logs`);
	const channel = channels.shift();
	return new Promise((resolve, reject)=>{
		console.warn(`Getting ${channel}`);
		getAllLogOfChannel(channel).then((logs)=>{
			logResult[channel] = logs;
			if(channels.length) {
				getEachChannelLogs(channels, logResult).then((result)=>{
					resolve(result);
				}, (a, b, c)=>{
					reject(a, b, c);
				});
			} else {
				resolve(logResult);
			}
		}, (failed)=>{
			console.error(`failed to get channel = ${channel}`);
			console.error(channels);
			logResult[channel] = [];
			getEachChannelLogs(channels, logResult).then((result)=>{
				resolve(result);
			}, (a, b, c)=>{
				reject(a, b, c);
			});
		});
	});
};

setTimeout(()=>{
	let result = {};
	getEachChannelLogs(channels).then((r)=>{
		console.log(JSON.stringify(r));
	}, (err, r, channels)=>{
		console.log(JSON.stringify(r));
		console.error(err);
		console.error(channels.join(','));
	});
}, 3000);

