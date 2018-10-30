const dicebot_item = Vue.component('dicebot-item', { 
	props: ['dicebot'],
	template: `<li><span @click="fireSelectEvent">{{dicebot.title}}</span>
<button @click="fireDeleteEvent">×</button></li>`,
	methods: {
		fireSelectEvent: function(){
			this.$emit('dicebot-item-select', this.dicebot);
		},
		fireDeleteEvent: function(){
			this.$emit('dicebot-item-delete', this.dicebot)
		}
	}
});