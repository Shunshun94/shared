/*
const diceBotEditor = new Vue({
	el: '#dicebots-editor',
	data: {
		title: '',
		command: '',
		dice: '',
		tableRaw: ''
	}
});*/

const dicebot_editor = Vue.component('dicebot-editor', {
	props: ['dicebot'],
	template: `<div class="dicebots-editor" @change="edited">
		<div class="dicebots-editor-header">
			<span>ダイスボット名</span><input type="text" class="dicebots-editor-title" v-bind:value="dicebot.title" />
			<span>コマンド</span><input type="text" class="dicebots-editor-command" v-bind:value="dicebot.command" />
			<span>ダイス</span><input type="text" class="dicebots-editor-command" v-bind:value="dicebot.dice" />
		</div>
		<textarea class="dicebots-editor-tableRaw" v-bind:value="dicebot.tableRaw"></textarea>
	</div>`,
	methods: {
		edited: function() {
			this.$emit('dicebot-edited', this.dicebot);
		}
	}
});