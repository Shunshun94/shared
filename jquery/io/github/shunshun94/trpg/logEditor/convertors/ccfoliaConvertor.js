var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};

io.github.shunshun94.trpg.logEditor.tmp;

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor = io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor ||{};

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.IGNORE_TAGS = ['script'];
io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.DEFAULT_TABS_CLASS = {
	'[メイン]': 'tab0',
	'[情報]': 'tab0',
	'[雑談]': 'tab1'
};

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
	result.title = elem.getAttribute('title') || '';
	result.style = elem.getAttribute('style') || io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.DEFAULT_TABS_CLASS[result.tabName] || '';
	result.id = elem.getAttribute('id') || '';
	result.class = elem.getAttribute('class') || '';

	return result;
};

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.dropEventToJson = (e) => {
	return new Promise((resolve, reject)=>{
		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			const codes = new Uint8Array(fileReader.result);
			const rawHtml = Encoding.convert(codes, {
				to: 'unicode',
				from: Encoding.detect(codes),
				type: 'string'
			});
			resolve(io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.htmlToJson(rawHtml));
		};
		fileReader.readAsArrayBuffer(e.originalEvent.dataTransfer.files[0]);
	});
};

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.htmlToJson = (rawDom) => {
	const dom = (new DOMParser()).parseFromString(rawDom, 'text/html');
	io.github.shunshun94.trpg.logEditor.tmp = dom;
	const bodyChildren = dom.body.children;
	const bodyChildrenLength = bodyChildren.length;
	const list = [];
	for(var i = 0; i < bodyChildrenLength; i++) {
		const json = io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.elementToJson(bodyChildren[i]);
		if(json) { list.push(json) }
	}	
	return list;
};
