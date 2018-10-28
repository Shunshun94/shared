const savedDiceBots = localStorage.getItem('io-github-shunshun94-trpg-sample-discord-dicebot-dicebots');
const dicebots = savedDiceBots ? JSON.parse(savedDiceBots) : [dicebotGenerator()];
const diceBots = new Vue({
	el: '#dicebots-list',
	data: {
		dicebots: dicebots,
		dicebot: dicebots[0]
	},
	components: {
		dicebot_item, dicebot_editor
	},
	methods: {
		selectBot: function(val) {
			dicebots.forEach((bot, i)=>{
				if(bot.key === val.key) {
					this.dicebot = this.dicebots[i];
				}
			});
		},
		editBot: function(val) {
			 console.log(JSON.stringify(val, null, '  '));
		},
		addBot: function() {
			const key = com.hiyoko.util.rndString(6);
			this.dicebots.push({
				key: key,
				title: '新しいダイスボット',
				command: `newDiceBot_${key}`,
				dice: '2d6',
				tableRaw: [2,3,4,5,6,7,8,9,10,11,12].map((d)=>{return `${d}:出目${d}の時の結果`}).join('\n')
			});
		}
	}
});