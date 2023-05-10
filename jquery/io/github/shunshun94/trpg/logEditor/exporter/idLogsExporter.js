var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.IdLogExporter = io.github.shunshun94.trpg.logEditor.export.IdLogExporter || {};

io.github.shunshun94.trpg.logEditor.export.IdLogExporter.generateIdListJson = (doms) => {
    const result = [];
    doms.children().each((i, v)=>{
        const dom = $(v);
        const id = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-id`).val().trim();
        if(id) {
            const item = {
                id: id,
                element: {
                    elementNumber: i,
                    tag: dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-tag`).val().trim()
                }
            };
            const content = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.CONTENT}`).text().trim();
            if(content) { item.element.content = content; }

            const name = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).text().trim();
            if(name   ) { item.element.name    = name; }

            result.push(item);
        }
	});
    return result;
};

io.github.shunshun94.trpg.logEditor.export.IdLogExporter.exec = (doms) => {
    const download = (text) => {
        const url = window.URL.createObjectURL(new Blob([ text ], { "type" : 'text/json;charset=utf-8;' }));
        const dlLink = document.createElement("a");
        document.body.appendChild(dlLink);
        dlLink.download = `id_list_json_saved_${Number(new Date())}.json`;
        dlLink.href = url;
        dlLink.click();
        dlLink.remove();
        URL.revokeObjectURL(url);
    };

    download(JSON.stringify(io.github.shunshun94.trpg.logEditor.export.IdLogExporter.generateIdListJson(doms), null, 2));
};
