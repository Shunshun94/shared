var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};

io.github.shunshun94.trpg.logEditor.DOMS.BODY.on('drop', (e) => {
	io.github.shunshun94.trpg.logEditor.DOMS.BODY.css('background-color', 'white');
	io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor.dropEventToJson(e).then((parsedTarget)=>{
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.trigger(
			io.github.shunshun94.trpg.logEditor.EVENTS.FILE_LOADED,
			{doms: parsedTarget}
		);
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.off('drop');
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.off('dragleave');
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.off('dragover');
	});
	e.preventDefault();
});
io.github.shunshun94.trpg.logEditor.DOMS.BODY.on('dragleave', (e) => {
	io.github.shunshun94.trpg.logEditor.DOMS.BODY.css('background-color', 'white');
});
io.github.shunshun94.trpg.logEditor.DOMS.BODY.on('dragover', (e) => {
	io.github.shunshun94.trpg.logEditor.DOMS.BODY.css('background-color', 'lightyellow');
	e.preventDefault();
});
io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`<div style="padding:2em;position:absolute;top:0px;left:0px;right:0px;bottom:0px;">ログの HTML を Drag/Drop してください</div>`);

io.github.shunshun94.trpg.logEditor.FileLoader = io.github.shunshun94.trpg.logEditor.FileLoader || {};

io.github.shunshun94.trpg.logEditor.FileLoader.openBackScreen = () => {
	io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`<div class="${io.github.shunshun94.trpg.logEditor.CLASSES.BACKSCREEN}"></div>`);
};

io.github.shunshun94.trpg.logEditor.FileLoader.openFilterWindow = (doms) => {
	const window = `<div class="${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}">
	<p>ログを構成する要素が${doms.length}個あり、処理が遅くなる可能性があります。<br/>一部分だけ取り出してそこだけ編集し、あとで結合することをお勧めします。</p>
	<p>どの一部分だけ切り出しますか？
	<input
		class="${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-input-start"
		type="number" min="1" max="${doms.length - 1}" value="1" />つ目～
	<input
		class="${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-input-end"
		type="number" min="${doms.length - 1}" max="${doms.length}" value="${doms.length}" /></p>
	<div class="${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-contents ${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-contents-head"></div>
	<div class="${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-contents ${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-contents-tail"></div>
	<hr/>
	<button>決定</button>
	</div>`;
	io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(window);
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

io.github.shunshun94.trpg.logEditor.FileLoader.filtLongFile = (doms) => {
	return new Promise((resolve, reject)=>{
		if(doms.length > 500) {
			io.github.shunshun94.trpg.logEditor.FileLoader.openBackScreen();
			io.github.shunshun94.trpg.logEditor.FileLoader.openFilterWindow(doms);
			$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER} > button`).click((e)=>{
				io.github.shunshun94.trpg.logEditor.FileLoader.resetFiltEvents();
				resolve(doms.slice(
						io.github.shunshun94.trpg.logEditor.FileLoader.getHeadNumber(),
						io.github.shunshun94.trpg.logEditor.FileLoader.getTailNumber()));
				$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}`).remove();
				$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.BACKSCREEN}`).remove();
			});
			$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-input-start`).change((e)=>{
				const val = Number($(e.target).val());
				$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-contents-head`).empty();
				for(let i = ( (val - 2) > 0) ? (val - 2) : 1 ; i <= (((val + 2) <= doms.length) ? (val + 2) : (doms.length)) ; i++ ) {
					const count = $(`<h2 ${(i === val) ? 'style="font-weight: bold;"' : ''}>${i}番目の発言</h2>`)
					const body = $(`<pre ${(i === val) ? 'style="font-weight: bold;"' : ''}></pre>`);
					body.text(`タグ: ${doms[i - 1].tag}\n\n${doms[i - 1].name ? ('発言者：' + doms[i - 1].name + '\n') : ''}内容：\n${doms[i - 1].content}`);
					$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-contents-head`).append(count);
					$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-contents-head`).append(body);
				}
			});
			$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-input-end`).change((e)=>{
				const val = Number($(e.target).val());
				$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-contents-tail`).empty();
				for(let i = ( (val - 2) > 0) ? (val - 2) : 1 ; i <= (((val + 2) <= doms.length) ? (val + 2) : (doms.length)) ; i++ ) {
					const count = $(`<h2 ${(i === val) ? 'style="font-weight: bold;"' : ''}>${i}番目の発言</h2>`)
					const body = $(`<pre ${(i === val) ? 'style="font-weight: bold;"' : ''}></pre>`);
					body.text(`タグ: ${doms[i - 1].tag}\n\n${doms[i - 1].name ? ('発言者：' + doms[i - 1].name + '\n') : ''}内容：\n${doms[i - 1].content}`);
					$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-contents-tail`).append(count);
					$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-contents-tail`).append(body);
				}
				
			});
			$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-input-start`).change();
			$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER}-input-end`).change();
		} else {
			resolve(doms);
		}
	});
;
};

