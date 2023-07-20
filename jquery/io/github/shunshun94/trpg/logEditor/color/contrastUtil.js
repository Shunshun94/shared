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

io.github.shunshun94.trpg.logEditor.color.contrastUtil.modifyColors = (doms, mode) => {
	const colorMap = {};
	const behavior = io.github.shunshun94.trpg.logEditor.color.contrastUtil.getBehaviorByMode(mode);
	const getModifiedColor = (baseColor) => {
		if(colorMap[baseColor]) {return colorMap[baseColor];}
		const rgbColor = io.github.shunshun94.util.Color.colorConvert(baseColor);
		const hslColor = io.github.shunshun94.util.Color.RgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);
		const modifiedLightnessColorObject = behavior.modifyLightnessColor(hslColor);
		colorMap[baseColor] = `hsl(${Math.floor(modifiedLightnessColorObject.h)}, ${Math.floor(modifiedLightnessColorObject.s)}%, ${Math.floor(modifiedLightnessColorObject.l)}%)`;
		return colorMap[baseColor];
	};
	const tmpResult = doms.map((post)=>{
		const execResult = /color:\s*([^;]*);?/.exec(post.style);
		const currentColor = execResult ? execResult[1] : behavior.defaultColor;
		const modifiedColor = getModifiedColor(currentColor);
		const replaceTarget = execResult ? execResult[0] : '';
		if(replaceTarget) {
			post.style = post.style.replace(replaceTarget, `color: ${modifiedColor};`);
		} else {
			post.style = `color: ${modifiedColor};${post.style}`;
		}
		return post;
	});

	return tmpResult;
};