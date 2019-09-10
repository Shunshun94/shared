Vue.component('shared-map-character', {
	props: ['character', 'config'],
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
				left:${ this.character.x * this.config.scale }px;
				top:${ this.character.y * this.config.scale }px;
				background-color:${ color };`
		}
	},
	methods: {
		onDrop: function(e) {
			this.$emit(`shared-map-map-character-move-character`, {
				name: this.character.name,
				x: (e.x - 60) / this.config.scale,
				y: (e.y - 60) / this.config.scale,
				color: this.character.color || 'C8C8C8',
				id: this.character.id
			});
		},
		onDblClick: function(e) {
			this.$emit(`shared-map-map-character-dblclick-character`, this.character);
			e.stopPropagation();
		}
	}
});

const sharedMapMapCharacterColorRegExp = /[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]?[0-9a-fA-F]?[0-9a-fA-F]?/;