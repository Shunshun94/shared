const savedDiceBots = localStorage.getItem('io-github-shunshun94-trpg-sample-discord-dicebot-dicebots');
const diceBots = new Vue({
	el: '#dicebots-list',
	data: {
		dicebots: savedDiceBots ? JSON.parse(savedDiceBots) : [dicebotGenerator()]
	},
	components: {
		dicebot_item
	},
	methods: {
		selectBot: function(val) {
			console.log(val);
		},
		addBot: function() {
			this.dicebots.push({
				title: '新しいダイスボット',
				command: `newDiceBot_${com.hiyoko.util.rndString(6)}`,
				dice: '2d6',
				tableRaw: [2,3,4,5,6,7,8,9,10,11,12].map((d)=>{return `${d}:出目${d}の時の結果`}).join('\n')
			});
		}
	}
});