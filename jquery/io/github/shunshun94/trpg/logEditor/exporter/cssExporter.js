var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.cssExporter = io.github.shunshun94.trpg.logEditor.export.cssExporter || {};

io.github.shunshun94.trpg.logEditor.export.cssExporter.IGNORE_CLASSES = ['tab1'];

io.github.shunshun94.trpg.logEditor.export.cssExporter.exec = (doms, dummy1, dummy2, dummy3, title) => {
    const array = io.github.shunshun94.trpg.logEditor.export.cssExporter.domsToJson(doms);
    const classes = io.github.shunshun94.trpg.logEditor.export.cssExporter.domJsonToCSS(array);
    const text = io.github.shunshun94.trpg.logEditor.export.cssExporter.convertClassesToText(classes);
    io.github.shunshun94.trpg.logEditor.export.cssExporter.download(text, title);
};

io.github.shunshun94.trpg.logEditor.export.cssExporter.convertClassesToText = (classes) => {
    const resultTextArray = [];
    for(var className in classes) {
        resultTextArray.push('/*********************');
        resultTextArray.push(classes[className].map((name)=>{
            return ` * ${name}`;
        }));
        resultTextArray.push(' *********************/');
        resultTextArray.push(`.${className} {\n  \n}`);
        resultTextArray.push('');
    }
    return resultTextArray.flat().join('\n');
};

io.github.shunshun94.trpg.logEditor.export.cssExporter.domToJson = (dummy, jqDom) => {
    return {
        tag: jqDom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-tag`).val().trim(),
        name: jqDom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).html().trim(),
        class: jqDom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-class`).val().trim()
    };
};

io.github.shunshun94.trpg.logEditor.export.cssExporter.domsToJson = (doms) => {
    const result = [];
	doms.children().each((i, v)=>{
		result.push(io.github.shunshun94.trpg.logEditor.export.cssExporter.domToJson(i, $(v)));
	});
    return result;
};

io.github.shunshun94.trpg.logEditor.export.cssExporter.domJsonToCSS = (doms) => {
    const classes = {};
    doms.filter((d)=>{ return d.class && (d.name || d.tag); }).forEach((d)=>{
        const name = d.name || d.tag;
        d.class.split(' ').filter((c)=>{
            return ! io.github.shunshun94.trpg.logEditor.export.cssExporter.IGNORE_CLASSES.includes(c);
        }).forEach((c)=>{
            if(! classes[c]) { classes[c] = []; }
            if( name && (! classes[c].includes(name)) ) {
                classes[c].push(name);
            }
        });
    });
    return classes;
};

io.github.shunshun94.trpg.logEditor.export.cssExporter.download = (text, title) => {
    const url = window.URL.createObjectURL(new Blob([ text ], { "type" : 'text/css;charset=utf-8;' }));
    const dlLink = document.createElement("a");
    document.body.appendChild(dlLink);
    dlLink.download = `${title}_${Number(new Date())}.css`;
    dlLink.href = url;
    dlLink.click();
    dlLink.remove();
    URL.revokeObjectURL(url);
};