Vue.component('shared-map-character-append-window', {
	props: [],
	data: function() {
		return {
			name: '',
			x: 0, y: 0,
			color: 'lavender'
		}
	},
	template: `
	<div class="shared-map-character-append-window">
	名前：<input type="text" v-model="name" /><br/>
	色　：<input type="text" v-model="color" /><br/>
	<button style="background-color:lavender" @click="updateColor('lavender')">この色にする</button>
	<button style="background-color:coral" @click="updateColor('coral')">この色にする</button><br/>
	<button style="background-color:#e7e7eb" @click="updateColor('e7e7eb')">この色にする</button>
	<button style="background-color:#e4ab9b" @click="updateColor('e4ab9b')">この色にする</button>
	<br/><br/>
	右端からの距離：<input type="number" v-model="x" /><br/>
	上端からの距離：<input type="number" v-model="y" /><br/><br/>
	<button @click="addCharacter">キャラクターを追加する</button> <button @click="cancel">キャラクターの追加をやめる</button>
	</div>`,
	methods: {
		updateColor: function(newColor) {
			this.color = newColor;
		},
		addCharacter: function() {
			this.$emit(`shared-map-character-append-window-append-character`, {
				name: this.name,
				x: this.x, y:this.y,
				color: this.color
			});
		},
		cancel: function() {
			this.$emit(`shared-map-character-append-window-cancel`);
		}
	}
});

