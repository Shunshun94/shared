Vue.component('shared-map', {
	props:['data'],
	data: function() {
		return {
			contextMenuCharacter: {
				name: 'dummy', x:-50, y:-50, color: 'white'
			},
			dummyCharacter: {
				name: 'dummy', x:-50, y:-50, color: 'white'
			}
		}
	},
	template: `
	<div>
		<div id="sharedMap-map"
			@dblclick="onDoubleClickCharacter({x:-200, y:0})"
			@click="resetContextMenu()"
			:style="generateBackground()"
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
				v-on:shared-map-map-character-rightclick-character="onRightClickCharacter"
			></shared-map-character>
			<shared-map-context-menu-character
				:character="contextMenuCharacter"
				:config="data.config"
				v-on:shared-map-context-menu-character-characterDelete="onDeleteCharacter"
				v-on:shared-map-context-menu-character-characterUpdate="onMoveCharacter"
			></shared-map-context-menu-character>
		</div>
		<shared-map-menu
			:config="data.config"
			@shared-map-menu-update="updateFromMenu"
		></shared-map-menu>
	</div>	
	`,
	methods: {
		onReload: function(e) {
			let params = this.data.characters.filter((c)=>{
				return Boolean(c.name) || Boolean(c.x) || Boolean(c.y) || Boolean(c.color)
			}).map((c)=>{
				return `${c.name}=${c.x},${c.y},${c.color}`;
			});
			for(var key in this.data.config) {
				params.push(`${key}=${this.data.config[key]}`);
			}
			location.href = `${location.protocol}//${location.host}${location.pathname}?${params.join('&')}`;			
		},
		onMoveCharacter: function(e) {
			this.data.characters[Number(e.id)] = {
					name: e.name.trim(),
					x: Number(e.x || 0),
					y: Number(e.y || 0),
					color: e.color || 'C8C8C8'
			};
			this.onReload(e);

		},
		onDeleteCharacter: function(e) {
			this.data.characters[Number(e.id)] = {};
			this.onReload(e);
		},
		onRightClickCharacter: function(e) {
			this.contextMenuCharacter = this.data.characters[Number(e.id)]; 
		},
		onDoubleClickCharacter: function(e) {
			this.data.range.x = e.x;
			this.data.range.y = e.y;
		},
		resetContextMenu: function(e) {
			this.contextMenuCharacter = this.dummyCharacter;
		},
		updateFromMenu: function(e) {
			this.data.config[e.key] = e.value;
		},
		generateBackground: function(e) {
			if(this.data.config.backgroundImage !== '-') {
				return `background-image:url("${this.data.config.backgroundImage}");background-repeat:no-repeat;`;
			} else {
				return '';
			}
		}
	}
});

