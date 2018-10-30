const query = com.hiyoko.util.getQueries();
const savedDiceBots = localStorage.getItem('io-github-shunshun94-trpg-sample-discord-dicebot-dicebots');
let tokenList = JSON.parse(localStorage.getItem('io-github-shunshun94-trpg-discord-Entrance-Token-TokenList') || '[null]');
const dicebotsList = savedDiceBots ? JSON.parse(savedDiceBots) : [dicebotGenerator()];
const gettingDiceValueRE = /＞ (\d+)$/;

const diceBots = new Vue({
	el: '#dicebots',
	data: {
		dicebots: dicebotsList,
		dicebot: dicebotsList[0],
		discordBot: {
			client: null,
			token: query.token || query.url || localStorage.getItem('io-github-shunshun94-trpg-discord-entry-token') || tokenList.reverse()[0] || '',
			room: query.room || query.channel || '',
			dice: new com.hiyoko.BCDiceAPIClient('https://www2.taruki.com/bcdice-api/')
		},
		lastMessage: ''
	},
	methods: { 
		selectBot: function(val) {
			this.dicebots.forEach((bot, i)=>{
				if(bot.key === val.key) {
					this.dicebot = this.dicebots[i];
				}
			});
		},
		deleteBot: function(val) {
			if(this.dicebot.key === val.key) {
				alert(`「${val.title}」は今編集中なので消せません`);
				return;
			}
			if(confirm(`「${val.title}」を削除しますか?`)) {
				this.dicebots = this.dicebots.filter((bot, i)=>{
					return bot.key !== val.key;
				});
				this.updateStorage();
			}
		},
		editBotTitle: function(val) {
			this.dicebot.title = val;
			this.updateStorage();
		},
		editBotCommand: function(val) {
			this.dicebot.command = val;
			this.updateStorage();
		},
		editBotDice: function(val) {
			this.dicebot.dice = val;
			this.updateStorage();
		},
		editBotTableRaw: function(val) {
			 this.dicebot.tableRaw = val;
			 this.dicebot.table = generateDiceBotTable(val);
			 this.updateStorage();
		},
		editBotToken: function(val) {
			this.discordBot.token = val;
		},
		editBotRoom: function(val) {
			this.discordBot.room = val;
		},
		createBot: function() {
			this.discordBot.client = new io.github.shunshun94.trpg.discord.Room(this.discordBot.token, this.discordBot.room);
		},
		updateStorage: function() {
			localStorage.setItem(
				'io-github-shunshun94-trpg-sample-discord-dicebot-dicebots',
				JSON.stringify(this.dicebots)
			);
		},
		addBot: function() {
			const key = com.hiyoko.util.rndString(6);
			this.dicebots.push(dicebotGenerator({
				title: '新しいダイスボット',
				command: `newDiceBot_${key}`,
				dice: '2d6',
				tableRaw: [2,3,4,5,6,7,8,9,10,11,12].map((d)=>{return `${d}:出目${d}の時の結果`}).join('\n')
			}, key));
			this.updateStorage();
		},
		getBots: function(message) {
			return this.dicebots.filter((bot)=>{
				return message.startsWith(bot.command);
			});
		},
		rollDiceBots: function(retry = 3) {
			this.discordBot.client.getChat(this.lastMessage).then((result)=>{
				if(result.chatMessageDataLog.length === 0) {
					return;
				}
				this.lastMessage = result.chatMessageDataLog.reverse()[0][1].uniqueId;
				result.chatMessageDataLog.filter((msg)=>{
					return msg[1].metadata.senderId !== this.discordBot.client.discord.id;
				}).forEach((msg)=>{
					const bots = this.getBots(msg[1].message);
					if(bots.length) {
						bots.forEach((bot)=>{
							this.discordBot.dice.rollDice(bot.dice).then((result)=>{
								if(result.ok) {
									const execResult = gettingDiceValueRE.exec(result.result);
									const msg = `＞ ${bot.title} ${result.result}\n${bot.table[execResult[1]]}`;
									this.discordBot.client.sendChat({
										message: msg
									});
								} else {
									if(retry) {
										this.rollDiceBots(retry - 1);
									} else {
										console.error('取得に失敗', err);
									}
								}
							}, (err)=>{
								if(retry) {
									this.rollDiceBots(retry - 1);
								} else {
									console.error('取得に失敗', err);
								}
							});
						});
					}
				});
			}, (err)=>{
				if(retry) {
					this.rollDiceBots(retry - 1);
				} else {
					console.error('取得に失敗', err);
				}
			});
		}
	}
});

setInterval(()=>{
	if(diceBots.discordBot.client) {
		diceBots.rollDiceBots();
	}
}, 5000);


