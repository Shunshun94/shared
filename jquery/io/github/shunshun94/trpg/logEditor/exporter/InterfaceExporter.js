var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.InterfaceExporter = io.github.shunshun94.trpg.logEditor.export.InterfaceExporter || {};

/**************************************************************************
 *追加したら exportFactory.js と menu/saveMenu.js への追加も忘れないこと！*
 *************************************************************************/

io.github.shunshun94.trpg.logEditor.export.InterfaceExporter.exec = (doms, head, omit, mode, title) => {
    download('出力結果');
};

io.github.shunshun94.trpg.logEditor.export.htmlExporter.download = (text, title) => {
    const url = window.URL.createObjectURL(new Blob([ text ], { "type" : 'text/plain;charset=utf-8;' }));
    const dlLink = document.createElement("a");
    document.body.appendChild(dlLink);
    dlLink.download = `${title}_${Number(new Date())}.txt`;
    dlLink.href = url;
    dlLink.click();
    dlLink.remove();
    URL.revokeObjectURL(url);
};

io.github.shunshun94.trpg.logEditor.export.htmlExporter.domListToOutput = (domList, mode = '') => {
	return '出力結果';
};