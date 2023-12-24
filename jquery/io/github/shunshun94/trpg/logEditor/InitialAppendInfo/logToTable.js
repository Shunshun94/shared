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
    io.github.shunshun94.trpg.logEditor.FileLoader.bindInitialEvents(io.github.shunshun94.trpg.logEditor.DOMS.BODY);
});

io.github.shunshun94.trpg.logEditor.LogToTable.buildHtml = () => {
    const result = document.createElement('div');
    result.setAttribute('style', 'position:absolute;top:0px;left:600px;padding:2em;');

    const title = document.createElement('span');
    title.textContent = '読み込んだファイル一覧';
    result.appendChild(title);

    const list = document.createElement('ul');
    list.id = 'importedFileList';
    result.append(list);

    io.github.shunshun94.trpg.logEditor.LogToTable.BUTTON_LIST.forEach((d)=>{
        if(d.when && (! location.search.includes( d.when ))) {
            return;
        }
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
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.download(html, `log-as-table`, 'text/html;charset=utf-8;');
};

io.github.shunshun94.trpg.logEditor.LogToTable.onDlJson = (e)=>{
    io.github.shunshun94.trpg.logEditor.export.OperationJsonExporter.download(JSON.stringify(io.github.shunshun94.trpg.logEditor.LogToTable.STOCKED_LIST), `log-as-json`, 'text/json;charset=utf-8;');
};

io.github.shunshun94.trpg.logEditor.LogToTable.onDlJsonDice = (e)=>{
    io.github.shunshun94.trpg.logEditor.export.OperationJsonExporter.download(JSON.stringify(io.github.shunshun94.trpg.logEditor.LogToTable.STOCKED_LIST.filter((d)=>{
        return d.dice;
    })), `dice-log-as-json`, 'text/json;charset=utf-8;');
};

io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportElement = (value, tag = 'td') => {
    const element = document.createElement(tag);
    element.textContent = value;
    return element;
};

io.github.shunshun94.trpg.logEditor.LogToTable.calcSignificant = (num, significant=2) => {
    return Math.floor(num * Math.pow(10, significant)) / Math.pow(10, significant);
};

io.github.shunshun94.trpg.logEditor.LogToTable.getAverageFromArray = (array, significant=2) => {
    if(array.length) {
        const sum = array.reduce((a, b) => a + b);
        return io.github.shunshun94.trpg.logEditor.LogToTable.calcSignificant(sum / array.length, significant);
    } else {
        return 0;
    }
};

io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportHtml = (data) => {
    const table = document.createElement('table');
    table.border=1;
    const head = document.createElement('tr');
    head.appendChild(io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportElement('名前', 'th'));
    head.appendChild(io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportElement('振った回数', 'th'));
    head.appendChild(io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportElement('平均出目', 'th'));
    head.appendChild(io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportElement('[1,1]回数', 'th'));
    head.appendChild(io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportElement('[1,1]率', 'th'));
    head.appendChild(io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportElement('[6,6]回数', 'th'));
    head.appendChild(io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportElement('[6,6]率', 'th'));
    table.append(head);
    Object.keys(data).forEach((key)=>{
        const member = data[key];
        if(member.log.length) {
            const tr = document.createElement('tr');
            tr.appendChild(io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportElement(key, 'th'));
            tr.appendChild(io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportElement(`${member.log.length}回`));
            tr.appendChild(io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportElement(`${io.github.shunshun94.trpg.logEditor.LogToTable.getAverageFromArray(member.log)}`));
            tr.appendChild(io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportElement(`${member.fumble}回`));
            tr.appendChild(io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportElement(`${
                Math.floor(io.github.shunshun94.trpg.logEditor.LogToTable.calcSignificant(member.fumble / member.log.length, 4) * 10000) / 100
            }%`));
            tr.appendChild(io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportElement(`${member.critical}回`));
            tr.appendChild(io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportElement(`${
                Math.floor(io.github.shunshun94.trpg.logEditor.LogToTable.calcSignificant(member.critical / member.log.length, 4) * 10000) / 100
            }%`));
            table.append(tr);
        }
    });
    return table.outerHTML;
};

io.github.shunshun94.trpg.logEditor.LogToTable.onDlHtmlDiceReport = (e)=>{
    const data = {};
    io.github.shunshun94.trpg.logEditor.LogToTable.STOCKED_LIST.filter((d)=>{
        return d.dice;
    }).forEach((d)=>{
        if(! data[d.name]) { data[d.name] = { log:[], fumble:0, critical:0 }; }
        d.dice.dice.forEach((val)=>{
            const sum = val[0] + val[1];
            if(sum && val.length == 2) {
                data[d.name].log.push(sum);
                if( sum === 2  ) { data[d.name].fumble++; }
                if( sum === 12 ) { data[d.name].critical++; }
            }
        });
    });
    document.getElementById('toDownload').innerHTML = io.github.shunshun94.trpg.logEditor.LogToTable.generateDlHtmlDiceReportHtml(data);
    html2canvas(document.getElementById(`toDownload`)).then(canvas => {
        let downloadEle = document.createElement("a");
        downloadEle.href = canvas.toDataURL("image/png");
        downloadEle.download = `log-as-table.png`;
        downloadEle.click();
        document.getElementById('toDownload').innerHTML = '';
    });
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

io.github.shunshun94.trpg.logEditor.LogToTable.BUTTON_LIST = [
    {id: 'importedFileList-download-html', text: 'HTMLでダウンロード', clicked: io.github.shunshun94.trpg.logEditor.LogToTable.onDlHtml},
    {id: 'importedFileList-download-json', text: 'JSONでダウンロード', clicked: io.github.shunshun94.trpg.logEditor.LogToTable.onDlJson},
    {id: 'importedFileList-download-json-dice', text: 'ダイス結果のみJSONでダウンロード', clicked: io.github.shunshun94.trpg.logEditor.LogToTable.onDlJsonDice},
    {id: 'importedFileList-download-html-dice-report', text: 'ダイスの統計情報を画像でダウンロード', clicked: io.github.shunshun94.trpg.logEditor.LogToTable.onDlHtmlDiceReport, when: 'sw2'}
];
