var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.default = io.github.shunshun94.trpg.logEditor.export.htmlExporter;

io.github.shunshun94.trpg.logEditor.export.getExporter = (mode) => {
    if(mode === 'html' || mode === 'HTML') {
        return io.github.shunshun94.trpg.logEditor.export.htmlExporter;
    }
    if(mode === 'pixiv') {
        return io.github.shunshun94.trpg.logEditor.export.pixivExporter;
    }
    return io.github.shunshun94.trpg.logEditor.export.default;
};


