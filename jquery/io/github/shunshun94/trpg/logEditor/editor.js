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
		this.bindEvents();
	}

	setRndId(post) {
		const targetDom = post.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-id`);
		let randomString = '';
		const baseString ='abcdefghijklmnopqrstuvwxyz';
		for(let i = 0; i < 32; i++) {
			randomString += baseString.charAt( Math.floor( Math.random() * baseString.length));
		}
		targetDom.val(randomString);
	}

	duplicate(post) {
		post.after(post.clone());
	}

	merge(post) {
		const prevDom = post.prev();
		if(prevDom.length) {
			const newContent = `
				${prevDom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.CONTENT}`).html()}<br/><br/>
				${post.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.CONTENT}`).html()}
			`.trim();
			prevDom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.CONTENT}`).html(newContent);
			post.remove();
		}
	}

	toggleSub(post) {
		const targetDom = post.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-class`);
		if(targetDom.val().includes('tab1')) {
			targetDom.val(targetDom.val().replace('tab1', '').trim());
		} else {
			targetDom.val(`${targetDom.val()} tab1`.trim());
		}
	}

	openNameConfigScreen() {
		const names = Array.from(new Set($.makeArray($(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).map((i,v)=>{return $(v).text()}))));
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(io.github.shunshun94.trpg.logEditor.menu.NameConfig.generateDom(names));
	}

	applyNameConfig() {
		const configResult = io.github.shunshun94.trpg.logEditor.menu.NameConfig.getInputInfo();
		for(const name in configResult) {
			const target = configResult[name];
			if(target.style || target.class || target.name) {
				target.list = io.github.shunshun94.trpg.logEditor.getPostsByName(name);
			}
			if(target.style) {
				target.list.find(`.io-github-shunshun94-trpg-logEditor-Post-params-param-input-style`).val(target.style);
			}
			if(target.class) {
				target.list.find(`.io-github-shunshun94-trpg-logEditor-Post-params-param-input-class`).each((i,v)=>{
					const currentValue = $(v).val();
					if(currentValue.includes('tab1')) {
						$(v).val(`${target.class} tab1`);
					} else {
						$(v).val(target.class);
					} 
				});
			}
		}
		for(const name in configResult) {
			const target = configResult[name];
			if(target.name) {
				target.list.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).text(target.name);
			}
		}
	}

	openBackScreen() {
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`<div class="${io.github.shunshun94.trpg.logEditor.CLASSES.BACKSCREEN}"></div>`);
	}
	
	closeTmpWindow() {
		$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.BACKSCREEN}`).remove();
		$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.TMP_WINDOW}`).remove();
	}

	bindEvents() {
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.click((e)=>{
			const clicked = $(e.target);
			const isButton = e.target.localName === 'button';
			const targetPost = clicked.parents(`.${io.github.shunshun94.trpg.logEditor.CLASSES.POST}`);
			if(isButton && targetPost.length) {
				if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.DUPLICATE) ) {
					this.duplicate(targetPost);
				}
				if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.MERGE) ) {
					this.merge(targetPost);
				}
				if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.DELETE) ) {
					targetPost.remove();
				}
				if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.RANDOM_ID) ) {
					this.setRndId(targetPost);
				}
				if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.TOGGLE_SUB) ) {
					this.toggleSub(targetPost);
				}
				return;
			}
			const targetBlock = clicked.parents(`.editBlock`);
			if(isButton && targetBlock.length) {
				io.github.shunshun94.trpg.logEditor.export.exec(targetBlock.find('.logList'));
				return;
			}
			if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU) ) {
				this.openBackScreen();
				this.openNameConfigScreen();
				return;
			}
			if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_EXEC) ) {
				this.applyNameConfig();
				this.closeTmpWindow(clicked);
				return;
			}
			if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.BACKSCREEN) ) {
				this.closeTmpWindow(clicked);
				return;
			}
		});
	}

	activateSort() {
		const opts = {
				group: 'shared',
				handle: `.${io.github.shunshun94.trpg.logEditor.CLASSES.HANDLE}`,
				multiDrag: true,
				selectedClass: io.github.shunshun94.trpg.logEditor.CLASSES.SELECTED,
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
			<div class="editBlock" id="mainEditor">
				<h2>出力</h2><button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE}">保存する</button>
				<div class="logList"></div>
			</div>
		`);
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`
			<div id="tmpEditor">
				<div class="editBlock" id="tmpEditorA">
					<h2>一時置き場A</h2><button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE}">保存する</button>
					<div class="logList"></div>
				</div>
				<div class="editBlock" id="tmpEditorB">
					<h2>一次置き場B</h2><button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE}">保存する</button>
					<div class="logList"></div>
				</div>
			</div>
		`);
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`
			<div id="menu">
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU}">名前に関して設定</button>
			</div>
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