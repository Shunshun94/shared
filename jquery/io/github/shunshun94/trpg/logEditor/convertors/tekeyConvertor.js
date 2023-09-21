var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};
io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter = io.github.shunshun94.trpg.logEditor.convertors.TekeyV2Converter || {};

io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.DEFAULT_TABS_CLASS = {
	'[メイン]': ' ',
	'[雑談]': 'tab1 '
};
io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.REGEXP = {
	MODIFY_RESOURCE: /(.*)の(.*)を(-?\d?[dD]?\d+)\(?-?\d*\s*→?\s*-?\d*\)?に?[増減変][加少更]\s*\((-?\d+)\s→\s(-?\d+)\)/
};

io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.dropEventToJson = (file) => {
	return new Promise((resolve, reject)=>{
		io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.fileToText(file).then((rawHtml)=>{
			resolve(io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.htmlToJson(rawHtml));
		});
	});
};

io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.postToJson = (post) => {
	const result = {
		tag: 'p',
		style: (post.element.getAttribute('style') || '') + (post.element.getAttribute('color') ? `color: ${post.element.getAttribute('color')};` : ''),
		id: '',
		class: post.class,
		tabName: post.tabName
	};
	const postElements = post.element.childNodes;
	result.name = postElements[0].textContent;
	result.content = post.element.innerHTML.replace(`<b>${result.name}</b>：`, '').replaceAll(`&nbsp;`, ' ');;
	return result;
};

io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.htmlToJson = (rawHtml) => {
	const dom = (new DOMParser()).parseFromString(rawHtml, 'text/html');
	const nodes = Array.from(dom.body.childNodes);
	const posts = [];
	nodes.forEach((n, i)=>{
		if( i % 3 === 0) {
			const tabName = n.textContent.trim() || '[システム]';
			if(! io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.DEFAULT_TABS_CLASS[tabName]) {
				io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.DEFAULT_TABS_CLASS[tabName] = `tab${Object.keys(io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.DEFAULT_TABS_CLASS).length}`;
			}
			posts.push({
				class: io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.DEFAULT_TABS_CLASS[tabName] || 'tab1',
				tabName: n.textContent.trim()
			});
		}
		if( i % 3 === 1) {
			posts.at(-1).element = n;
		}
	});
	return {
		doms: io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.modifyResrouceToOriginalFormat(
			posts.filter((p)=>{return p.class && p.element}).map(io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.postToJson)
		),
		omitted: [],
		head: '',
		tabs: io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.DEFAULT_TABS_CLASS
	};
};


io.github.shunshun94.trpg.logEditor.convertors.TekeyV2Converter = io.github.shunshun94.trpg.logEditor.convertors.TekeyV2Converter || {};

io.github.shunshun94.trpg.logEditor.convertors.TekeyV2Converter.dropEventToJson = (file) => {
	return new Promise((resolve, reject)=>{
		io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.fileToText(file).then((rawHtml)=>{
			resolve(io.github.shunshun94.trpg.logEditor.convertors.TekeyV2Converter.htmlToJson(rawHtml));
		});
	});
};

io.github.shunshun94.trpg.logEditor.convertors.TekeyV2Converter.postToJson = (post) => {
	const rawClassNameNumberExec = /tab(\d+)/.exec(post.className);
	const rawClassNameNumber = rawClassNameNumberExec ? (Number(rawClassNameNumberExec[1]) - 1) : 0;
	const tabName = `${rawClassNameNumber + 1}番目のタブ`;
	const result = {
		tag: 'p',
		style: post.getAttribute('style') || '',
		id: '',
		class: rawClassNameNumber ? `tab${rawClassNameNumber}` : '',
		tabName: tabName
	};
	post.removeChild(post.lastChild);
	const postElements = post.childNodes;
	result.name = postElements[0].textContent.slice(0, -1);
	result.content = post.innerHTML.replace(`<b>${result.name}：</b>`, '').replaceAll(`&nbsp;`, ' ');
	return result;
};

io.github.shunshun94.trpg.logEditor.convertors.TekeyV2Converter.htmlToJson =(rawHtml) => {
    const dom = (new DOMParser()).parseFromString(rawHtml, 'text/html');
	const posts = Array.from(dom.body.children[0].children[0].children);
	const list = posts.map(io.github.shunshun94.trpg.logEditor.convertors.TekeyV2Converter.postToJson);
	return {
		doms: io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.modifyResrouceToOriginalFormat(list),
		omitted: [],
		head: '',
		tabs: io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.DEFAULT_TABS_CLASS
	};
};

io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.modifyResrouceToOriginalFormat = (posts) => {
	const regexp = io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.REGEXP.MODIFY_RESOURCE;
	return posts.map((post)=>{
		const reResult = regexp.exec(post.content || '');
		console.log(reResult, post.content);
		if(reResult) {
			post.name = 'system';
			post.content = `[ ${reResult[1]} ] ${reResult[2]} : ${reResult[4]} → ${reResult[5]}`;
		}
		return post;
	});
};
