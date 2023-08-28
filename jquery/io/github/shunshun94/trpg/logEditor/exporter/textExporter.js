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

io.github.shunshun94.trpg.logEditor.export.commonTextExporter.exec = (doms, dummy1, dummy2, dummy3) => {
    const exportResultArray = Array.from(doms.children()).map(jQuery).map(io.github.shunshun94.trpg.logEditor.export.commonTextExporter.convertDomToElements).map((p)=>{
        if(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(p.tag)) {
            const pad = '　'.repeat(Number(/\d/.exec(p.tag)[0]) - 1);
            return `${pad}│${p.content}\n${pad}└────────────────────────`;
        }
        if(p.tag === 'hr') {
            return '◆　　　◆　　　◆　　　◆　　　◆　　　◆　　　◆';
        }
        if(p.name) {
            return `【${p.name}】\n${p.content}`;
        }
        return p.content;
    });
    io.github.shunshun94.trpg.logEditor.export.commonTextExporter.download(exportResultArray.join('\n\n'));
};

io.github.shunshun94.trpg.logEditor.export.hamelnExporter = io.github.shunshun94.trpg.logEditor.export.hamelnExporter || {};

io.github.shunshun94.trpg.logEditor.export.hamelnExporter.exec = (doms, dummy1, dummy2, dummy3) => {
    const exportResultArray = Array.from(doms.children()).map(jQuery).map(io.github.shunshun94.trpg.logEditor.export.commonTextExporter.convertDomToElements).map((p)=>{
        if(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(p.tag)) {
            const pad = '　'.repeat(Number(/\d/.exec(p.tag)[0]) - 1);
            return `《big》《b》${p.content}《/b》《/big》`;
        }
        if(p.tag === 'hr') {
            return '《hr》';
        }
        if(p.name) {
            return `《b》【${p.name}】《/b》\n${p.content}`;
        }
        return p.content;
    });
    io.github.shunshun94.trpg.logEditor.export.commonTextExporter.download(exportResultArray.join('\n\n'));
};

io.github.shunshun94.trpg.logEditor.export.pixivExporter = io.github.shunshun94.trpg.logEditor.export.pixivExporter || {};

io.github.shunshun94.trpg.logEditor.export.pixivExporter.simpleObjectToText = (p) => {
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
};

io.github.shunshun94.trpg.logEditor.export.pixivExporter.exec = (doms, dummy1, dummy2, dummy3) => {
    const exportResultArray = Array.from(doms.children()).map(jQuery).map(io.github.shunshun94.trpg.logEditor.export.commonTextExporter.convertDomToElements).map(io.github.shunshun94.trpg.logEditor.export.pixivExporter.simpleObjectToText);
    io.github.shunshun94.trpg.logEditor.export.commonTextExporter.download(exportResultArray.join('\n\n'));
};

io.github.shunshun94.trpg.logEditor.export.pixivExporter.domListToOutput = (doms) => {
    return doms.doms.map(io.github.shunshun94.trpg.logEditor.export.pixivExporter.simpleObjectToText).join('\n\n');
};

io.github.shunshun94.trpg.logEditor.export.pixivExporter.download = io.github.shunshun94.trpg.logEditor.export.commonTextExporter.download;
