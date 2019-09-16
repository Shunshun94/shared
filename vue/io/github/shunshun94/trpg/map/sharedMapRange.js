Vue.component('shared-map-range', {
	props:['x', 'y', 'config'],
	template: `
	<div id="sharedMap-map-range"  :style="getPosition()">
		<shared-map-range-circle
			:range="Number(range)" :config="config"
			v-for="range in config.circledRanges.split(',')"		
		></shared-map-range-circle>
		
		

	</div>`,
	methods: {
		getPosition: function() {
			return `
				left:${this.x * this.config.scale + 20}px;
				top:${this.y * this.config.scale + 20}px;`
		},
		getStyle: function(width) {
			return `
				left:${this.x * this.config.scale}px;
				top:${this.y * this.config.scale}px;
				height:${width * this.config.scale}px;
				width:${width * this.config.scale}px;
				border-radius:${(width/2) * this.config.scale}px;
				transform:translate(-${(width/2) * this.config.scale - 15}px, -${(width/2) * this.config.scale - 15}px);`;
		},
		getStyleInternal: function(width, outsideWidth) {
			return `
				left:${(outsideWidth / 2) * this.config.scale}px;
				top:${(outsideWidth / 2) * this.config.scale}px;
				height:${width * this.config.scale}px;
				width:${width * this.config.scale}px;
				border-radius:${(width/2) * this.config.scale}px;
				transform:translate(-${(width/2) * this.config.scale}px, -${(width/2) * this.config.scale}px);`;
		}
	}
});

Vue.component('shared-map-range-circle', {
	props:['range', 'config'],
	template: `
		<div :style="getStyle(range)" class="sharedMap-map-range-circle"></div>
	`,
	methods: {
		getStyle: function(range) {
			return `
				width:${this.config.scale * range * 2}px;
				height:${this.config.scale * range * 2}px;
				border-radius:${this.config.scale * range}px;
				transform:translate(-${this.config.scale * range}px, -${this.config.scale * range}px);
			`
		}
	}
});