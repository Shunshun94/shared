const dicebot_item = Vue.component('dicebot-item', { 
	props: ['dicebot'],
	template: `<li><span @click="fireSelectEvent">{{dicebot.title}}</span>
<button @click="$emit('dicebot-item-delete', this)">×</button></li>`,
	methods: {
		fireSelectEvent: function(){
			this.$emit('dicebot-item-select', this.dicebot);
		}
	}
});