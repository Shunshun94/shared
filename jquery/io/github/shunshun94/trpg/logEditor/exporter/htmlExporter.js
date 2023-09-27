var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.htmlExporter = io.github.shunshun94.trpg.logEditor.export.htmlExporter || {};

io.github.shunshun94.trpg.logEditor.export.htmlExporter.SUFFIX = `</body></html>`;
io.github.shunshun94.trpg.logEditor.export.htmlExporter.LAST_HASH = '';

io.github.shunshun94.trpg.logEditor.export.htmlExporter.getPrefix = (mode) => {
	return `<!DOCTYPE html>
	<html>
	<head>
	  <meta charset="utf-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
	  <link rel="stylesheet" href="https://shunshun94.github.io/shared/jquery/io/github/shunshun94/trpg/logEditor/resources/default${ mode ? '-' + mode : ''}.css" type="text/css" />
	</head>
	<body>`;
};

io.github.shunshun94.trpg.logEditor.export.htmlExporter.getLastHash = ()=>{
	return io.github.shunshun94.trpg.logEditor.export.htmlExporter.LAST_HASH;
};

io.github.shunshun94.trpg.logEditor.export.htmlExporter.setLastHash = (hash)=>{
	io.github.shunshun94.trpg.logEditor.export.htmlExporter.LAST_HASH = hash;
};

io.github.shunshun94.trpg.logEditor.export.htmlExporter.calcCurrentHash = (doms, head, omit, mode) => {
	const body = io.github.shunshun94.trpg.logEditor.export.htmlExporter.generateBody(doms);
	const html = (head ? `<!DOCTYPE html>\n<html>\n${head}\n<body>\n` : io.github.shunshun94.trpg.logEditor.export.htmlExporter.getPrefix(mode)) +
				body + omit.join('\n') + io.github.shunshun94.trpg.logEditor.export.htmlExporter.SUFFIX;
	const hash = new jsSHA("SHA-256", 'TEXT');
	hash.update(html);
	const newHash = hash.getHash("HEX");
	return newHash;
};

io.github.shunshun94.trpg.logEditor.export.htmlExporter.exec = (doms, head, omit, mode, title) => {
	const body = io.github.shunshun94.trpg.logEditor.export.htmlExporter.generateBody(doms);
	const html = (head ? `<!DOCTYPE html>\n<html>\n${head}\n<body>\n` : io.github.shunshun94.trpg.logEditor.export.htmlExporter.getPrefix(mode)) +
				body + omit.join('\n') + io.github.shunshun94.trpg.logEditor.export.htmlExporter.SUFFIX;
	const hash = new jsSHA("SHA-256", 'TEXT');
	hash.update(html);
	const newHash = hash.getHash("HEX");
	io.github.shunshun94.trpg.logEditor.export.htmlExporter.setLastHash(newHash);
	io.github.shunshun94.trpg.logEditor.export.htmlExporter.download(html, title);
};

io.github.shunshun94.trpg.logEditor.export.htmlExporter.generateExportPostTopAttributes = (dom) => {
	const topAttributesMap = {
		class: dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-class`).val().trim(),
		id: dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-id`).val().trim(),
		style: dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-style`).val().trim()
	};
	const topAttributes = [];
	for(const key in topAttributesMap) {
		if(topAttributesMap[key]) {
			topAttributes.push(`${key}="${topAttributesMap[key]}"`);
		}
	}
	return topAttributes.join(' ').trim();
};

io.github.shunshun94.trpg.logEditor.export.htmlExporter.generateExportPost = (dummy, dom) => {
	const tag = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-tag`).val().trim();
	const topAttributes = io.github.shunshun94.trpg.logEditor.export.htmlExporter.generateExportPostTopAttributes(dom);
	if(tag === 'hr') {
		return `<hr ${topAttributes} />`;
	}
	const name = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).html().trim();
	// contenteditable で改行すると div 要素が入るので除く
	const content = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.CONTENT}`).html().
				replace(/^<div>/, '').
				replaceAll('</div><!-- keep -->', '</dummy>').
				replaceAll('<div><br></div>', '<br>').
				replaceAll('<div>', '<br>').
				replaceAll('</div>', '').
				replaceAll('</dummy>', '</div>').trim();
	if((tag !== 'p') || (name === '')) {
		return `<${tag} ${topAttributes}>${content}</${tag}>`
	}
	if(dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).html()) {
		const result = [];
		result.push(`<p ${topAttributes}>`);
		result.push(`  <span></span>`);
		result.push(`  <span>${name}</span>`);
		result.push(`  <span>${content}</span>`);
		result.push(`</p>`);
		return result.join('\n');
	} else {
		return `<p ${topAttributes}>${content}</p>`;
	}
};

io.github.shunshun94.trpg.logEditor.export.htmlExporter.generateBody = (doms) => {
	const result = [];
	doms.children().each((i, v)=>{
		result.push(io.github.shunshun94.trpg.logEditor.export.htmlExporter.generateExportPost(i, $(v)));
	});
	return result.join('\n\n');
};

io.github.shunshun94.trpg.logEditor.export.htmlExporter.download = (html, title) => {
	const url = window.URL.createObjectURL(new Blob([ html ], { "type" : 'text/html;charset=utf-8;' }));
	const dlLink = document.createElement("a");
	document.body.appendChild(dlLink);
	dlLink.download = `${title}_${Number(new Date())}.html`;
	dlLink.href = url;
	dlLink.click();
	dlLink.remove();
	URL.revokeObjectURL(url);
};

io.github.shunshun94.trpg.logEditor.export.htmlExporter.domJsonToHtml = (json) => {
	const tag = json.tag;
	const topAttributes = ['class', 'id', 'style'].map((attrName)=>{
		if(json[attrName]) {
			return `${attrName}="${json[attrName].trim()}"`;
		} else {
			return '';
		}
	}).join(' ');
	if(tag === 'hr') {
		return `<hr ${topAttributes} />`;
	}
	const name = (json.name || '').trim();
	// contenteditable で改行すると div 要素が入るので除く
	const content = json.content.trim();
	if((tag !== 'p') || (name === '')) {
		return `<${tag} ${topAttributes}>${content}</${tag}>`
	}

	const result = [];
	result.push(`<p ${topAttributes}>`);
	result.push(`  <span></span>`);
	result.push(`  <span>${name}</span>`);
	result.push(`  <span>${content}</span>`);
	result.push(`</p>`);
	return result.join('\n');
};

io.github.shunshun94.trpg.logEditor.export.htmlExporter.domListToOutput = (domList, mode = '') => {
	return (domList.head ? `<!DOCTYPE html>\n<html>\n${domList.head}\n<body>\n` : io.github.shunshun94.trpg.logEditor.export.htmlExporter.getPrefix(mode)) +
			domList.doms.map(io.github.shunshun94.trpg.logEditor.export.htmlExporter.domJsonToHtml).join('\n') +
			domList.omitted.join('\n') +
			io.github.shunshun94.trpg.logEditor.export.htmlExporter.SUFFIX;
};
