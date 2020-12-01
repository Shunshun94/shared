var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.Editor = class {
	constructor(doms) {
		this.generateBaseEditor();
		const htmls = this.domsToPost(doms);
		this.initPosts(htmls);
		this.activateSort();
	}
	activateSort() {
		const opts = {
				group: 'shared',
				handle: `.${io.github.shunshun94.trpg.logEditor.CLASSES.HANDLE}`
		}
		$('.logList').sortable(opts);
	}
	initPosts(doms) {
		this.getMainDom().append(doms.join(''));
	}
	domsToPost(doms) {
		return doms.map(io.github.shunshun94.trpg.logEditor.jsonToEditorHtml);
	}
	getMainDom() {
		return $('#mainEditor > .logList');
	}
	getTmpDoms() {
		return $('#tmpEditor > div > .logList');
	}
	generateBaseEditor() {
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.empty();
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`
			<div id="mainEditor">
				<h2>出力</h2>
				<div class="logList"></div>
			</div>
		`);
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`
			<div id="tmpEditor">
				<div id="tmpEditorA">
					<h2>一時置き場A</h2>
					<div class="logList"></div>
				</div>
				<div id="tmpEditorB">
					<h2>一次置き場B</h2>
					<div class="logList"></div>
				</div>
			</div>
		`);
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`
			<div id="menu"></div>
		`);
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`
			<footer></footer>
		`);
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`
			<datalist id="io-github-shunshun94-trpg-logEditor-candidates-tags">
				${io.github.shunshun94.trpg.logEditor.Editor.CONSTS.TAGS.map((t)=>{
					return `<option value="${t}"></option>`
				}).join('')}
			</datalist>
			<datalist id="io-github-shunshun94-trpg-logEditor-candidates-classes">
				${io.github.shunshun94.trpg.logEditor.Editor.CONSTS.CLASSES.map((t)=>{
					return `<option value="${t}"></option>`
				}).join('')}
			</datalist>
		`);
	}
};
io.github.shunshun94.trpg.logEditor.Editor.CONSTS = {
	TAGS: ['p', 'h3', 'h2', 'h4', 'hr', 'h1'],
	CLASSES: ['tab1', 'tab0']
};