var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.scenarioTools = io.github.shunshun94.trpg.scenarioTools || {};

io.github.shunshun94.trpg.scenarioTools.ViceCity = class {
	constructor(opts={}) {
		this.dom = opts.dom || $(`#${io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.ID}`);
		this.decided = this.getQuery(opts.decided);
		this.used = [];
		this.mode = opts.mode || this.decided.mode || io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.MODES.EDIT;
		this.buildMap();
		if( this.mode === io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.MODES.EDIT ) { this.bindEvents(); }
	}

	getMode() {
		return this.decided.mode || 'edit';
	}

	getQuery(text = '') {
		var params = (text || location.search.slice(1)).split('&');
		var paramLength = params.length;
		var result = {};
		for(var i = 0; i < paramLength; i++) {
			var pair = params[i].split('=');
			result[pair[0]] = pair[1];
		}
		return result;
	}

	buildPlaceList() {
		let list = '<option></option>\n';
		for(var key in io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.AREAS) {
			if(! this.used.includes(key)) {
				list += `<option value="${key}">${io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.AREAS[key]}</option>\n`;
			}
		}
		return list;
	}

	buildMap() {
		this.dom.find('.paragraph').each((i, v)=>{
			const $dom = $(v);
			$dom.attr('id', `paragraph-${i}`);
			if(this.decided[i] || this.mode === io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.MODES.VIEW) {
				$dom.append(`<span class="paragraph-name" id="paragraph-name-${i}">${io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.AREAS[this.decided[i]] || '<br/>？'}</span>`);
				this.used.push(this.decided[i]);
			} else {
				$dom.append(`<select class="paragraph-select" id="paragraph-select-${i}"></select>`);
			}
		});
		const list = this.buildPlaceList();
		$('.paragraph-select').append(list);

		if(this.decided[io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.KEYS.CURRENT_PARAGRAPH]) {
			if(/\d+/.test(this.decided[io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.KEYS.CURRENT_PARAGRAPH])) {
				$(`#paragraph-${this.decided[io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.KEYS.CURRENT_PARAGRAPH]}`).addClass('paragraph-current-exist');
			} else {
				$(`.${this.decided[io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.KEYS.CURRENT_PARAGRAPH]}`).addClass('paragraph-current-exist');
			}
		}
		if(this.decided[io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.KEYS.SPLITTER]) {
			const spliters = this.decided[io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.KEYS.SPLITTER].split('s');
			spliters[0].split(',').filter((d)=>{return d}).forEach((v)=>{
				$(`#paragraph-${v}`).addClass('paragraph-lefttop2rightbottom');
			});
			spliters[1].split(',').filter((d)=>{return d}).forEach((v)=>{
				$(`#paragraph-${v}`).addClass('paragraph-righttop2leftbottom');
			});
		}
	};

	updatePage(key, val) {
		if(location.search) {
			if(location.search.indexOf(key) > -1) {
				const re = RegExp(`(${key}=[^&]*)`);
				location.href = location.href.replace(re, `${key}=${val}`);
			} else {
				location.href += `&${key}=${val}`;
			}
		} else {
			location.href += `?${key}=${val}`;
		}
	}

	moveToParagraph(e) {
		if(typeof e === 'string') {
			if(this.decided[io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.KEYS.CURRENT_PARAGRAPH] === e) {
				this.updatePage(io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.KEYS.CURRENT_PARAGRAPH, '');
			} else {
				this.updatePage(io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.KEYS.CURRENT_PARAGRAPH, e);
			}
		} else {
			let tag = $(e.target);
			if(tag.hasClass('paragraph-select')) {
				return;
			}
			if(tag.hasClass('paragraph-code')) {
				tag = tag.parent();
			}
			const domIdRE = /([a-z0-9]+)$/;
			const newPlaceId = domIdRE.exec(tag.attr('id'))[0];
			if(this.decided[io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.KEYS.CURRENT_PARAGRAPH] === newPlaceId) {
				this.updatePage(io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.KEYS.CURRENT_PARAGRAPH, '');
			} else {
				this.updatePage(io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.KEYS.CURRENT_PARAGRAPH, newPlaceId);
			}
		}
	}

	decideParagraph(e) {
		const key = $(e.target).attr('id').replace('paragraph-select-', '');
		const val = $(e.target).val();
		if(location.search) {
			location.href += `&${key}=${val}`;
		} else {
			location.href += `?${key}=${val}`;
		}
	}

	changeParagraphDivider(e) {
		e.preventDefault();
		const clicked = $(e.target);
		if(clicked.hasClass('paragraph-code')) {
			this.changeParagraphDivider({target: clicked.parent(), preventDefault:()=>{}});
			return;
		}
		const paragraphNum = /\d+/.exec($(clicked).attr('id'))[0];
		const tag = $(`#paragraph-${paragraphNum}`);
		const dividedParagraphs = (this.decided[io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.KEYS.SPLITTER] || 's').split('s').map((list)=>{
			return list.split(',');
		});
		if(tag.hasClass('paragraph-lefttop2rightbottom')) {
			dividedParagraphs[0] = dividedParagraphs[0].filter((v)=>{return v !== paragraphNum});
			dividedParagraphs[1].push(paragraphNum);
		} else if(tag.hasClass('paragraph-righttop2leftbottom')) {
			dividedParagraphs[1] = dividedParagraphs[1].filter((v)=>{return v !== paragraphNum});
		} else {
			dividedParagraphs[0].push(paragraphNum);
		}
		this.updatePage(io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS.KEYS.SPLITTER, dividedParagraphs.map((list)=>{return list.join(',')}).join('s'));
	}
	
	bindEvents() {
		$('.paragraph-select').change((e)=>{this.decideParagraph(e)});
		$('.paragraph').click((e)=>{this.moveToParagraph(e)});
		$('.westtown').click((e)=>{this.moveToParagraph('westtown')});
		$('.oldtown').click((e)=>{this.moveToParagraph('oldtown')});
		$('.newtown').click((e)=>{this.moveToParagraph('newtown')});
		$('.paragraph-fixed').click((e)=>{this.moveToParagraph(e)});
		$('.paragraph').contextmenu((e)=>{this.changeParagraphDivider(e)});
	}
};

io.github.shunshun94.trpg.scenarioTools.ViceCity.CONSTS = {
		KEYS: {
			CURRENT_PARAGRAPH: '_currentParagraph',
			SPLITTER: '_splitter'
		},
		MODES: {
			VIEW: 'view',
			EDIT: 'edit'
		},
		ID: 'io-github-shunshun94-trpg-scenarioTools-ViceCity',
		AREAS: {
			"11": "11 宿屋 ドワーフの火祭り亭",
			"12": "12 船乗りの家",
			"13": "13 始祖神の大神殿跡",
			"14": "14 運河に架かる橋",
			"15": "15 茶会通り",
			"16": "16 水没宮殿",
			"21": "21 奇怪な家",
			"22": "22 倒れた巨兵",
			"23": "23 自由市場",
			"24": "24 処刑台公園",
			"25": "25 凱旋通り",
			"26": "26 恐ろしの森",
			"31": "31 聖銀同盟",
			"32": "32 流民街",
			"33": "33 石の街",
			"34": "34 酒場 死にたがりの亡者亭",
			"35": "35 古戦場",
			"36": "36 時計塔屋敷",
			"41": "41 常夜紅城",
			"42": "42 奴隷商",
			"43": "43 オシャレ小路",
			"44": "44 鍋底",
			"45": "45 紫煙漂う裏路地",
			"46": "46 火葬場",
			"51": "51 つながれた浮遊岩",
			"52": "52 黒メノウ小路",
			"53": "53 大運河橋",
			"54": "54 死者の蠢く公園",
			"55": "55 迷宮小路",
			"56": "56 ミルタバル神殿市場",
			"61": "61 魔神窟",
			"62": "62 戦士の丘",
			"63": "63 魔女の占いの家",
			"64": "64 人形屋敷",
			"65": "65 黒鉄城",
			"66": "66 茨の館"
		}
};