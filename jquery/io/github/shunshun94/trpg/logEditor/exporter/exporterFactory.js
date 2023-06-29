var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.default = io.github.shunshun94.trpg.logEditor.export.htmlExporter;

io.github.shunshun94.trpg.logEditor.export.ExpoterMap = {
    html: io.github.shunshun94.trpg.logEditor.export.htmlExporter,
    css: io.github.shunshun94.trpg.logEditor.export.cssExporter,
    ytchat: io.github.shunshun94.trpg.logEditor.export.ytchatExporter,

    pixiv: io.github.shunshun94.trpg.logEditor.export.pixivExporter,
    hameln: io.github.shunshun94.trpg.logEditor.export.hamelnExporter,
    commonText: io.github.shunshun94.trpg.logEditor.export.commonTextExporter,

    operationTable: io.github.shunshun94.trpg.logEditor.export.OperationTableExporter,
    operationJson: io.github.shunshun94.trpg.logEditor.export.OperationJsonExporter,
    UniCoeText: io.github.shunshun94.trpg.logEditor.export.UniCoeExporter,
    YukkuriMovieMaker: io.github.shunshun94.trpg.logEditor.export.YukkuriMovieMakerExporter,

    IdLogExporter: io.github.shunshun94.trpg.logEditor.export.IdLogExporter
};

io.github.shunshun94.trpg.logEditor.export.getExporter = (mode) => {
    return io.github.shunshun94.trpg.logEditor.export.ExpoterMap[mode] || io.github.shunshun94.trpg.logEditor.export.default;
};
