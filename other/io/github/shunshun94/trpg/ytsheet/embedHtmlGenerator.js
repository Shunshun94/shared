var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ytsheet = io.github.shunshun94.trpg.ytsheet || {};
io.github.shunshun94.trpg.ytsheet.HtmlGenerator = io.github.shunshun94.trpg.ytsheet.HtmlGenerator || {};

// ytsheetConstsSW25.js を使うべきだが読み込んでない場合もあるだろう
io.github.shunshun94.trpg.ytsheet.consts = io.github.shunshun94.trpg.ytsheet.consts || {};
io.github.shunshun94.trpg.ytsheet.consts.skills = io.github.shunshun94.trpg.ytsheet.consts.skills || {
	lvFig : 'ファイター',
	lvGra : 'グラップラー',
	lvFen : 'フェンサー',
	lvSho : 'シューター',
	lvSor : 'ソーサラー',
	lvCon : 'コンジャラー',
	lvPri : 'プリースト',
	lvFai : 'フェアリーテイマー',
	lvMag : 'マギテック',
	lvSco : 'スカウト',
	lvRan : 'レンジャー',
	lvSag : 'セージ',
	lvEnh : 'エンハンサー',
	lvBar : 'バード',
	lvRid : 'ライダー',
	lvAlc : 'アルケミスト',
	lvWar : 'ウォーリーダー',
	lvMys : 'ミスティック',
	lvDem : 'デーモンルーラー',
	lvDru : 'ドルイド',
	lvPhy : 'フィジカルマスター',
	lvGri : 'グリモワール',
	lvAri : 'アリストクラシー',
	lvArt : 'アーティザン'
};

io.github.shunshun94.trpg.ytsheet.HtmlGenerator.CLASSES = {
	BASE: 'io-github-shunshun94-trpg-ytsheet-HtmlGenerator-CLASSES-BASE'
};

io.github.shunshun94.trpg.ytsheet.HtmlGenerator.defaultOpt = {
	height: '110px',
	width: '390px',
	pictureWidth:'110px'
}

io.github.shunshun94.trpg.ytsheet.HtmlGenerator.generateSW25Html = (json, opt={}) => {
	const pictureWidth = opt.pictureWidth || opt.height || io.github.shunshun94.trpg.ytsheet.HtmlGenerator.defaultOpt.pictureWidth;
	const height = opt.height || io.github.shunshun94.trpg.ytsheet.HtmlGenerator.defaultOpt.height;
	const width = opt.width || io.github.shunshun94.trpg.ytsheet.HtmlGenerator.defaultOpt.width;

	const base = document.createElement('div');
	base.className = io.github.shunshun94.trpg.ytsheet.HtmlGenerator.CLASSES.BASE;
	base.style = `z-index:3;height:${height};width:${width};border:gray solid 1px;border-radius:5px;line-height: 130%;position:relative;`;

	const picture = document.createElement('div');
	const pictureSharedStyle = `position:absolute;top:0px;left:0px;height:${height};width:${pictureWidth};`;
	if(json.imageURL) {
		picture.style = `z-index:2;${pictureSharedStyle}background-position:50%;background-repeat:no-repeat;background-size:contain;background-image:url('${json.imageURL}');`;
	} else {
		picture.style = pictureSharedStyle;
		picture.innerText = 'NO IMAGE';
	}
	base.append(picture);

	const rightBox = document.createElement('div');
	rightBox.style = `position:absolute;height:height:${height};top:0px;left:${pictureWidth};`;
	const boxList = [];

	const lineOne = document.createElement('div');
	lineOne.style = 'font-size:120%;border-bottom:3px black double;margin:auto;margin-bottom:8px;';

	const name = document.createElement('span');
	name.innerText = json.characterName;
	lineOne.append(name);
	const level = document.createElement('span');
	level.innerText = `　Lv.${json.level}`;
	lineOne.append(level);
	if(opt.url) {
		const link = document.createElement('a');
		link.href = opt.url;
		link.style = 'text-decoration:none;';
		link.target = '_blank';
		link.innerText = '🔗';
		lineOne.append(link);
	}
	boxList.push(lineOne);

	const lineTwo = document.createElement('span');
	lineTwo.innerText = `${json.race} ${json.gender} (${json.age || '年齢不詳'})`;
	boxList.push(lineTwo);
	boxList.push(document.createElement('br'));

	const lineThree = document.createElement('span');
	const classList = [];
	for(const key in io.github.shunshun94.trpg.ytsheet.consts.skills) {
		if(json[key]) {
			classList.push({
				name: io.github.shunshun94.trpg.ytsheet.consts.skills[key],
				lv: Number(json[key])
			});
		}
	}
	lineThree.innerText = classList.sort((a,b)=>{return b.lv - a.lv}).slice(0, 3).map((c)=>{return `${c.name}:${c.lv}`}).join('\n');
	boxList.push(lineThree);

	boxList.forEach((v)=>{ rightBox.append(v); });
	base.append(rightBox);

	return base;
};
