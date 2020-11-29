var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.Editor = class {
	constructor(doms) {
		this.generateBaseEditor();
		this.doms = this.domsToPost(doms);
		this.initPosts();
		this.activateSort();
	}
	activateSort() {
		const opts = {
				group: 'shared',
				handle: `.${io.github.shunshun94.trpg.logEditor.CLASSES.HANDLE}`,
				animation: 150
		}
		$('.logList').sortable(opts);
	}
	initPosts() {
		this.getMainDom().append(this.doms.map((d)=>{return d.getEditorDom()}).join(''));
	}
	domsToPost(doms) {
		return doms.map((d)=>{return new io.github.shunshun94.trpg.logEditor.Post(d);});
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
	}
};