Vue.component('shared-map-range', {
	props:['x', 'y', 'config'],
	data: function() {
		return {
			posX: 0,
			posY: 1
		}
	},
	template: `
	<div
		id="sharedMap-map-range"
		:style="position"
		@mousemove="onMouseMove">
		<shared-map-range-circle
			:range="Number(range)" :config="config"
			v-for="range in config.circledRanges.split(',')"		
		></shared-map-range-circle>

		<hr style="transform: rotate(0deg);"
			class="sharedMap-map-range-line"/>
		<hr style="transform: rotate(90deg);"
			class="sharedMap-map-range-line"/>
		<hr style="transform: rotate(180deg);"
			class="sharedMap-map-range-line"/>
		<hr style="transform: rotate(270deg);"
			class="sharedMap-map-range-line"/>

		<hr :style="lineAngle"
			class="sharedMap-map-range-line"/>

		<shared-map-range-marker
			:x="posX"
			:y="posY"
			:config="config"
		></shared-map-range-marker>
	</div>`,
	computed: {
		position: function() {
			return `
				left:${this.x * this.config.scale + 20}px;
				top:${this.y * this.config.scale + 20}px;`
		},
		lineAngle: function() {
			let angle = Math.atan(- this.posX / this.posY);
			if( this.posY >= 0 ) {
				angle += Math.PI / 2;
			} else {
				angle -= Math.PI / 2;
			}
			return `transform: rotate(${angle}rad);`;
		}
	},
	methods: {
		onMouseMove: function(e) {
			this.posX = e.layerX;
			this.posY = e.layerY;
		}
	}
});

Vue.component('shared-map-range-marker', {
	props:['x', 'y', 'config'],
	template: `
	<span
		class="sharedMap-map-range-text"
		:style="position"
	>{{ distance }}m</span>`,
	computed: {
		distance: function() {
			const length = Math.sqrt( Math.pow(this.x, 2) + Math.pow(this.y, 2) ) / this.config.scale;
			return (Math.round(length * 100)) / 100;
			
		},
		position: function() {
			return `
				left: ${this.x}px;
				top: ${this.y - 20}px;
			`;
		}
	}
});

Vue.component('shared-map-range-circle', {
	props:['range', 'config'],
	template: `
		<div :style="getStyle(range)" class="sharedMap-map-range-circle">
			<span :style="getScaleStyle(range)">{{range}}m</span>
		</div>
	`,
	methods: {
		getStyle: function(range) {
			return `
				width:${this.config.scale * range * 2}px;
				height:${this.config.scale * range * 2}px;
				border-radius:${this.config.scale * range}px;
				transform:translate(-${this.config.scale * range}px, -${this.config.scale * range}px);
			`;
		},
		getScaleStyle: function(range) {
			return `
				top:${this.config.scale * range}px;
			`;
		}
	}
});