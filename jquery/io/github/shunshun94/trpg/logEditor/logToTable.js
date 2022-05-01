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

io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`<div style="position:absolute;top:0px;left:600px;padding:2em;">
<span>読み込んだファイル一覧</span>
<ul id="importedFileList"></ul>
<button style="display:none;" class="ltt-download" id="importedFileList-download-html">HTMLでダウンロード</button><br/>
<button style="display:none;" class="ltt-download" id="importedFileList-download-json">JSONでダウンロード</button><br/>
<button style="display:none;" class="ltt-download" id="importedFileList-download-json-dice">ダイス結果のみJSONでダウンロード</button>
</div>`);
io.github.shunshun94.trpg.logEditor.DOMS.BODY.on(io.github.shunshun94.trpg.logEditor.EVENTS.FILE_DROPED, (e, name)=>{
    const li = $(`<li></li>`);
    li.text(name);
    $('#importedFileList').append(li);
});

$('#importedFileList-download-html').click((e)=>{
    const html = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.jsonToHtml(io.github.shunshun94.trpg.logEditor.LogToTable.STOCKED_LIST);
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.download(html, `saved_${Number(new Date())}.html`, 'text/html;charset=utf-8;');
});

$('#importedFileList-download-json').click((e)=>{
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.download(JSON.stringify(io.github.shunshun94.trpg.logEditor.LogToTable.STOCKED_LIST), `saved_${Number(new Date())}.json`, 'text/json;charset=utf-8;');
});

$('#importedFileList-download-json-dice').click((e)=>{
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.download(JSON.stringify(io.github.shunshun94.trpg.logEditor.LogToTable.STOCKED_LIST.filter((d)=>{
        return d.dice;
    })), `saved_${Number(new Date())}.json`, 'text/json;charset=utf-8;');
});

io.github.shunshun94.trpg.logEditor.FileLoader.readFile = (targetFile) => {
	io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.getConvertor(targetFile).then((convertor)=>{
		convertor.dropEventToJson(targetFile).then((parsedTarget)=>{
			io.github.shunshun94.trpg.logEditor.DOMS.BODY.trigger(
				io.github.shunshun94.trpg.logEditor.EVENTS.FILE_LOADED,
				parsedTarget
			);
		});
	});
};
