Vue.component('shared-map-character', {
	props: ['character'],
	template: `<span
		class="sharedMap-map-character"
		:style="style"
		draggable="true"
		@dragend="onDrop"
		@dblclick="onDblClick"
	><br/>{{character.name}}</span>`,
	computed: {
		style: function() {
			const color = sharedMapMapCharacterColorRegExp.test(this.character.color) ? `#${this.character.color}` : this.character.color;
			return `
				left:${ this.character.x * config.scale }px;
				top:${ this.character.y * config.scale }px;
				background-color:${ color };`
		}
	},
	methods: {
		onDrop: function(e) {
			this.$emit(`shared-map-map-character-move-character`, {
				name: this.character.name,
				x: (e.x - 60) / config.scale,
				y: (e.y - 60) / config.scale,
				color: this.character.color || 'C8C8C8'
			});
		},
		onDblClick: function(e) {
			this.$emit(`shared-map-map-character-dblclick-character`, this.character);
		}
	}
});

const sharedMapMapCharacterColorRegExp = /[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]?[0-9a-fA-F]?[0-9a-fA-F]?/;