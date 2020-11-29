var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};

io.github.shunshun94.trpg.logEditor.fileReader = new FileReader();
io.github.shunshun94.trpg.logEditor.fileReader.onload = (e) => {
	const codes = new Uint8Array(io.github.shunshun94.trpg.logEditor.fileReader.result);
	const rawHtml = Encoding.convert(codes, {
		to: 'unicode',
		from: Encoding.detect(codes),
		type: 'string'
	});
	const unexportList = ['#text', 'META', 'TITLE', 'SCRIPT', 'LINK'];
	const parsedTarget = $.parseHTML(rawHtml).filter((v)=>{
		return ! unexportList.includes(v.nodeName);
	}).map((v)=>{return $(v)});
	io.github.shunshun94.trpg.logEditor.DOMS.BODY.trigger(
		io.github.shunshun94.trpg.logEditor.EVENTS.FILE_LOADED,
		{doms: parsedTarget}
	);
	io.github.shunshun94.trpg.logEditor.DOMS.BODY.off('drop');
	io.github.shunshun94.trpg.logEditor.DOMS.BODY.off('dragleave');
	io.github.shunshun94.trpg.logEditor.DOMS.BODY.off('dragover');
};




io.github.shunshun94.trpg.logEditor.DOMS.BODY.on('drop', function(e) {
	io.github.shunshun94.trpg.logEditor.DOMS.BODY.css('background-color', 'white');
	io.github.shunshun94.trpg.logEditor.fileReader.readAsArrayBuffer(e.originalEvent.dataTransfer.files[0]);
	e.preventDefault();
});
io.github.shunshun94.trpg.logEditor.DOMS.BODY.on('dragleave', function(e) {
	io.github.shunshun94.trpg.logEditor.DOMS.BODY.css('background-color', 'white');
});
io.github.shunshun94.trpg.logEditor.DOMS.BODY.on('dragover', function(e) {
	io.github.shunshun94.trpg.logEditor.DOMS.BODY.css('background-color', 'lightyellow');
	e.preventDefault();
});
io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`<div style="padding:2em;position:absolute;top:0px;left:0px;right:0px;bottom:0px;">ログの HTML を Drag/Drop してください</div>`);