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
			v-show="isMenuActivated"
		>縮尺 <input
			type="range" min="1" max="100" :value="config.scale"
			@change="updateScale"></div>
	</div>`,
	methods: {
		onToggleClick: function() {
			this.isMenuActivated = ! this.isMenuActivated;
		},
		updateScale: function(e) {
			this.$emit(`shared-map-menu-update`, {
				key: 'scale',
				value: Number(e.target.value)
			});
		}
	}
});