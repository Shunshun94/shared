var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};

io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`<div style="padding:2em;position:absolute;top:0px;left:0px;right:0px;bottom:0px;">
以下のいずれかを Drag/Drop するか、以下からアップロードしてください<br/>
<input type="file" name="io-github-shunshun94-trpg-logEditor-FileLoader-InputFile" id="io-github-shunshun94-trpg-logEditor-FileLoader-InputFile" >
<ul>
<li>ココフォリアのログの HTML</li>
<li>ユドナリウムの部屋の zip</li>
<li>Tecky の部屋のログの HTML</li>
<li>どどんとふむせるのログの HTML</li>
<li>Flocon のログ（シンプル）の HTML</li>
<li>LINE からダウンロードしたログのテキストファイル</li>
</ul>
${[io.github.shunshun94.trpg.logEditor.LogToTable, io.github.shunshun94.trpg.logEditor.Link].filter((d)=>{return d}).map((d)=>{return d.buildHtml().outerHTML}).join('')}
</div>`);

io.github.shunshun94.trpg.logEditor.FileLoader = io.github.shunshun94.trpg.logEditor.FileLoader || {};

io.github.shunshun94.trpg.logEditor.FileLoader.bindInitialEvents = (body, input) => {
	if(body) {
		body.on('drop', (e) => {
			body.removeClass('ondrop');
			const targetFile = e.originalEvent.dataTransfer.files[0];
			body.trigger(
				io.github.shunshun94.trpg.logEditor.EVENTS.FILE_DROPED,
				targetFile.name
			);
			io.github.shunshun94.trpg.logEditor.FileLoader.readFile(targetFile);
			e.preventDefault();
		});
		
		body.on('dragleave', (e) => {
			body.removeClass('ondrop');
		});
		body.on('dragover', (e) => {
			body.addClass('ondrop');
			e.preventDefault();
		});
	}

	if(input) {
		input.on('change', (e)=>{
			body.css('background-color', '');
			io.github.shunshun94.trpg.logEditor.FileLoader.onChangeInputFile(e);
		});
	}
};

io.github.shunshun94.trpg.logEditor.FileLoader.onChangeInputFile = (e) => {
	const targetFile = e.target.files[0];
	io.github.shunshun94.trpg.logEditor.FileLoader.readFile(targetFile);
	e.preventDefault();
};

io.github.shunshun94.trpg.logEditor.FileLoader.kickOneTimeSave = () => {
	const upload = document.createElement("input");
	document.body.appendChild(upload);
	upload.id = 'io-github-shunshun94-trpg-logEditor-FileLoader-InputFile-tmp';
	$('#io-github-shunshun94-trpg-logEditor-FileLoader-InputFile-tmp').on('change', (e)=>{
		io.github.shunshun94.trpg.logEditor.FileLoader.onChangeInputFile(e);
	});
	upload.type = 'file';
	upload.click();
	upload.remove();
};

io.github.shunshun94.trpg.logEditor.FileLoader.readFile = (targetFile) => {
	io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.getConvertor(targetFile).then((convertor)=>{
		convertor.dropEventToJson(targetFile).then((parsedTarget)=>{
			io.github.shunshun94.trpg.logEditor.DOMS.BODY.off('drop');
			io.github.shunshun94.trpg.logEditor.DOMS.BODY.off('dragleave');
			io.github.shunshun94.trpg.logEditor.DOMS.BODY.off('dragover');
			io.github.shunshun94.trpg.logEditor.DOMS.BODY.trigger(
				io.github.shunshun94.trpg.logEditor.EVENTS.FILE_LOADED,
				parsedTarget
			);
		});
	});
};

io.github.shunshun94.trpg.logEditor.FileLoader.openBackScreen = () => {
	io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`<div class="${io.github.shunshun94.trpg.logEditor.CLASSES.BACKSCREEN}"></div>`);
};

io.github.shunshun94.trpg.logEditor.FileLoader.closeBackScreen = () => {
	$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.BACKSCREEN}`).remove();
};

io.github.shunshun94.trpg.logEditor.FileLoader.resetFiltEvents = ()=>{
	$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER} > button`).off('click');
};

io.github.shunshun94.trpg.logEditor.FileLoader.getHeadNumber = () => {
	return Number($(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-input-start`).val()) - 1;
};

io.github.shunshun94.trpg.logEditor.FileLoader.getTailNumber = () => {
	return Number($(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-input-end`).val());
};

io.github.shunshun94.trpg.logEditor.FileLoader.bindInitialEvents(
	io.github.shunshun94.trpg.logEditor.DOMS.BODY,
	$('#io-github-shunshun94-trpg-logEditor-FileLoader-InputFile')
);
