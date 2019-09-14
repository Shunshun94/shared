Vue.component('shared-map-context-menu-map', {
	props: ['x', 'y', 'config'],
	data: function() {
		return {
			consts: {
				backgroundImage: '背景画像の URL を入力してください'
			},
			defaultValue: {
				backgroundImage: '-'
			}
		}
	},
	template: `
	<div
		class="shared-map-context-menu-map"
		:style="generateContextMenuStyle()">
			
			<div @click="updateBackgroundImage('backgroundImage')">背景画像を変更する</div>
	</div>`,
	methods: {
		addCharacter: function() {
			this.$emit(`shared-map-context-menu-map-addCharacter`, this.character);
		},
		updateBackgroundImage: function(colomn) {
			const newValue = prompt(this.consts[colomn], this.config[colomn]);
			if(newValue !== null) {
				if(newValue === '') {
					newValue = this.defaultValue[colomn];
				}
				this.$emit(`shared-map-context-menu-map-updateConfig`, {
					key: colomn, value: newValue
				});
			}
		},
		generateContextMenuStyle: function(e) {
			return `
				left:${ this.x - 40 }px;
				top:${ this.y - 40 }px;
			`
		}
	}
});