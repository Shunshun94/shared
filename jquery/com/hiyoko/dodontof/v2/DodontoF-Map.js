var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.DodontoF = com.hiyoko.DodontoF || {};
com.hiyoko.DodontoF.V2 = com.hiyoko.DodontoF.V2 || {};

com.hiyoko.DodontoF.V2.Map = function($html, opt_options) {
	var options = opt_options || {};
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.base = com.hiyoko.DodontoF.V2.Map;
	
	this.size = options.size || 20;
	this.maxSize = options.maxSize || 0;
	
	this.drawStarter();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.DodontoF.V2.Map);

com.hiyoko.DodontoF.V2.Map.prototype.getMapStatus = function() {
	return this.getAsyncEvent('tofRoomRequest', {
		method: 'getMap'
	});
};

com.hiyoko.DodontoF.V2.Map.prototype.drawStarter = function() {
	var event = this.getMapStatus().done(function(result){
		console.log(result);
		var mapSize = this.getMaxSize(result);
		console.log(mapSize)
	}.bind(this));
	
	this.fireEvent(event);
};

com.hiyoko.DodontoF.V2.Map.prototype.getMaxSize = function(result) {
	var xs = [];
	var ys = [];
	
	xs.push(result.mapData.xMax);
	ys.push(result.mapData.yMax);
	
	result.characters.forEach(function(v) {
		if(v.type === 'characterData') {
			xs.push(v.x);
			xs.push(v.x + v.size);
			ys.push(v.y);
			ys.push(v.y + v.size);
		}
	});
	
	return {
		min: {
			x: com.hiyoko.util.min(xs),
			y: com.hiyoko.util.min(ys)
		},
		max: {
			x: com.hiyoko.util.max(xs),
			y: com.hiyoko.util.max(ys)
		},
		size: {
			x: com.hiyoko.util.max(xs) - com.hiyoko.util.min(xs),
			y: com.hiyoko.util.max(ys) - com.hiyoko.util.min(ys)
		}
	};
};

