Vue.component('shared-map-menu', {
	props:['config'],
	data: function() {
		return {
			isMenuActivated: false
		}
	},
	template: `
	<div id="sharedMap-menu">
		<div id="sharedMap-menu-toggle"
			@click="onToggleClick"
		>≡</div>
		<div id="sharedMap-menu-body"
			v-show="isMenuActivated">
		<div class="sharedMap-menu-body-notButton">縮尺 <input
			type="range" min="1" max="100" :value="config.scale"
			title="scale"
			@change="updateConfig" /></div>
		<div class="sharedMap-menu-body-notButton">背景画像 <input
			type="text"
			title="backgroundImage"
			:value="config.backgroundImage"
		 	@change="updateConfig" /></div>
		<hr/>
		<div class="sharedMap-menu-body-button" @click="addCharacter">キャラクターを追加する</div>
		<hr/>
		<div class="sharedMap-menu-body-notButton">
		<a
			href="https://github.com/Shunshun94/shared/tree/master/vue/io/github/shunshun94/trpg/map"
			target="_blank"
		>ソースコード</a></div>
		
		
		</div>
	</div>`,
	methods: {
		onToggleClick: function() {
			this.isMenuActivated = ! this.isMenuActivated;
		},
		updateConfig: function(e) {
			this.$emit(`shared-map-menu-update`, {
				key: e.target.title,
				value: e.target.value
			});
		},
		addCharacter: function(e) {
			this.$emit(`shared-map-menu-append-character`);
			this.isMenuActivated = false;
		}
	}
});