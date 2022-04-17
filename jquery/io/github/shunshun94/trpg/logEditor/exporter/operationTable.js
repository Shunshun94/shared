var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.OperationTableExporter = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter || {};
io.github.shunshun94.trpg.logEditor.export.OperationJsonExporter = io.github.shunshun94.trpg.logEditor.export.OperationJsonExporter || {};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.domToJson = (doms) => {
    const result = [];
    Array.from(doms.children()).filter((dom, i)=>{
        return $(dom).find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-tag`).val().trim() === 'p';
    }).map((dom, i)=>{
        const d = $(dom);
        return {
            name: d.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).html().trim(),
            content: d.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.CONTENT}`).html().
            replace(/^<div>/, '').
            replaceAll('</div><!-- keep -->', '</dummy>').
            replaceAll('<div><br></div>', '<br>').
            replaceAll('<div>', '<br>').
            replaceAll('</div>', '').
            replaceAll('</dummy>', '</div>').trim()
        }
    }).forEach((d)=>{

    });

    return result;
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.exec = (doms, head, omit, mode) => {
    const json = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.domToJson(doms);
    const html = '';
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.download(html, `saved_${Number(new Date())}.html`, 'text/html;charset=utf-8;');
};



io.github.shunshun94.trpg.logEditor.export.OperationJsonExporter.exec = (doms, head, omit, mode) => {
    const json = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.domToJson(doms);
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.download(json, `saved_${Number(new Date())}.json`, 'text/json;charset=utf-8;');
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.download = (text, title, type) => {
	const url = window.URL.createObjectURL(new Blob([ text ], { "type" : type }));
	const dlLink = document.createElement("a");
	document.body.appendChild(dlLink);
	dlLink.download = title;
	dlLink.href = url;
	dlLink.click();
	dlLink.remove();
	URL.revokeObjectURL(url);
};
