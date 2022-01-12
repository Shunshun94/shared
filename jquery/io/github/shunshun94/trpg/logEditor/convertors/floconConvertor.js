var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};
io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor = io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor ||{};

io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.DEFAULT_TABS_CLASS = {
	'メイン': ' '
};

io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.SYSTEM_NAME = [
	'システムメッセージ'
];

io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.TAB_COUNTER = 1;

io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.elementToJson = (elem) => {
	const result = {
		tag: 'p',
		style: elem.getAttribute('style') || '',
		id: '',
		class: ''
	};
	const children = Array.from(elem.children);

	result.name = children[0].innerText.trim() || children[1].innerText.trim();

	const contentCandidate = elem.getElementsByClassName('text');
	result.content = contentCandidate.length ? contentCandidate[0].innerText.replaceAll('\n', '<br/>') : '';

	if(! io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.SYSTEM_NAME.includes(result.name)) {
		const tabCandidate = children.map((d)=>{
			return d.innerText.trim();
		}).filter((text)=>{
			return text.startsWith('(') && text.endsWith(')');
		});
		if(tabCandidate.length) {
			const tabName = /\((.+)\)/.exec(tabCandidate[0])[1];
			if(io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.DEFAULT_TABS_CLASS[tabName]) {
				result.class = io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.DEFAULT_TABS_CLASS[tabName];
			} else {
				io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.DEFAULT_TABS_CLASS[tabName] = `tab${io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.TAB_COUNTER}`;
				result.class = io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.DEFAULT_TABS_CLASS[tabName];
				io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.TAB_COUNTER++;
			}
		}
	}

	return result;
};

io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.dropEventToJson = (file) => {
	return new Promise((resolve, reject)=>{
		io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.fileToText(file).then((rawHtml)=>{
			resolve(io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.htmlToJson(rawHtml));
		});
	});
};

io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.isDefaultHead = (headRawHtml) => {
	return headRawHtml.includes(`<title>ccfolia - `);
};

io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.htmlToJson = (rawDom) => {
	const dom = (new DOMParser()).parseFromString(rawDom, 'text/html');
	const bodyChildren = Array.from(dom.body.children[0].children);
	const list = bodyChildren.map(io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor.elementToJson);	
	return {
		doms: list,
		omitted: [],
		head: ''
	};
};
