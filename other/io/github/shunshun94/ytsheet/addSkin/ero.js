var io = {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.ytsheet = io.github.shunshun94.ytsheet || {};
io.github.shunshun94.ytsheet.addSkin = io.github.shunshun94.ytsheet.addSkin || {};

io.github.shunshun94.ytsheet.addSkin.param = io.github.shunshun94.ytsheet.addSkin.param || com.hiyoko.util.getQueries();

io.github.shunshun94.ytsheet.addSkin.defaultDisplayModeLogic = () => { return true; };

io.github.shunshun94.ytsheet.addSkin.displayEroEditMenu = (displayModeLogic = io.github.shunshun94.ytsheet.addSkin.defaultDisplayModeLogic) => {
    const userIdCandiate = /ytsheet2=(\d+)/.exec(document.cookie);
    const userId = (userIdCandiate) ? userIdCandiate[1] : '';
    const isActive = displayModeLogic(userId, location.href);
    if((isActive) && (generateType === 'SwordWorld2PC')) {
        const navUl = document.getElementsByTagName('nav')[0].getElementsByTagName('ul')[0];
        const lastLi = Array.from(navUl.children).at(-1);
        const newMenu = document.createElement('li');
        newMenu.innerHTML = `<a href="./${location.search}&eroedit=1"><span>エロステ<br/>編集</span></a>`;
        navUl.insertBefore(newMenu, lastLi);
    }
};

io.github.shunshun94.ytsheet.addSkin.eroColumns = [
	{"columnId":"fPart","columnName":"%E5%88%9D%E4%BD%93%E9%A8%93%E3%81%AE%E7%9B%B8%E6%89%8B","flexBasis":"85%","default":"未経験", "type":"text"},
	{"columnId":"fExp","columnName":"%E5%88%9D%E4%BD%93%E9%A8%93%E3%81%AE%E7%8A%B6%E6%B3%81","flexBasis":"100%","ddStyle":"text-align:left; padding: 8px;","default":"未経験", "type":"text"},

	{"columnId":"pCnt","columnName":"%E7%B5%8C%E9%A8%93%E4%BA%BA%E6%95%B0","flexBasis":"33%","unit":"人","default":"0", "type":"number"},
	{"columnId":"sCnt","columnName":"%E3%82%BB%E3%83%83%E3%82%AF%E3%82%B9","flexBasis":"33%","unit":"回","default":"0", "type":"number"},
	{"columnId":"aCnt","columnName":"%E3%82%A2%E3%83%8A%E3%83%AB","flexBasis":"33%","unit":"回","default":"0", "type":"number"},
	{"columnId":"cCnt","columnName":"%E4%B8%AD%E5%87%BA%E3%81%97","flexBasis":"33%","unit":"回","default":"0", "type":"number"},
	{"columnId":"fCnt","columnName":"%E3%83%95%E3%82%A7%E3%83%A9%E3%83%81%E3%82%AA","flexBasis":"33%","unit":"回","default":"0", "type":"number"},
	{"columnId":"bCnt","columnName":"%E3%83%91%E3%82%A4%E3%82%BA%E3%83%AA","flexBasis":"33%","unit":"回","default":"0", "type":"number"},

	{"columnId":"mExp","columnName":"%E5%8F%A3%E9%96%8B%E7%99%BA%E5%BA%A6","flexBasis":"24%","default":"E", "type":"select", "options": ["A", "B", "C", "D", "E"]},
	{"columnId":"bExp","columnName":"%E8%83%B8%E9%96%8B%E7%99%BA%E5%BA%A6","flexBasis":"24%","default":"E", "type":"select", "options": ["A", "B", "C", "D", "E"]},
	{"columnId":"hExp","columnName":"%E5%B0%BB%E9%96%8B%E7%99%BA%E5%BA%A6","flexBasis":"24%","default":"E", "type":"select", "options": ["A", "B", "C", "D", "E"]},
	{"columnId":"tExp","columnName":"%E4%B9%B3%E9%A6%96%E9%96%8B%E7%99%BA%E5%BA%A6","flexBasis":"24%","default":"E", "type":"select", "options": ["A", "B", "C", "D", "E"]},
	{"columnId":"gExp","columnName":"%E6%80%A7%E5%99%A8%E9%96%8B%E7%99%BA%E5%BA%A6","flexBasis":"24%","default":"E", "type":"select", "options": ["A", "B", "C", "D", "E"]},
	{"columnId":"cExp","columnName":"%E3%82%AF%E3%83%AA%E9%96%8B%E7%99%BA%E5%BA%A6","flexBasis":"24%","default":"E", "type":"select", "options": ["A", "B", "C", "D", "E"]},
	{"columnId":"aExp","columnName":"%E8%82%9B%E9%96%80%E9%96%8B%E7%99%BA%E5%BA%A6","flexBasis":"24%","default":"E", "type":"select", "options": ["A", "B", "C", "D", "E"]},
	{"columnId":"mExp","columnName":"%E7%B2%BE%E7%A5%9E%E9%96%8B%E7%99%BA%E5%BA%A6","flexBasis":"24%","default":"E", "type":"select", "options": ["A", "B", "C", "D", "E"]},

	{"columnId":"bSta","columnName":"%E4%BB%98%E4%B8%8E%E3%81%95%E3%82%8C%E3%81%9F%E3%83%90%E3%83%83%E3%83%89%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9","flexBasis":"100%","default":"なし", "type":"text"},

	{"columnId":"appendTextRightTop","columnName":"画像右上追加吹き出し","flexBasis":"100%","default":"", "type":"text"},
	{"columnId":"appendTextLeftBottom","columnName":"画像左下追加吹き出し","flexBasis":"100%","default":"", "type":"text"}

];

io.github.shunshun94.ytsheet.addSkin.eroStaMode = (io.github.shunshun94.ytsheet.addSkin.param.eroedit || io.github.shunshun94.ytsheet.addSkin.param.mode === 'eroedit') ?
					'edit' : ((io.github.shunshun94.ytsheet.addSkin.param.ero || io.github.shunshun94.ytsheet.addSkin.param.mode === 'ero') ? 'view' : '');

if(io.github.shunshun94.ytsheet.addSkin.eroStaMode) {
	['race-ability', 'birth', 'faith', 'rank', 'status', 'sub-status', 'area-ability', 'level', 'exp'].forEach((id)=>{
		document.getElementById(id).style.display='none';
	});
	const columns = Array.from(document.getElementById('character').getElementsByTagName('article')[0].children);
	columns.forEach((d, i)=>{ if(i > 2 || i === 1){ d.style.display='none'; } });

	io.github.shunshun94.ytsheet.addSkin.eroColumns.forEach((element, num)=>{
		const appendBox = document.createElement('dl');
		appendBox.setAttribute('id', element.columnId);
		appendBox.className ='box';
		appendBox.style.flexBasis = element.flexBasis;
		appendBox.style.order = 6 + num;

		const dt = document.createElement('dt');
		dt.textContent = decodeURI(element.columnName);
		appendBox.append(dt);
		const dd = document.createElement('dd');
		dd.style = element.ddStyle || '';
		if( io.github.shunshun94.ytsheet.addSkin.eroStaMode === 'view' ) {
			dd.textContent = `${decodeURI(io.github.shunshun94.ytsheet.addSkin.param[element.columnId] || element.default)}${element.unit || ''}`;	
		}
		if( io.github.shunshun94.ytsheet.addSkin.eroStaMode === 'edit' ) {
			const input = document.createElement((element.type === 'select') ? 'select' : 'input');
			input.style.width = '100%';
			input.setAttribute('id', `input_${element.columnId}`);
			if(element.type === 'select') {
				element.options.forEach((value)=>{
					const option = document.createElement('option');
					option.value = value;
					option.textContent = value;
					input.append(option);
				});
			} else {
				input.setAttribute('type', element.type);
			}
			input.value = decodeURI(io.github.shunshun94.ytsheet.addSkin.param[element.columnId] || element.default);
			dd.append(input);
		}
		appendBox.append(dd);

		document.getElementById('personal').append(appendBox);
	});
	document.getElementById('personal').style.gridArea = 'STT';
}

if( io.github.shunshun94.ytsheet.addSkin.eroStaMode === 'edit' ) {
	const send = document.createElement(`button`);
	send.style = `flex-basis: 100%; order: 30;`;
	send.textContent = '保存（サーバには保存されず URL に情報が保持されます！）';
	send.onclick = (e) =>{ 
		const inputs = Array.from(document.getElementById('personal').getElementsByTagName('input')).concat(Array.from(document.getElementById('personal').getElementsByTagName('select')));
		const id = io.github.shunshun94.ytsheet.addSkin.param.id;
		location.href = `./?${sheetIdentifier}&ero=1&${inputs.map((element)=>{ return `${element.id.replace('input_', '')}=${ encodeURI(element.value) }` }).join('&')}`;
	};
	document.getElementById('personal').append(send);
} else if( io.github.shunshun94.ytsheet.addSkin.eroStaMode === 'view' ) {
	document.getElementById('appendTextRightTop').remove();
	document.getElementById('appendTextLeftBottom').remove();
	if(io.github.shunshun94.ytsheet.addSkin.param.appendTextRightTop) {
		const item = document.createElement('span');
		item.id = 'image-append-right-top';
		item.style = `padding:0.8em;top:8px;right:8px;position:absolute;width:3em;writing-mode: vertical-rl;color:black;background-color:white;border:black solid 2px;font-weight: bold;`;
		item.textContent = decodeURI(io.github.shunshun94.ytsheet.addSkin.param.appendTextRightTop);
		document.getElementById('image').append(item);
	}

	if(io.github.shunshun94.ytsheet.addSkin.param.appendTextLeftBottom) {
		const item = document.createElement('span');
		item.id = 'image-append-left-bottom';
		item.style = `padding:0.8em;bottom:8px;left:8px;position:absolute;width:3em;writing-mode: vertical-rl;color:black;background-color:white;border:black solid 2px;font-weight: bold;`;
		item.textContent = decodeURI(io.github.shunshun94.ytsheet.addSkin.param.appendTextLeftBottom);
		document.getElementById('image').append(item);
	}
}
