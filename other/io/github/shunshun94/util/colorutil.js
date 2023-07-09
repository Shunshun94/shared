var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};

io.github.shunshun94.util.Color = io.github.shunshun94.util.Color || {};
io.github.shunshun94.util.Color.RateColor = function(opt_startColor, opt_endColor) {
	this.colorList = io.github.shunshun94.util.Color.RateColor.evalArgument(opt_startColor, opt_endColor);
};

io.github.shunshun94.util.Color.RateColor.prototype.getColor = function(opt_rate) {
	var rate = io.github.shunshun94.util.Color.fitNumber(Number(opt_rate) || 0, 0, 100);
	var len = this.colorList.length;
	var endColor = this.colorList[len - 1];
	var startColor = this.colorList[len - 2];
	for(var i = 1; i < len; i++) {
		if(rate < this.colorList[i].point) {
			endColor = this.colorList[i];
			startColor = this.colorList[i - 1];
			break;
		}
	}
	
	var diffRate = (rate - startColor.point) / (endColor.point - startColor.point);
	var diff = io.github.shunshun94.util.Color.colorMinus(endColor, startColor);
	
	return io.github.shunshun94.util.Color.colorConvert(
			io.github.shunshun94.util.Color.colorPlus(startColor, {
				r: Math.floor(diff.r * diffRate),
				g: Math.floor(diff.g * diffRate),
				b: Math.floor(diff.b * diffRate)
			})
	);
};

io.github.shunshun94.util.Color.RateColor.evalArgument = function(opt_startColor, opt_endColor) {
	var tmpColorList = {};
	
	if(typeof opt_startColor === 'object') {
		for(var key in opt_startColor) {
			tmpColorList[Number(key) || 0] = io.github.shunshun94.util.Color.colorConvert(opt_startColor[key]);
		}
		if(! tmpColorList[100]) {
			tmpColorList[100] = io.github.shunshun94.util.Color.colorConvert('white');
		}
	} else {
		tmpColorList[100] = io.github.shunshun94.util.Color.colorConvert(opt_startColor);
	}
	
	if(! tmpColorList[0]) {
		if(opt_endColor) {
			tmpColorList[0] = io.github.shunshun94.util.Color.colorConvert(opt_endColor);
		} else {
			tmpColorList[0] = io.github.shunshun94.util.Color.getFromCode('red');
		}
	}
	var result = [];
	for(var key in tmpColorList) {
		(function(k, v) {
			v.point = Number(k);
			result.push(v);
		})(key, tmpColorList[key]);
	}
	
	return result.sort(function(a, b){return a.point - b.point;});
};

io.github.shunshun94.util.Color.arrayToColorCode = function(array){
	var colorCode = "#"
	for( var i = 0; i < 3; i++){
		if(array[i] < 16){
			colorCode += "0"
		}
		colorCode += array[i].toString(16);
	}
	return colorCode;
};

io.github.shunshun94.util.Color.RGBFormat = {
	rate: /rgb\((\d+)%?\s*,\s*(\d+)%?\s*,\s*(\d+)%?\)/,
	value: /rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/
};

io.github.shunshun94.util.Color.colorMinus = function(a, b) {
	return {
		r: a.r - b.r,
		g: a.g - b.g,
		b: a.b - b.b
	};
};

io.github.shunshun94.util.Color.colorPlus = function(a, b) {
	return {
		r: a.r + b.r,
		g: a.g + b.g,
		b: a.b + b.b
	};
};

io.github.shunshun94.util.Color.getComplementaryColor = function(color) {
	var array = [color.r, color.g, color.b];
	var base = Math.max.apply(null, array) + Math.min.apply(null, array);
	return io.github.shunshun94.util.Color.colorConvert(array.map(function(v){
		return base - v;
	}));
};

io.github.shunshun94.util.Color.getFromCode = function(code) {
	var base = io.github.shunshun94.util.Color.ColorList[code] ||  io.github.shunshun94.util.Color.ColorList.white;
	var result = {};
	for(var key in base) {
		result[key] = base[key];
	}
	return result;
};

io.github.shunshun94.util.Color.fitNumber = function(val, opt_min, opt_max) {
	var min = opt_min || 0;
	var max = opt_max || 255;
	if(val < min) {return min;}
	if(val > max) {return max;}
	return val;
};

io.github.shunshun94.util.Color.RgbToHsl = function(red, green, blue) {
	const rgbArray = [red, green, blue];
	const rgbMax = Math.max.apply(this, rgbArray);
	const rgbMin = Math.min.apply(this, rgbArray);
	const r = 0, g = 1, b = 2;

	var h = 0;
	if(rgbArray[r] === rgbArray[g] && rgbArray[r] === rgbArray[b]) {
		// noaction
	} else if ( rgbArray[r] >= rgbArray[g] && rgbArray[r] >= rgbArray[b] ) {
		h = 60 * ( (rgbArray[g] - rgbArray[b] ) / (rgbMax - rgbMin) );
	} else if ( rgbArray[g] >= rgbArray[r] && rgbArray[g] >= rgbArray[b] ) {
		h = 60 * ( (rgbArray[b] - rgbArray[r] ) / (rgbMax - rgbMin) ) + 120;
	} else if ( rgbArray[b] >= rgbArray[r] && rgbArray[b] >= rgbArray[g] ) {
		h = 60 * ( (rgbArray[r] - rgbArray[g] ) / (rgbMax - rgbMin) ) + 240;
	}
	h = (h < 0) ? h + 360 : h;

	var l = (rgbMax + rgbMin) / 2;

	var s = 50;
	if( l > 128 ) {
		s = (rgbMax - rgbMin) / (510 - (rgbMax + rgbMin));
	} else {
		s = (rgbMax - rgbMin) / (rgbMax + rgbMin);
	}

	return {h: h, s: s * 100, l: l * 100 / 255};
};
io.github.shunshun94.util.Color.HslToRgb = function(h, s, l) {
	// Copy from https://gist.github.com/mjackson/5311256
	h = h / 360;
	s = s / 100;
	l = l / 100;
	var r, g, b;
	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		function hue2rgb(p, q, t) {
			if (t < 0)
				t += 1;
			if (t > 1)
				t -= 1;
			if (t < 1 / 6)
				return p + (q - p) * 6 * t;
			if (t < 1 / 2)
				return q;
			if (t < 2 / 3)
				return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;

		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	var result = [
	              Math.max(0, Math.min(Math.round(r * 256), 255)),
	              Math.max(0, Math.min(Math.round(g * 256), 255)),
	              Math.max(0, Math.min(Math.round(b * 256), 255)) ];
	return {
		r: result[0], g: result[1], b: result[2],
		code: io.github.shunshun94.util.Color.arrayToColorCode(result)
	}
};

io.github.shunshun94.util.Color.colorConvert = function(color){
	if(! Boolean(color)) {
		return io.github.shunshun94.util.Color.getFromCode('black');
	}
	if( (Number(color.r) || color.r === 0) &&
		(Number(color.g) || color.g === 0) &&
		(Number(color.b) || color.b === 0)
	) {
		color = [color.r, color.g, color.b];
	}
	
	if(Array.isArray(color)){
		color = color.map(function(val){return io.github.shunshun94.util.Color.fitNumber(val);});
		return {
				r: color[0],
				g: color[1],
				b: color[2],
				code: io.github.shunshun94.util.Color.arrayToColorCode(color)
		};
	}
	
	if(Number.isInteger(color)) {
		color = color.toString(16);
		while(color.length < 6) {
			color = '0' + color;
		}
		color = '#' + color;
	}
	color = color.toLowerCase();
	if(color.startsWith('#')) {
		if(color.length == 4) {
			oldColor = color;
			color = '#'+oldColor[1]+oldColor[1]+oldColor[2]+oldColor[2]+oldColor[3]+oldColor[3];
		}
		return {
			r:Number("0x"+color[1]+color[2]),
			g:Number("0x"+color[3]+color[4]),
			b:Number("0x"+color[5]+color[6]),
			code: color
		};
	}else if(color.startsWith('rgb')) {
		var matched = color.match(io.github.shunshun94.util.Color.RGBFormat.value);
		if(matched) {
			return {
				r: matched[1],
				g: matched[2],
				b: matched[3],
				code: io.github.shunshun94.util.Color.arrayToColorCode([Number(matched[1]), Number(matched[2]), Number(matched[3])])
			};
		}
		matched = color.match(io.github.shunshun94.util.Color.RGBFormat.rate);
		if(matched) {
			return {
				r: Math.floor(255 * matched[1] / 100),
				g: Math.floor(255 * matched[2] / 100),
				b: Math.floor(255 * matched[3] / 100),
				code: io.github.shunshun94.util.Color.arrayToColorCode([
						Math.floor(255 * matched[1] / 100),
						Math.floor(255 * matched[2] / 100),
						Math.floor(255 * matched[3] / 100)
					])
			};
		}
		return io.github.shunshun94.util.Color.getFromCode('white');
	}else if(color.startsWith('hsl')) {
		var hslMatched = color.match(/hsl\((\d+)?\s*,\s*(\d+)%?\s*,\s*(\d+)%?\)/);
		if(hslMatched) {
			return io.github.shunshun94.util.Color.HslToRgb(hslMatched[1], hslMatched[2], hslMatched[3]);
		}
		return io.github.shunshun94.util.Color.getFromCode('white');
	}
	return io.github.shunshun94.util.Color.getFromCode(color);
};

io.github.shunshun94.util.Color.getColorFromSeed = (seed, s=100, l=35) => {
	const numCand = Number(seed)
	if(Number.isInteger(numCand)) {
		return io.github.shunshun94.util.Color.HslToRgb(numCand % 360, s, l);
	} else if((typeof seed) === 'string') {
		let seedValue = 0;
		for(var i = 0; i < seed.length; i++) {
			seedValue += seed.charCodeAt(i);
		}
		return io.github.shunshun94.util.Color.HslToRgb(seedValue % 360, s, l);
	} else {
		return io.github.shunshun94.util.Color.HslToRgb(0, s, l);
	}
};
io.github.shunshun94.util.Color.getColorFromSheed = io.github.shunshun94.util.Color.getColorFromSeed;

io.github.shunshun94.util.Color.ColorList = {
		"aliceblue": {
			"r": 240,
			"g": 248,
			"b": 255,
			"code": "#F0F8FF"
		},
		"antiquewhite": {
			"r": 250,
			"g": 235,
			"b": 215,
			"code": "#FAEBD7"
		},
		"aqua": {
			"r": 0,
			"g": 255,
			"b": 255,
			"code": "#00FFFF"
		},
		"aquamarine": {
			"r": 127,
			"g": 255,
			"b": 212,
			"code": "#7FFFD4"
		},
		"azure": {
			"r": 240,
			"g": 255,
			"b": 255,
			"code": "#F0FFFF"
		},
		"beige": {
			"r": 245,
			"g": 245,
			"b": 220,
			"code": "#F5F5DC"
		},
		"bisque": {
			"r": 255,
			"g": 228,
			"b": 196,
			"code": "#FFE4C4"
		},
		"black": {
			"r": 0,
			"g": 0,
			"b": 0,
			"code": "#000000"
		},
		"blanchedalmond": {
			"r": 255,
			"g": 235,
			"b": 205,
			"code": "#FFEBCD"
		},
		"blue": {
			"r": 0,
			"g": 0,
			"b": 255,
			"code": "#0000FF"
		},
		"blueviolet": {
			"r": 138,
			"g": 43,
			"b": 226,
			"code": "#8A2BE2"
		},
		"brown": {
			"r": 165,
			"g": 42,
			"b": 42,
			"code": "#A52A2A"
		},
		"burlywood": {
			"r": 222,
			"g": 184,
			"b": 135,
			"code": "#DEB887"
		},
		"cadetblue": {
			"r": 95,
			"g": 158,
			"b": 160,
			"code": "#5F9EA0"
		},
		"chartreuse": {
			"r": 127,
			"g": 255,
			"b": 0,
			"code": "#7FFF00"
		},
		"chocolate": {
			"r": 210,
			"g": 105,
			"b": 30,
			"code": "#D2691E"
		},
		"coral": {
			"r": 255,
			"g": 127,
			"b": 80,
			"code": "#FF7F50"
		},
		"cornflowerblue": {
			"r": 100,
			"g": 149,
			"b": 237,
			"code": "#6495ED"
		},
		"cornsilk": {
			"r": 255,
			"g": 248,
			"b": 220,
			"code": "#FFF8DC"
		},
		"crimson": {
			"r": 220,
			"g": 20,
			"b": 60,
			"code": "#DC143C"
		},
		"cyan": {
			"r": 0,
			"g": 255,
			"b": 255,
			"code": "#00FFFF"
		},
		"darkblue": {
			"r": 0,
			"g": 0,
			"b": 139,
			"code": "#00008B"
		},
		"darkcyan": {
			"r": 0,
			"g": 139,
			"b": 139,
			"code": "#008B8B"
		},
		"darkgoldenrod": {
			"r": 184,
			"g": 134,
			"b": 11,
			"code": "#B8860B"
		},
		"darkgray": {
			"r": 169,
			"g": 169,
			"b": 169,
			"code": "#A9A9A9"
		},
		"darkgreen": {
			"r": 0,
			"g": 100,
			"b": 0,
			"code": "#006400"
		},
		"darkgrey": {
			"r": 169,
			"g": 169,
			"b": 169,
			"code": "#A9A9A9"
		},
		"darkkhaki": {
			"r": 189,
			"g": 183,
			"b": 107,
			"code": "#BDB76B"
		},
		"darkmagenta": {
			"r": 139,
			"g": 0,
			"b": 139,
			"code": "#8B008B"
		},
		"darkolivegreen": {
			"r": 85,
			"g": 107,
			"b": 47,
			"code": "#556B2F"
		},
		"darkorange": {
			"r": 255,
			"g": 140,
			"b": 0,
			"code": "#FF8C00"
		},
		"darkorchid": {
			"r": 153,
			"g": 50,
			"b": 204,
			"code": "#9932CC"
		},
		"darkred": {
			"r": 139,
			"g": 0,
			"b": 0,
			"code": "#8B0000"
		},
		"darksalmon": {
			"r": 233,
			"g": 150,
			"b": 122,
			"code": "#E9967A"
		},
		"darkseagreen": {
			"r": 143,
			"g": 188,
			"b": 143,
			"code": "#8FBC8F"
		},
		"darkslateblue": {
			"r": 72,
			"g": 61,
			"b": 139,
			"code": "#483D8B"
		},
		"darkslategray": {
			"r": 47,
			"g": 79,
			"b": 79,
			"code": "#2F4F4F"
		},
		"darkslategrey": {
			"r": 47,
			"g": 79,
			"b": 79,
			"code": "#2F4F4F"
		},
		"darkturquoise": {
			"r": 0,
			"g": 206,
			"b": 209,
			"code": "#00CED1"
		},
		"darkviolet": {
			"r": 148,
			"g": 0,
			"b": 211,
			"code": "#9400D3"
		},
		"deeppink": {
			"r": 255,
			"g": 20,
			"b": 147,
			"code": "#FF1493"
		},
		"deepskyblue": {
			"r": 0,
			"g": 191,
			"b": 255,
			"code": "#00BFFF"
		},
		"dimgray": {
			"r": 105,
			"g": 105,
			"b": 105,
			"code": "#696969"
		},
		"dimgrey": {
			"r": 105,
			"g": 105,
			"b": 105,
			"code": "#696969"
		},
		"dodgerblue": {
			"r": 30,
			"g": 144,
			"b": 255,
			"code": "#1E90FF"
		},
		"firebrick": {
			"r": 178,
			"g": 34,
			"b": 34,
			"code": "#B22222"
		},
		"floralwhite": {
			"r": 255,
			"g": 250,
			"b": 240,
			"code": "#FFFAF0"
		},
		"forestgreen": {
			"r": 34,
			"g": 139,
			"b": 34,
			"code": "#228B22"
		},
		"fuchsia": {
			"r": 255,
			"g": 0,
			"b": 255,
			"code": "#FF00FF"
		},
		"gainsboro": {
			"r": 220,
			"g": 220,
			"b": 220,
			"code": "#DCDCDC"
		},
		"ghostwhite": {
			"r": 248,
			"g": 248,
			"b": 255,
			"code": "#F8F8FF"
		},
		"gold": {
			"r": 255,
			"g": 215,
			"b": 0,
			"code": "#FFD700"
		},
		"goldenrod": {
			"r": 218,
			"g": 165,
			"b": 32,
			"code": "#DAA520"
		},
		"gray": {
			"r": 128,
			"g": 128,
			"b": 128,
			"code": "#808080"
		},
		"green": {
			"r": 0,
			"g": 128,
			"b": 0,
			"code": "#008000"
		},
		"greenyellow": {
			"r": 173,
			"g": 255,
			"b": 47,
			"code": "#ADFF2F"
		},
		"grey": {
			"r": 128,
			"g": 128,
			"b": 128,
			"code": "#808080"
		},
		"honeydew": {
			"r": 240,
			"g": 255,
			"b": 240,
			"code": "#F0FFF0"
		},
		"hotpink": {
			"r": 255,
			"g": 105,
			"b": 180,
			"code": "#FF69B4"
		},
		"indianred": {
			"r": 205,
			"g": 92,
			"b": 92,
			"code": "#CD5C5C"
		},
		"indigo": {
			"r": 75,
			"g": 0,
			"b": 130,
			"code": "#4B0082"
		},
		"ivory": {
			"r": 255,
			"g": 255,
			"b": 240,
			"code": "#FFFFF0"
		},
		"khaki": {
			"r": 240,
			"g": 230,
			"b": 140,
			"code": "#F0E68C"
		},
		"lavender": {
			"r": 230,
			"g": 230,
			"b": 250,
			"code": "#E6E6FA"
		},
		"lavenderblush": {
			"r": 255,
			"g": 240,
			"b": 245,
			"code": "#FFF0F5"
		},
		"lawngreen": {
			"r": 124,
			"g": 252,
			"b": 0,
			"code": "#7CFC00"
		},
		"lemonchiffon": {
			"r": 255,
			"g": 250,
			"b": 205,
			"code": "#FFFACD"
		},
		"lightblue": {
			"r": 173,
			"g": 216,
			"b": 230,
			"code": "#ADD8E6"
		},
		"lightcoral": {
			"r": 240,
			"g": 128,
			"b": 128,
			"code": "#F08080"
		},
		"lightcyan": {
			"r": 224,
			"g": 255,
			"b": 255,
			"code": "#E0FFFF"
		},
		"lightgoldenrodyellow": {
			"r": 250,
			"g": 250,
			"b": 210,
			"code": "#FAFAD2"
		},
		"lightgray": {
			"r": 211,
			"g": 211,
			"b": 211,
			"code": "#D3D3D3"
		},
		"lightgreen": {
			"r": 144,
			"g": 238,
			"b": 144,
			"code": "#90EE90"
		},
		"lightgrey": {
			"r": 211,
			"g": 211,
			"b": 211,
			"code": "#D3D3D3"
		},
		"lightpink": {
			"r": 255,
			"g": 182,
			"b": 193,
			"code": "#FFB6C1"
		},
		"lightsalmon": {
			"r": 255,
			"g": 160,
			"b": 122,
			"code": "#FFA07A"
		},
		"lightseagreen": {
			"r": 32,
			"g": 178,
			"b": 170,
			"code": "#20B2AA"
		},
		"lightskyblue": {
			"r": 135,
			"g": 206,
			"b": 250,
			"code": "#87CEFA"
		},
		"lightslategray": {
			"r": 119,
			"g": 136,
			"b": 153,
			"code": "#778899"
		},
		"lightslategrey": {
			"r": 119,
			"g": 136,
			"b": 153,
			"code": "#778899"
		},
		"lightsteelblue": {
			"r": 176,
			"g": 196,
			"b": 222,
			"code": "#B0C4DE"
		},
		"lightyellow": {
			"r": 255,
			"g": 255,
			"b": 224,
			"code": "#FFFFE0"
		},
		"lime": {
			"r": 0,
			"g": 255,
			"b": 0,
			"code": "#00FF00"
		},
		"limegreen": {
			"r": 50,
			"g": 205,
			"b": 50,
			"code": "#32CD32"
		},
		"linen": {
			"r": 250,
			"g": 240,
			"b": 230,
			"code": "#FAF0E6"
		},
		"magenta": {
			"r": 255,
			"g": 0,
			"b": 255,
			"code": "#FF00FF"
		},
		"maroon": {
			"r": 128,
			"g": 0,
			"b": 0,
			"code": "#800000"
		},
		"mediumaquamarine": {
			"r": 102,
			"g": 205,
			"b": 170,
			"code": "#66CDAA"
		},
		"mediumblue": {
			"r": 0,
			"g": 0,
			"b": 205,
			"code": "#0000CD"
		},
		"mediumorchid": {
			"r": 186,
			"g": 85,
			"b": 211,
			"code": "#BA55D3"
		},
		"mediumpurple": {
			"r": 147,
			"g": 112,
			"b": 219,
			"code": "#9370DB"
		},
		"mediumseagreen": {
			"r": 60,
			"g": 179,
			"b": 113,
			"code": "#3CB371"
		},
		"mediumslateblue": {
			"r": 123,
			"g": 104,
			"b": 238,
			"code": "#7B68EE"
		},
		"mediumspringgreen": {
			"r": 0,
			"g": 250,
			"b": 154,
			"code": "#00FA9A"
		},
		"mediumturquoise": {
			"r": 72,
			"g": 209,
			"b": 204,
			"code": "#48D1CC"
		},
		"mediumvioletred": {
			"r": 199,
			"g": 21,
			"b": 133,
			"code": "#C71585"
		},
		"midnightblue": {
			"r": 25,
			"g": 25,
			"b": 112,
			"code": "#191970"
		},
		"mintcream": {
			"r": 245,
			"g": 255,
			"b": 250,
			"code": "#F5FFFA"
		},
		"mistyrose": {
			"r": 255,
			"g": 228,
			"b": 225,
			"code": "#FFE4E1"
		},
		"moccasin": {
			"r": 255,
			"g": 228,
			"b": 181,
			"code": "#FFE4B5"
		},
		"navajowhite": {
			"r": 255,
			"g": 222,
			"b": 173,
			"code": "#FFDEAD"
		},
		"navy": {
			"r": 0,
			"g": 0,
			"b": 128,
			"code": "#000080"
		},
		"oldlace": {
			"r": 253,
			"g": 245,
			"b": 230,
			"code": "#FDF5E6"
		},
		"olive": {
			"r": 128,
			"g": 128,
			"b": 0,
			"code": "#808000"
		},
		"olivedrab": {
			"r": 107,
			"g": 142,
			"b": 35,
			"code": "#6B8E23"
		},
		"orange": {
			"r": 255,
			"g": 165,
			"b": 0,
			"code": "#FFA500"
		},
		"orangered": {
			"r": 255,
			"g": 69,
			"b": 0,
			"code": "#FF4500"
		},
		"orchid": {
			"r": 218,
			"g": 112,
			"b": 214,
			"code": "#DA70D6"
		},
		"palegoldenrod": {
			"r": 238,
			"g": 232,
			"b": 170,
			"code": "#EEE8AA"
		},
		"palegreen": {
			"r": 152,
			"g": 251,
			"b": 152,
			"code": "#98FB98"
		},
		"paleturquoise": {
			"r": 175,
			"g": 238,
			"b": 238,
			"code": "#AFEEEE"
		},
		"palevioletred": {
			"r": 219,
			"g": 112,
			"b": 147,
			"code": "#DB7093"
		},
		"papayawhip": {
			"r": 255,
			"g": 239,
			"b": 213,
			"code": "#FFEFD5"
		},
		"peachpuff": {
			"r": 255,
			"g": 218,
			"b": 185,
			"code": "#FFDAB9"
		},
		"peru": {
			"r": 205,
			"g": 133,
			"b": 63,
			"code": "#CD853F"
		},
		"pink": {
			"r": 255,
			"g": 192,
			"b": 203,
			"code": "#FFC0CB"
		},
		"plum": {
			"r": 221,
			"g": 160,
			"b": 221,
			"code": "#DDA0DD"
		},
		"powderblue": {
			"r": 176,
			"g": 224,
			"b": 230,
			"code": "#B0E0E6"
		},
		"purple": {
			"r": 128,
			"g": 0,
			"b": 128,
			"code": "#800080"
		},
		"red": {
			"r": 255,
			"g": 0,
			"b": 0,
			"code": "#FF0000"
		},
		"rosybrown": {
			"r": 188,
			"g": 143,
			"b": 143,
			"code": "#BC8F8F"
		},
		"royalblue": {
			"r": 65,
			"g": 105,
			"b": 225,
			"code": "#4169E1"
		},
		"saddlebrown": {
			"r": 139,
			"g": 69,
			"b": 19,
			"code": "#8B4513"
		},
		"salmon": {
			"r": 250,
			"g": 128,
			"b": 114,
			"code": "#FA8072"
		},
		"sandybrown": {
			"r": 244,
			"g": 164,
			"b": 96,
			"code": "#F4A460"
		},
		"seagreen": {
			"r": 46,
			"g": 139,
			"b": 87,
			"code": "#2E8B57"
		},
		"seashell": {
			"r": 255,
			"g": 245,
			"b": 238,
			"code": "#FFF5EE"
		},
		"sienna": {
			"r": 160,
			"g": 82,
			"b": 45,
			"code": "#A0522D"
		},
		"silver": {
			"r": 192,
			"g": 192,
			"b": 192,
			"code": "#C0C0C0"
		},
		"skyblue": {
			"r": 135,
			"g": 206,
			"b": 235,
			"code": "#87CEEB"
		},
		"slateblue": {
			"r": 106,
			"g": 90,
			"b": 205,
			"code": "#6A5ACD"
		},
		"slategray": {
			"r": 112,
			"g": 128,
			"b": 144,
			"code": "#708090"
		},
		"slategrey": {
			"r": 112,
			"g": 128,
			"b": 144,
			"code": "#708090"
		},
		"snow": {
			"r": 255,
			"g": 250,
			"b": 250,
			"code": "#FFFAFA"
		},
		"springgreen": {
			"r": 0,
			"g": 255,
			"b": 127,
			"code": "#00FF7F"
		},
		"steelblue": {
			"r": 70,
			"g": 130,
			"b": 180,
			"code": "#4682B4"
		},
		"tan": {
			"r": 210,
			"g": 180,
			"b": 140,
			"code": "#D2B48C"
		},
		"teal": {
			"r": 0,
			"g": 128,
			"b": 128,
			"code": "#008080"
		},
		"thistle": {
			"r": 216,
			"g": 191,
			"b": 216,
			"code": "#D8BFD8"
		},
		"tomato": {
			"r": 255,
			"g": 99,
			"b": 71,
			"code": "#FF6347"
		},
		"turquoise": {
			"r": 64,
			"g": 224,
			"b": 208,
			"code": "#40E0D0"
		},
		"violet": {
			"r": 238,
			"g": 130,
			"b": 238,
			"code": "#EE82EE"
		},
		"wheat": {
			"r": 245,
			"g": 222,
			"b": 179,
			"code": "#F5DEB3"
		},
		"white": {
			"r": 255,
			"g": 255,
			"b": 255,
			"code": "#FFFFFF"
		},
		"whitesmoke": {
			"r": 245,
			"g": 245,
			"b": 245,
			"code": "#F5F5F5"
		},
		"yellow": {
			"r": 255,
			"g": 255,
			"b": 0,
			"code": "#FFFF00"
		},
		"yellowgreen": {
			"r": 154,
			"g": 205,
			"b": 50,
			"code": "#9ACD32"
		}
	};