var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.commonTextExporter = io.github.shunshun94.trpg.logEditor.export.commonTextExporter || {};

io.github.shunshun94.trpg.logEditor.export.commonTextExporter.convertDomToElements = (dom) => {
    const tag = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-tag`).val().trim();
    const name = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).text().trim();
	const content = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.CONTENT}`).html().split('\n').join('').replaceAll(/<br\/?>/gm, '\n').replaceAll('\t', '').replaceAll(/<\/?[^>]*>/gm, '').trim();
    return {
        tag: tag,
        name: name,
        content: content
    };
};

io.github.shunshun94.trpg.logEditor.export.commonTextExporter.download = (text) => {
	const url = window.URL.createObjectURL(new Blob([ text ], { "type" : 'text/plain;charset=utf-8;' }));
	const dlLink = document.createElement("a");
	document.body.appendChild(dlLink);
	dlLink.download = `saved_${Number(new Date())}.txt`;
	dlLink.href = url;
	dlLink.click();
	dlLink.remove();
	URL.revokeObjectURL(url);
};

io.github.shunshun94.trpg.logEditor.export.pixivExporter = io.github.shunshun94.trpg.logEditor.export.pixivExporter || {};

io.github.shunshun94.trpg.logEditor.export.pixivExporter.exec = (doms, dummy1, dummy2, dummy3) => {
    const exportResultArray = Array.from(doms.children()).map(jQuery).map(io.github.shunshun94.trpg.logEditor.export.commonTextExporter.convertDomToElements).map((p)=>{
        if(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(p.tag)) {
            return `[chapter:${p.content}]`;
        }
        if(p.tag === 'hr') {
            return '◆　　　◆　　　◆　　　◆　　　◆　　　◆　　　◆';
        }
        if(p.name) {
            return `【${p.name}】\n${p.content}`;
        }
        return p.content;
    });
    console.log(doms.children(), Array.from(doms.children()), exportResultArray);
    io.github.shunshun94.trpg.logEditor.export.commonTextExporter.download(exportResultArray.join('\n\n'));
};
