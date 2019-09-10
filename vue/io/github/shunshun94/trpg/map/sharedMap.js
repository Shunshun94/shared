Vue.component('shared-map', {
	props:['data'],
	template: `
	<div>
		<div id="sharedMap-menu">めにゅー</div>
		<div id="sharedMap-map"
			@dblclick="onDoubleClickCharacter({x:-200, y:0})"
		
		>
			<shared-map-range
				:x="data.range.x"
				:y="data.range.y"
			></shared-map-range>
			<shared-map-character
				v-for="character in data.characters"
				:key="character.id"
				:character="character"
				v-on:shared-map-map-character-move-character="onMoveCharacter"
				v-on:shared-map-map-character-dblclick-character="onDoubleClickCharacter"
			></shared-map-character>
		</div>
	</div>	
	`,
	methods: {
		onMoveCharacter: function(e) {
			query[e.name.trim()] = `${e.x},${e.y},${e.color}`;
			let params = [];
			for(var key in query) {
				params.push(`${key}=${query[key]}`);
			}
			location.href = `${location.protocol}//${location.host}${location.pathname}?${params.join('&')}`;
		},
		onDoubleClickCharacter: function(e) {
			this.data.range.x = e.x;
			this.data.range.y = e.y;
		}
	}
});

