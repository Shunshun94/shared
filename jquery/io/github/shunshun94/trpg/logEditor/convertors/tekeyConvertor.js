var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};
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
	const postElements = post.childNodes;
	result.name = postElements[0].textContent.slice(0, -1);
	result.content = postElements[1].textContent;
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
