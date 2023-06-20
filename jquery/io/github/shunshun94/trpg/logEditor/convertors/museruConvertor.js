var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};
io.github.shunshun94.trpg.logEditor.convertors.MuseruConvertor = io.github.shunshun94.trpg.logEditor.convertors.MuseruConvertor ||{};

io.github.shunshun94.trpg.logEditor.convertors.MuseruConvertor.DEFAULT_TABS_CLASS = {
	'[メイン]': ' ',
	'[雑談]': 'tab1 '
};

io.github.shunshun94.trpg.logEditor.convertors.MuseruConvertor.dropEventToJson = (file) => {
	return new Promise((resolve, reject)=>{
		io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.fileToText(file).then((rawHtml)=>{
			resolve(io.github.shunshun94.trpg.logEditor.convertors.MuseruConvertor.htmlToJson(rawHtml));
		});
	});
};

io.github.shunshun94.trpg.logEditor.convertors.MuseruConvertor.postToJson = (post) => {
	const result = {
		tag: 'p',
		id: '',
	};
	const postElements = post.childNodes;
    result.class = io.github.shunshun94.trpg.logEditor.convertors.MuseruConvertor.DEFAULT_TABS_CLASS[postElements[0].textContent] || 'tab1';

    const postBodyElement = postElements[1];
	result.name = postBodyElement.childNodes[0].textContent;
    result.style = `color:${postBodyElement.getAttribute('color')};`;
    result.content = postBodyElement.innerHTML.replace(`<b>${result.name}</b>：`, '');

	return result;
};

io.github.shunshun94.trpg.logEditor.convertors.MuseruConvertor.htmlToJson = (rawHtml) => {
	const dom = (new DOMParser()).parseFromString(rawHtml, 'text/html');
	const nodes = Array.from(dom.body.children[1].children);
	return {
		doms: nodes.map(io.github.shunshun94.trpg.logEditor.convertors.MuseruConvertor.postToJson),
		omitted: [],
		head: '',
		tabs: io.github.shunshun94.trpg.logEditor.convertors.MuseruConvertor.DEFAULT_TABS_CLASS
	};
};
