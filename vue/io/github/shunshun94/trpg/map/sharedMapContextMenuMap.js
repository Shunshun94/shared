Vue.component('shared-map-context-menu-map', {
	props: ['x', 'y', 'config'],
	data: function() {
		return {
			consts: {
				backgroundImage: '背景画像の URL を入力してください',
				circledRanges: '距離の目安となる円の半径を入力してください（半角数字、カンマ区切り）'
			},
			defaultValue: {
				backgroundImage: '-',
				circledRanges: '100,50,30,20,10,5,3'
			}
		}
	},
	template: `
	<div
		class="shared-map-context-menu-map"
		:style="generateContextMenuStyle()">
			<div @click="addCharacter">キャラクターを追加する</div>
			<div @click="updateConfig('backgroundImage')">背景画像を変更する</div>
			<div @click="updateConfig('circledRanges')">距離の目安を変更する</div>
	</div>`,
	methods: {
		addCharacter: function(e) {
			this.$emit(`shared-map-context-menu-map-add-character`);
			e.stopPropagation();
		},
		updateConfig: function(colomn) {
			let newValue = prompt(this.consts[colomn], this.config[colomn]);
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