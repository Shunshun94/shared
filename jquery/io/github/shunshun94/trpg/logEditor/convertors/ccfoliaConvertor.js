var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};
io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor = io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor ||{};

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.IGNORE_TAGS = ['script'];
io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.DEFAULT_TABS_CLASS = {
	'[メイン]': ' ',
	'[雑談]': 'tab1 '
};
io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.TAB_COUNTER = 2;

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.elementToJson = (elem) => {
	const tagName = elem.localName;
	if(io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.IGNORE_TAGS.includes(tagName)) {
		return false;
	}
	const result = {tag: tagName};
	const children = elem.children;
	if(tagName === 'p' && children.length === 3) {
		result.name = children[1].innerHTML.trim();
		result.content = children[2].innerHTML.trim();
		result.tabName = children[0].innerHTML.trim();
	} else { 
		result.content = elem.innerHTML.trim();
	}
	const multiRollRegExp = /^x\d+|^repeat\d+|^rep\d+/i;
	if(multiRollRegExp.test(result.content)) {
		const tmp = result.content.split('\n').map((l)=>{return l.trim();}).join('');
		if(! (tmp.includes('<br>#2') || tmp.includes('<br/>#2'))) {
			result.content = result.content.replace(' #1\n', '<br/>#1<br/>').split('\n').join('<br/>');
		}
	}

	result.title = elem.getAttribute('title') || '';
	result.style = elem.getAttribute('style') || '';
	result.id = elem.getAttribute('id') || '';

	if(result.tabName && (! io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.DEFAULT_TABS_CLASS[result.tabName])) {
		io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.DEFAULT_TABS_CLASS[result.tabName] = `tab${io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.TAB_COUNTER} `;
	}
	result.class = elem.getAttribute('class') || (result.tabName ? `${io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.DEFAULT_TABS_CLASS[result.tabName]}${result.tabName.slice(1, -1)}` : '').trim();

	return result;
};

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.dropEventToJson = (file) => {
	return new Promise((resolve, reject)=>{
		io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.fileToText(file).then((rawHtml)=>{
			resolve(io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.htmlToJson(rawHtml));
		});
	});
};

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.isDefaultHead = (headRawHtml) => {
	return headRawHtml.includes(`<title>ccfolia - `);
};

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.htmlToJson = (rawDom) => {
	const dom = (new DOMParser()).parseFromString(rawDom, 'text/html');
	const bodyChildren = dom.body.children;
	const bodyChildrenLength = bodyChildren.length;
	const list = [];
	const omit = [];
	for(var i = 0; i < bodyChildrenLength; i++) {
		const json = io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.elementToJson(bodyChildren[i]);
		if(json) { list.push(json) } else { omit.push(bodyChildren[i].outerHTML); }
	}
	const header = io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.isDefaultHead(dom.head.outerHTML) ? '' : dom.head.outerHTML;
	
	return {
		doms: list,
		omitted: omit,
		head: header
	};
};
