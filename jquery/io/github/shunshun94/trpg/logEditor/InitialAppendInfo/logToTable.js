var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};

io.github.shunshun94.trpg.logEditor.LogToTable = io.github.shunshun94.trpg.logEditor.LogToTable || {};

io.github.shunshun94.trpg.logEditor.LogToTable.STOCKED_LIST = [];

io.github.shunshun94.trpg.logEditor.DOMS.BODY.on(io.github.shunshun94.trpg.logEditor.EVENTS.FILE_LOADED, (e, domList)=>{
    $('.ltt-download').show();
    io.github.shunshun94.trpg.logEditor.LogToTable.STOCKED_LIST = io.github.shunshun94.trpg.logEditor.LogToTable.STOCKED_LIST.concat(
        io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.fileLoaderResultToJson(domList)
    );
});

io.github.shunshun94.trpg.logEditor.LogToTable.buildHtml = () => {
    const result = document.createElement('div');
    result.setAttribute('style', 'position:absolute;top:0px;left:600px;padding:2em;');

    const title = document.createElement('span');
    title.textContent = '読み込んだファイル一覧';
    result.appendChild(title);

    const list = document.createElement('ul');
    list.id = 'importedFileList';

    [
        {id: 'importedFileList-download-html',text: 'HTMLでダウンロード', clicked: io.github.shunshun94.trpg.logEditor.LogToTable.onDlHtml},
        {id: 'importedFileList-download-json', text: 'JSONでダウンロード', clicked: io.github.shunshun94.trpg.logEditor.LogToTable.onDlJson},
        {id: 'importedFileList-download-json-dice', text: 'ダイス結果のみJSONでダウンロード', clicked: io.github.shunshun94.trpg.logEditor.LogToTable.onDlJsonDice}
    ].forEach((d)=>{
        const button = document.createElement('button');
        button.setAttribute('style', 'display:none;');
        button.className = 'ltt-download';
        button.id = d.id;
        button.textContent = d.text;
        button.addEventListener('click', d.clicked);
        result.appendChild(button);
        result.appendChild(document.createElement('br'));
    });

    if(io.github.shunshun94.trpg.logEditor.FileLoader) {
        io.github.shunshun94.trpg.logEditor.FileLoader.readFile = io.github.shunshun94.trpg.logEditor.LogToTable.onFileLoad;
    }

    return result;
};

io.github.shunshun94.trpg.logEditor.DOMS.BODY.on(io.github.shunshun94.trpg.logEditor.EVENTS.FILE_DROPED, (e, name)=>{
    const li = $(`<li></li>`);
    li.text(name);
    $('#importedFileList').append(li);
});

io.github.shunshun94.trpg.logEditor.LogToTable.onDlHtml = (e)=>{
    const html = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.jsonToHtml(io.github.shunshun94.trpg.logEditor.LogToTable.STOCKED_LIST);
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.download(html, `saved_${Number(new Date())}.html`, 'text/html;charset=utf-8;');
};

io.github.shunshun94.trpg.logEditor.LogToTable.onDlJson = (e)=>{
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.download(JSON.stringify(io.github.shunshun94.trpg.logEditor.LogToTable.STOCKED_LIST), `saved_${Number(new Date())}.json`, 'text/json;charset=utf-8;');
};

io.github.shunshun94.trpg.logEditor.LogToTable.onDlJsonDice = (e)=>{
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.download(JSON.stringify(io.github.shunshun94.trpg.logEditor.LogToTable.STOCKED_LIST.filter((d)=>{
        return d.dice;
    })), `saved_${Number(new Date())}.json`, 'text/json;charset=utf-8;');
};

io.github.shunshun94.trpg.logEditor.LogToTable.onFileLoad = (targetFile) => {
	io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.getConvertor(targetFile).then((convertor)=>{
		convertor.dropEventToJson(targetFile).then((parsedTarget)=>{
			io.github.shunshun94.trpg.logEditor.DOMS.BODY.trigger(
				io.github.shunshun94.trpg.logEditor.EVENTS.FILE_LOADED,
				parsedTarget
			);
		});
	});
};
