var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.default = io.github.shunshun94.trpg.logEditor.export.htmlExporter;

io.github.shunshun94.trpg.logEditor.export.ExpoterMap = {
    html: io.github.shunshun94.trpg.logEditor.export.htmlExporter,
    pixiv: io.github.shunshun94.trpg.logEditor.export.pixivExporter,
    hameln: io.github.shunshun94.trpg.logEditor.export.hamelnExporter,
    commonText: io.github.shunshun94.trpg.logEditor.export.commonTextExporter,
};

io.github.shunshun94.trpg.logEditor.export.getExporter = (mode) => {
    return io.github.shunshun94.trpg.logEditor.export.ExpoterMap[mode] || io.github.shunshun94.trpg.logEditor.export.default;
};
