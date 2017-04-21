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
	// Result must be formatted by DodontoF Refresh format
	return this.getAsyncEvent('tofRoomRequest', {method: 'getMap'});
};

com.hiyoko.DodontoF.V2.Map.prototype.drawStarter = function() {
	var event = this.getMapStatus().done(function(result){
		console.log(result);
		var mapSize = this.getMaxSize(result);
		this.drawBackGroundLines(mapSize);
		this.drawBackGroundImage(result, mapSize);
	}.bind(this));
	
	this.fireEvent(event);
};

com.hiyoko.DodontoF.V2.Map.prototype.drawBackGroundImage = function(result, mapSize) {
	this.fireEvent(this.getAsyncEvent('tofRoomRequest', {method: 'getImageUrl', args:[result.mapData.imageSource]}).done(function(url) {
		this.$html.css({
			'background-image': 'url(' + url + ')',
			'background-position': (mapSize.min.x * this.size * -1) + 'px ' + (mapSize.min.y * this.size * -1) + 'px',
			'background-size': (mapSize.frame.x * this.size) + 'px ' + (mapSize.frame.y * this.size) + 'px',
			'background-repeat': 'no-repeat'
		});
	}.bind(this)));
};

com.hiyoko.DodontoF.V2.Map.prototype.drawBackGroundLines = function(mapSize) {
	var htmlText = com.hiyoko.util.format('<div class="%s-background-col"></div>', this.id);
	var $line;
	for(var i = 0; i < mapSize.size.y; i++) {
		$line = $(htmlText);
		for(var j = 0; j < mapSize.size.x; j++) {
			$line.append(com.hiyoko.util.format('<div class="%s-background-col-box"></div>', this.id));
		}
		this.$html.append($line);
	}
	this.getElementsByClass('background-col').css({
		'box-sizing': 'border-box',
		'height': this.size + 'px'
	});
	this.getElementsByClass('background-col-box').css({
		'box-sizing': 'border-box',
		'height': this.size + 'px',
		'width': this.size + 'px',
		'border': '1px black solid',
		'display': 'inline-block'
	});
	
	return this.getElementsByClass('background-col');
};

com.hiyoko.DodontoF.V2.Map.prototype.getMaxSize = function(result) {
	var xs = [0];
	var ys = [0];
	
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
		min: {x: com.hiyoko.util.min(xs), y: com.hiyoko.util.min(ys)},
		max: {x: com.hiyoko.util.max(xs), y: com.hiyoko.util.max(ys)},
		frame: {x: result.mapData.xMax, y: result.mapData.yMax},
		size: {
			x: com.hiyoko.util.max(xs) - com.hiyoko.util.min(xs),
			y: com.hiyoko.util.max(ys) - com.hiyoko.util.min(ys)
		}
	};
};

