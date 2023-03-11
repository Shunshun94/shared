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
		style: post.element.getAttribute('style') || '',
		id: '',
		class: post.class
	};
	const postElements = post.element.childNodes;
	result.name = postElements[0].textContent;
	result.content = post.element.innerHTML.replace(`<b>${result.name}</b>：`, '');
	return result;
};

io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.htmlToJson = (rawHtml) => {
	const dom = (new DOMParser()).parseFromString(rawHtml, 'text/html');
	const nodes = Array.from(dom.body.childNodes);
	const posts = [];
	nodes.forEach((n, i)=>{
		if( i % 3 === 0) {
			posts.push({
				class: io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.DEFAULT_TABS_CLASS[n.textContent.trim()] || 'tab1'
			});
		}
		if( i % 3 === 1) {
			posts.at(-1).element = n;
		}
	});
	return {
		doms: posts.filter((p)=>{return p.class && p.element}).map(io.github.shunshun94.trpg.logEditor.convertors.TekeyV1Converter.postToJson),
		omitted: [],
		head: ''
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
	const result = {
		tag: 'p',
		style: post.getAttribute('style') || '',
		id: '',
		class: rawClassNameNumber ? `tab${rawClassNameNumber}` : ''
	};
	post.removeChild(post.lastChild);
	const postElements = post.childNodes;
	result.name = postElements[0].textContent.slice(0, -1);
	result.content = post.innerHTML.replace(`<b>${result.name}：</b>`, '');
	return result;
};

io.github.shunshun94.trpg.logEditor.convertors.TekeyV2Converter.htmlToJson =(rawHtml) => {
    const dom = (new DOMParser()).parseFromString(rawHtml, 'text/html');
	const posts = Array.from(dom.body.children[0].children[0].children);
	const list = posts.map(io.github.shunshun94.trpg.logEditor.convertors.TekeyV2Converter.postToJson);
	return {
		doms: list,
		omitted: [],
		head: ''
	};
};