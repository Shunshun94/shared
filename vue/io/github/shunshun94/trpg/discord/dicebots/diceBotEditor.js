const dicebot_editor = Vue.component('dicebot-editor', {
	props: ['dicebot'],
	template: `<div class="dicebots-editor-editor">
		<div class="dicebots-editor-editor-header">
			<span>ダイスボット名</span>
				<input type="text" class="dicebots-editor-editor-title"
						v-bind:value="dicebot.title"
						@change="$emit('dicebots-editor-edited-title', $event.target.value)"
						/>
			<span>コマンド</span>
				<input type="text" class="dicebots-editor-editor-command"
						v-bind:value="dicebot.command" 
						@change="$emit('dicebots-editor-edited-command', $event.target.value)"
						/>
			<span>ダイス</span>
				<input type="text" class="dicebots--editoreditor-dice"
						v-bind:value="dicebot.dice" 
						@change="$emit('dicebots-editor-edited-dice', $event.target.value)"
						/>
		</div>
		<textarea class="dicebots-editor-editor-tableRaw"
			v-bind:value="dicebot.tableRaw"
			@change="$emit('dicebots-editor-edited-table-raw', $event.target.value)"></textarea>
	</div>`
});