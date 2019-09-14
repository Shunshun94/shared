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
		縮尺 <input
			type="range" min="1" max="100" :value="config.scale"
			title="scale"
			@change="updateConfig" />
		<hr/>
		背景画像 <input
			type="text"
			title="backgroundImage"
			:value="config.backgroundImage"
		 	@change="updateConfig" />
		<hr/>
		<a
			href="https://github.com/Shunshun94/shared/tree/master/vue/io/github/shunshun94/trpg/map"
			target="_blank"
		>ソースコード</a>
		
		
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
		}
	}
});