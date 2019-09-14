Vue.component('shared-map-context-menu-character', {
	props: ['character', 'config'],
	data: function() {
		return {
			consts: {
				'name': '新しい名前を入力してください',
				'color': '新しい色を入力してください'
			}
		}
	},
	template: `
	<div
		class="shared-map-context-menu-character"
		:style="generateContextMenuStyle()">
		<div @click="onUpdateCharacter('name')">名前を変える</div>
		<div @click="onUpdateCharacter('color')">背景色を変える</div>
		<div @click="onDeleteCharacter">削除する</div>
	</div>`,
	methods: {
		onDeleteCharacter: function(e) {
			if(confirm(`${this.character.name}を削除します。よろしいですか？`)) {
				this.$emit(`shared-map-context-menu-character-characterDelete`, this.character);
			}
		},
		onUpdateCharacter: function(colomn) {
			const newValue = prompt(this.consts[colomn], this.character[colomn]);
			if(newValue !== null) {
				this.character[colomn] = newValue;
				this.$emit(`shared-map-context-menu-character-characterUpdate`, this.character);
			}
		},
		generateContextMenuStyle: function(e) {
			return `
				left:${ this.character.x * this.config.scale + 15 }px;
				top:${ this.character.y * this.config.scale + 15 }px;
			`
		}
	}
});