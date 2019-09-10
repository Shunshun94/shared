Vue.component('shared-map', {
	props:['data'],
	template: `
	<div>
		<div id="sharedMap-map"
			@dblclick="onDoubleClickCharacter({x:-200, y:0})"
		
		>
			<shared-map-range
				:x="data.range.x"
				:y="data.range.y"
				:config="data.config"
			></shared-map-range>
			<shared-map-character
				v-for="character in data.characters"
				:key="character.id"
				:character="character"
				:config="data.config"
				v-on:shared-map-map-character-move-character="onMoveCharacter"
				v-on:shared-map-map-character-dblclick-character="onDoubleClickCharacter"
			></shared-map-character>
		</div>
		<shared-map-menu
			:config="data.config"
			@shared-map-menu-update="updateFromMenu"
		></shared-map-menu>
	</div>	
	`,
	methods: {
		onMoveCharacter: function(e) {
			this.data.characters[Number(e.id)] = {
					name: e.name.trim(),
					x: Number(e.x || 0),
					y: Number(e.y || 0),
					color: e.color || 'C8C8C8'
			};
			let params = this.data.characters.map((c)=>{
				return `${c.name}=${c.x},${c.y},${c.color}`;
			});
			for(var key in this.data.config) {
				params.push(`${key}=${this.data.config[key]}`);
			}
			location.href = `${location.protocol}//${location.host}${location.pathname}?${params.join('&')}`;
		},
		onDoubleClickCharacter: function(e) {
			this.data.range.x = e.x;
			this.data.range.y = e.y;
		},
		updateFromMenu: function(e) {
			this.data.config[e.key] = e.value;
		}
	}
});

