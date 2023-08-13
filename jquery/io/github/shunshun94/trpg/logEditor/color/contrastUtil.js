var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.color = io.github.shunshun94.trpg.logEditor.color || {};
io.github.shunshun94.trpg.logEditor.color.contrastUtil = io.github.shunshun94.trpg.logEditor.color.contrastUtil || {};

io.github.shunshun94.trpg.logEditor.color.contrastUtil.CONSTS = {
    darkmode: 'darkmode',
    hueSmallestLength: 360 / 8
};

io.github.shunshun94.trpg.logEditor.color.contrastUtil.getBehaviorByMode = (mode) => {
	if(mode === io.github.shunshun94.trpg.logEditor.color.contrastUtil.CONSTS.darkmode) {
		return {
			defaultColor: 'white',
			modifyLightnessColor: (color)=>{
				if(color.l < 60) {
					color.l = 60;
					return color;
				} else {
					return color;
				}
			}
		};
	} else {
		return {
			defaultColor: 'black',
			modifyLightnessColor: (color)=>{
				if(color.l > 40) {
					color.l = 40;
					return color;
				} else {
					return color;
				}
			}
		};
	}
};

io.github.shunshun94.trpg.logEditor.color.contrastUtil.generateInitColorMap = (doms, behavior) => {
	const colorMap = {};

	doms.forEach((post)=>{
		const execResult = /color:\s*([^;]*);?/.exec(post.style);
		const currentColor = execResult ? execResult[1] : behavior.defaultColor;
		const rgbColor = io.github.shunshun94.util.Color.colorConvert(currentColor);
		const hslColor = io.github.shunshun94.util.Color.RgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);
		colorMap[currentColor] = hslColor;
	});
	return colorMap;
};

io.github.shunshun94.trpg.logEditor.color.contrastUtil.modifyLightnessColor = (colorMap, behavior) => {
	const result = {};
	for(var key in colorMap) {
		result[key] = behavior.modifyLightnessColor(colorMap[key]);
	}
	return result;
};

io.github.shunshun94.trpg.logEditor.color.contrastUtil.modifyDistanceColor = (colorMap) => {
	const keysList = Object.keys(colorMap).map((key)=>{return {key: key, value: colorMap[key]}}).sort((a,b)=>{return a.value.h - b.value.h});
	const minDistance = Math.min(360 / keysList.length, io.github.shunshun94.trpg.logEditor.color.contrastUtil.CONSTS.hueSmallestLength);
	console.log(colorMap, keysList, minDistance);
	if(keysList.length < 2) {
		return colorMap;
	}
	for(var i = 1; i < keysList.length; i++) {
		if(keysList[i].value.h - keysList[i - 1].value.h < minDistance) {
			keysList[i].value.h = keysList[i - 1].value.h + minDistance;
			if(keysList[i].value.h > 360) {
				keysList[i].value.h -= 360;
			}
		}
	}
	if(360 + keysList[0].value.h - keysList.at(-1).value.h < minDistance) {
		keysList[0].value.h = keysList.at(-1).value.h + minDistance - 360;
	}
	console.log(keysList);
	const result = {};
	keysList.forEach((d)=>{
		result[d.key] = d.value;
	});
	return result;
};

io.github.shunshun94.trpg.logEditor.color.contrastUtil.modifyDistanceColor({
    "#000000": {
        "h": 0,
        "s": 0,
        "l": 0
    },
    "#808080": {
        "h": 0,
        "s": 0,
        "l": 40
    },
    "#ff9900": {
        "h": 36,
        "s": 100,
        "l": 40
    },
    "#0000ff": {
        "h": 240,
        "s": 100,
        "l": 40
    },
    "#00662c": {
        "h": 145.88235294117646,
        "s": 100,
        "l": 20
    },
    "#669933": {
        "h": 90,
        "s": 50,
        "l": 40
    },
    "#006633": {
        "h": 150,
        "s": 100,
        "l": 20
    },
    "#32e232": {
        "h": 120,
        "s": 75.21367521367522,
        "l": 40
    },
    "#2e8b57": {
        "h": 146.4516129032258,
        "s": 50.27027027027027,
        "l": 36.27450980392157
    },
    "#e28903": {
        "h": 36.053811659192824,
        "s": 97.37991266375546,
        "l": 40
    }
});

io.github.shunshun94.trpg.logEditor.color.contrastUtil.modifyColorMapToTextFormat = (colorMap) => {
	const result = {};
	for(var key in colorMap) {
		modifiedLightnessColorObject = colorMap[key]
		result[key] = `hsl(${Math.floor(modifiedLightnessColorObject.h)}, ${Math.floor(modifiedLightnessColorObject.s)}%, ${Math.floor(modifiedLightnessColorObject.l)}%)`;
	}
	return result;
};

io.github.shunshun94.trpg.logEditor.color.contrastUtil.modifyColors = (doms, mode) => {
	const behavior = io.github.shunshun94.trpg.logEditor.color.contrastUtil.getBehaviorByMode(mode);
	const colorMap = [
		io.github.shunshun94.trpg.logEditor.color.contrastUtil.modifyLightnessColor,
		io.github.shunshun94.trpg.logEditor.color.contrastUtil.modifyDistanceColor,
		io.github.shunshun94.trpg.logEditor.color.contrastUtil.modifyColorMapToTextFormat
	].reduce((currentColorMap, func)=>{
		return func(currentColorMap, behavior)
	}, io.github.shunshun94.trpg.logEditor.color.contrastUtil.generateInitColorMap(doms, behavior));

	return doms.map((post)=>{
		const execResult = /color:\s*([^;]*);?/.exec(post.style);
		const currentColor = execResult ? execResult[1] : behavior.defaultColor;
		const modifiedColor = colorMap[currentColor];
		const replaceTarget = execResult ? execResult[0] : '';
		if(replaceTarget) {
			post.style = post.style.replace(replaceTarget, `color: ${modifiedColor};`);
		} else {
			post.style = `color: ${modifiedColor};${post.style}`;
		}
		return post;
	});
};