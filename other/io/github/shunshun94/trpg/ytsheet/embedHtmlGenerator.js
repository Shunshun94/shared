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
	height: '140px',
	width: '390px',
	pictureWidth:'100px'
}

io.github.shunshun94.trpg.ytsheet.HtmlGenerator.generateSW25Html = (json, opt={}) => {
	const base = document.createElement('div');
	base.className = io.github.shunshun94.trpg.ytsheet.HtmlGenerator.CLASSES.BASE;
	base.style = `width:${opt.width || io.github.shunshun94.trpg.ytsheet.HtmlGenerator.defaultOpt.width};border:black solid 1px;`;

	const picture = document.createElement('div');
	const pictureSharedStyle = `display:inline-block;height:${opt.height || io.github.shunshun94.trpg.ytsheet.HtmlGenerator.defaultOpt.height};width:${opt.pictureWidth || opt.height || io.github.shunshun94.trpg.ytsheet.HtmlGenerator.defaultOpt.pictureWidth};`;
	if(json.imageURL) {
		picture.style = `${pictureSharedStyle}background-position:50%;background-repeat:no-repeat;background-size:contain;background-image:url('${json.imageURL}');`;
	} else {
		picture.style = pictureSharedStyle;
		picture.innerText = 'NO IMAGE';
	}
	base.append(picture);

	const rightBox = document.createElement('div');
	rightBox.style = `display:inline-block;position:relative;`;
	const boxList = [];

	const lineOne = document.createElement('div');
	lineOne.style = 'border-bottom:3px black double;margin:auto;margin-bottom:8px;';

	const level = document.createElement('span');
	level.style = 'font-size:120%;';
	level.innerText = `Lv.${json.level} `;
	lineOne.append(level);
	const name = document.createElement('span');
	name.innerText = json.characterName;
	lineOne.append(name);
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

	boxList.push(lineThree);

	boxList.forEach((v)=>{ rightBox.append(v); });
	base.append(rightBox);

	return base;
};
