const savedDiceBots = localStorage.getItem('io-github-shunshun94-trpg-sample-discord-dicebot-dicebots');
const dicebotsList = savedDiceBots ? JSON.parse(savedDiceBots) : [dicebotGenerator()];
const diceBots = new Vue({
	el: '#dicebots-list',
	data: {
		dicebots: dicebotsList,
		dicebot: dicebotsList[0]
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
			this.dicebots = this.dicebots.filter((bot, i)=>{
				return bot.key !== val.key;
			});
		},
		editBotTitle: function(val) {
			this.dicebot.title = val;
		},
		editBotCommand: function(val) {
			this.dicebot.command = val;
		},
		editBotDice: function(val) {
			this.dicebot.dice = val;
		},
		editBotTableRaw: function(val) {
			 this.dicebot.tableRaw = val;
			 this.dicebot.table = generateDiceBotTable(val);
		},
		addBot: function() {
			const key = com.hiyoko.util.rndString(6);
			this.dicebots.push(dicebotGenerator({
				title: '新しいダイスボット',
				command: `newDiceBot_${key}`,
				dice: '2d6',
				tableRaw: [2,3,4,5,6,7,8,9,10,11,12].map((d)=>{return `${d}:出目${d}の時の結果`}).join('\n')
			}, key));
		}
	}
});