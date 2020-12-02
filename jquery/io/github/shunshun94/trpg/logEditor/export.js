var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.PREFIX = `<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="https://shunshun94.github.io/shared/jquery/io/github/shunshun94/trpg/replay/replay4-ccfolia.css"　type="text/css" />
</head>
<body>`;
io.github.shunshun94.trpg.logEditor.export.SUFFIX = `</body></html>`;

io.github.shunshun94.trpg.logEditor.export.exec = (doms) => {
	const body = io.github.shunshun94.trpg.logEditor.export.generateBody(doms);
	const html = io.github.shunshun94.trpg.logEditor.export.PREFIX + body + io.github.shunshun94.trpg.logEditor.export.SUFFIX;
	io.github.shunshun94.trpg.logEditor.export.download(html);
};

io.github.shunshun94.trpg.logEditor.export.generateExportPostTopAttributes = (dom) => {
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

io.github.shunshun94.trpg.logEditor.export.generateExportPost = (dummy, dom) => {
	const tag = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-tag`).val().trim();
	const topAttributes = io.github.shunshun94.trpg.logEditor.export.generateExportPostTopAttributes(dom);
	if(tag === 'hr') {
		return `<hr ${topAttributes} />`;
	}
	// contenteditable で改行すると div 要素が入るので除く
	const content = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.CONTENT}`).html().replaceAll('<div>', '<br>').replaceAll('</div>', '').trim();
	if(tag !== 'p') {
		return `<${tag} ${topAttributes}>${content}</${tag}>`
	}
	if(dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).html()) {
		const name = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).html().trim();
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

io.github.shunshun94.trpg.logEditor.export.generateBody = (doms) => {
	const result = [];
	doms.children().each((i, v)=>{
		result.push(io.github.shunshun94.trpg.logEditor.export.generateExportPost(i, $(v)));
	});
	return result.join('\n\n');
};

io.github.shunshun94.trpg.logEditor.export.download = (html) => {
	const url = window.URL.createObjectURL(new Blob([ html ], { "type" : 'text/html;charset=utf-8;' }));
	const dlLink = document.createElement("a");
	document.body.appendChild(dlLink);
	dlLink.download = `saved_${Number(new Date())}.html`;
	dlLink.href = url;
	dlLink.click();
	dlLink.remove();
	URL.revokeObjectURL(url);
};