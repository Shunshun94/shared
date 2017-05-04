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
	
	if(this.$html.css('position') === 'static') {
		this.$html.css('position', 'relative');
	}
	
	this.drawStarter();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.DodontoF.V2.Map);

com.hiyoko.DodontoF.V2.Map.prototype.getMapStatus = function() {
	// Result must be formatted by DodontoF Refresh format
	return this.getAsyncEvent('tofRoomRequest', {method: 'getMap'});
};

com.hiyoko.DodontoF.V2.Map.prototype.drawStarter = function(opt_callback) {
	var event = this.getMapStatus().done(function(result){
		var objects = this.buildObjects(result);
		var mapSize = this.getMaxSize(result, objects);
		this.drawBackGroundLines(mapSize);
		this.drawBackGroundImage(result, mapSize);
		this.drawObjects(objects, mapSize);
		if(opt_callback) {
			opt_callback(objects, mapSize);
		}
	}.bind(this));
	
	this.fireEvent(event);
};

com.hiyoko.DodontoF.V2.Map.prototype.drawObjects = function(objects, mapSize) {
	com.hiyoko.DodontoF.V2.Map.Object.Layer.filter(function(key) {
		return objects[key];
	}).forEach(function(key) {
		objects[key].forEach(function(object){
			var pos = object.getPosition();
			var size = object.getSize();
			var $object = object.getElement();
			$object.css({
				'height': (this.size * size.x) + 'px',
				'width': (this.size * size.y) + 'px',
				'left': (this.size * (pos.min.x + mapSize.min.x * -1 )) + 'px',
				'top': (this.size * (pos.min.y + mapSize.min.y * -1 )) + 'px',
			});
			this.$html.append($object);
		}.bind(this));
	}.bind(this));	
};

com.hiyoko.DodontoF.V2.Map.prototype.buildObjects = function(result) {
	var objects = com.hiyoko.util.groupArray(result.characters, function(c){return c.type});
	var results = {};
	com.hiyoko.util.forEachMap(com.hiyoko.util.filterMap(objects,
		function(list, key) {
			return com.hiyoko.DodontoF.V2.Map.Object[key];
	}), function(list, key) {
			results[key] =list.map(function(data) {
				return new com.hiyoko.DodontoF.V2.Map.Object[key](data);
			}.bind(this));
	}.bind(this));
	return results;
};

com.hiyoko.DodontoF.V2.Map.prototype.drawBackGroundImage = function(result, mapSize) {
	this.$html.css({
		'background-image': 'url(' + result.mapData.imageSource + ')',
		'background-position': (mapSize.min.x * this.size * -1) + 'px ' + (mapSize.min.y * this.size * -1) + 'px',
		'background-size': (mapSize.frame.x * this.size) + 'px ' + (mapSize.frame.y * this.size) + 'px',
		'background-repeat': 'no-repeat'
	});
};

com.hiyoko.DodontoF.V2.Map.prototype.drawBackGroundLines = function(mapSize) {
	var htmlText = com.hiyoko.util.format('<div class="%s-background-col"></div>', this.id);
	var $line;
	for(var i = 0; i < mapSize.size.y; i++) {
		$line = $(htmlText);
		for(var j = 0; j < mapSize.size.x; j++) {
			$line.append(com.hiyoko.util.format('<div class="%s-background-col-box" id="%s-background-col-box-%s-%s"></div>',
					this.id, this.id, i, j));
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

com.hiyoko.DodontoF.V2.Map.prototype.getMaxSize = function(result, objects) {
	var xs = [0];
	var ys = [0];
	
	xs.push(result.mapData.xMax);
	ys.push(result.mapData.yMax);
	
	com.hiyoko.util.forEachMap(objects, function(objectList, objectType) {
		objectList.forEach(function(object) {
			var pos = object.getPosition();
			xs.push(pos.min.x); xs.push(pos.max.x);
			ys.push(pos.min.y); ys.push(pos.max.y);
		});
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

com.hiyoko.DodontoF.V2.Map.Object = function(data) {};
com.hiyoko.DodontoF.V2.Map.Object.prototype.getElement = function() {return this.$dom;};
com.hiyoko.DodontoF.V2.Map.Object.prototype.getPosition = function() {return this.position;};
com.hiyoko.DodontoF.V2.Map.Object.prototype.getSize = function() {return this.size;};
com.hiyoko.DodontoF.V2.Map.Object.prototype.getText = function() {return this.name;};
com.hiyoko.DodontoF.V2.Map.Object.prototype.getName = function() {return this.name;};

com.hiyoko.DodontoF.V2.Map.Object.characterData = function(data, opt_class) {
	this.name = data.name;
	this.size = {x: data.size, y: data.size};
	this.position = {
		min: {x: data.x, y: data.y},
		max: {x: data.x + data.size, y: data.y + data.size}
	};
	this.$dom = $(com.hiyoko.util.format('<div class="%s"></div>', 'com-hiyoko-dodontof-map-object com-hiyoko-dodontof-map-object-characterData'));
	this.$dom.css({
		'box-sizing': 'border-box',
		'background-image': 'url(' + data.imageName + ')',
		'background-repeat': 'no-repeat',
		'background-size': 'contain',
		'background-position': 'center center',
		'position': 'absolute'
	});
	if(opt_class) {
		this.$dom.addClass(opt_class);
	}

};
com.hiyoko.util.extend(com.hiyoko.DodontoF.V2.Map.Object, com.hiyoko.DodontoF.V2.Map.Object.characterData);

com.hiyoko.DodontoF.V2.Map.Object.mapMask = function(data, opt_class) {
	this.name = data.name;
	this.size = {x: data.height, y: data.width};
	this.position = {
		min: {x: data.x, y: data.y},
		max: {x: data.x + this.size.y, y: data.y + this.size.x}
	};
	this.$dom = $(com.hiyoko.util.format('<div class="%s"></div>', 'com-hiyoko-dodontof-map-object com-hiyoko-dodontof-map-object-mapMask'));
	this.$dom.css({
		'box-sizing': 'border-box',
		'background-color': com.hiyoko.util.intToColor(data.color),
		"opacity": data.alpha,
		'position': 'absolute',
		'border': '3px yellow solid',
		'text-align': 'center'
	});
	this.$dom.text(this.name);
	if(opt_class) {
		this.$dom.addClass(opt_class);
	}

};
com.hiyoko.util.extend(com.hiyoko.DodontoF.V2.Map.Object, com.hiyoko.DodontoF.V2.Map.Object.mapMask);

com.hiyoko.DodontoF.V2.Map.Object.mapMarker = function(data, opt_class) {
	this.name = data.message;
	this.size = {x: data.height, y: data.width};
	this.position = {
		min: {x: data.x, y: data.y},
		max: {x: data.x + this.size.y, y: data.y + this.size.x}
	};
	this.$dom = $(com.hiyoko.util.format('<div class="%s"></div>', 'com-hiyoko-dodontof-map-object com-hiyoko-dodontof-map-object-mapMarker'));
	this.$dom.css({
		'box-sizing': 'border-box',
		'background-color': data.isPaint ? com.hiyoko.util.intToColor(data.color) : 'transparent',
		'position': 'absolute',
		'border': '3px solid ' + com.hiyoko.util.intToColor(data.color),
		'text-align': 'center'
	});
	this.$dom.text(this.name);
	if(opt_class) {
		this.$dom.addClass(opt_class);
	}

};
com.hiyoko.util.extend(com.hiyoko.DodontoF.V2.Map.Object, com.hiyoko.DodontoF.V2.Map.Object.mapMarker);

com.hiyoko.DodontoF.V2.Map.Object.diceSymbol = function(data, opt_class) {
	this.name = data.number + '/' + data.maxNumber;
	this.size = {x: 1, y: 1};
	this.position = {
		min: {x: data.x, y: data.y},
		max: {x: data.x + 1, y: data.y + 1}
	};
	this.$dom = $(com.hiyoko.util.format('<div class="%s"></div>', 'com-hiyoko-dodontof-map-object com-hiyoko-dodontof-map-object-diceSymbol'));
	this.$dom.css({
		'box-sizing': 'border-box',
		'background-color': data.owner ? 'gray' : 'white',
		'color': data.owner ? 'white' : 'black',
		'position': 'absolute',
		"opacity": '0.8',
		'text-align': 'center'
	});
	this.$dom.text(data.owner ? '？' : data.number);
	if(opt_class) {
		this.$dom.addClass(opt_class);
	}

};
com.hiyoko.util.extend(com.hiyoko.DodontoF.V2.Map.Object, com.hiyoko.DodontoF.V2.Map.Object.diceSymbol);

com.hiyoko.DodontoF.V2.Map.Object.floorTile = function(data, opt_class) {
	this.name = '';
	this.size = {x: data.height, y: data.width};
	this.position = {
		min: {x: data.x, y: data.y},
		max: {x: data.x + this.size.y, y: data.y + this.size.x}
	};
	this.$dom = $(com.hiyoko.util.format('<div class="%s"></div>', 'com-hiyoko-dodontof-map-object com-hiyoko-dodontof-map-object-floorTile'));
	this.$dom.css({
		'box-sizing': 'border-box',
		'background-image': 'url(' + data.imageUrl + ')',
		'background-repeat': 'no-repeat',
		'background-size': '100% 100%',
		'background-position': 'center center',
		'position': 'absolute'
	});
	if(opt_class) {
		this.$dom.addClass(opt_class);
	}

};
com.hiyoko.util.extend(com.hiyoko.DodontoF.V2.Map.Object, com.hiyoko.DodontoF.V2.Map.Object.floorTile);

com.hiyoko.DodontoF.V2.Map.Object.chit = function(data, opt_class) {
	this.name = '';
	this.size = {x: data.height, y: data.width};
	this.position = {
		min: {x: data.x, y: data.y},
		max: {x: data.x + this.size.y, y: data.y + this.size.x}
	};
	this.$dom = $(com.hiyoko.util.format('<div class="%s"></div>', 'com-hiyoko-dodontof-map-object com-hiyoko-dodontof-map-object-chit'));
	this.$dom.css({
		'box-sizing': 'border-box',
		'background-image': 'url(' + data.imageUrl + ')',
		'background-repeat': 'no-repeat',
		'background-size': 'contain',
		'background-position': 'center center',
		'border': '3px solid #CCCCFF',
		'position': 'absolute'
	});
	if(opt_class) {
		this.$dom.addClass(opt_class);
	}

};
com.hiyoko.util.extend(com.hiyoko.DodontoF.V2.Map.Object, com.hiyoko.DodontoF.V2.Map.Object.chit);

com.hiyoko.DodontoF.V2.Map.Object.Layer = ['floorTile', 'mapMask', 'mapMarker', 'characterData', 'diceSymbol', 'chit'];