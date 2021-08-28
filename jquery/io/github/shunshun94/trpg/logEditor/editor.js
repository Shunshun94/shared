var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.Editor = class {
	constructor(data) {
		this.generateBaseEditor();
		const htmls = this.domsToPost(data.doms);
		this.head = data.head;
		this.omit = data.omitted;
		this.initPosts(htmls);
		this.activateSort();
		io.github.shunshun94.trpg.logEditor.export.setLastHash(
				io.github.shunshun94.trpg.logEditor.export.calcCurrentHash(
					$('#mainEditor .logList'),
					this.head,
					this.omit,
					io.github.shunshun94.trpg.logEditor.DOMS.BODY.attr('class')
				));
		this.bindEvents();
	}

	getRndId() {
		let randomString = '';
		const baseString ='abcdefghijklmnopqrstuvwxyz';
		for(let i = 0; i < 32; i++) {
			randomString += baseString.charAt( Math.floor( Math.random() * baseString.length));
		}
		return randomString;
	}

	setRndId(post) {
		const targetDom = post.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-id`);
		targetDom.val(this.getRndId());
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

	copyToTrash(posts) {
		const trashBox = $('#trashbox .logList');
		posts.reverse().forEach((post)=>{
			trashBox.prepend(post.clone(true));
		});
		console.log(posts, trashBox);
	}

	toggleSub(post) {
		const targetDom = post.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-class`);
		if(targetDom.val().includes('tab1')) {
			targetDom.val(targetDom.val().replace('tab1', '').trim());
		} else {
			targetDom.val(`tab1 ${targetDom.val()}`.trim());
		}
	}

	openNameConfigScreen() {
		const names = Array.from(new Set($.makeArray($(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).map((i,v)=>{return $(v).text()})))).filter((n)=>{return n;});
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(io.github.shunshun94.trpg.logEditor.menu.NameConfig.generateDom(names));
	}

	insertClassToNameConfig(tr) {
		const name = tr.find('th').text();
		const className = io.github.shunshun94.trpg.logEditor.menu.NameConfig.generateClass(name);
		tr.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-class`).val(className);
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
					const isIncludeTabX = /tab\d+/.exec(currentValue)
					if (isIncludeTabX) {
						$(v).val(`${isIncludeTabX[0]} ${target.class}`);
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

	styleReset() {
		if(window.confirm('全投稿の style を削除します。よろしいですか？')) {
			$(`.io-github-shunshun94-trpg-logEditor-Post-params-param-input-style`).val('');
		}
	}

	insertIdToHs() {
		$('#mainEditor .logList').children().each((i, post)=>{
			const postDom = $(post);
			const tagName = (postDom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-tag`).val() || '').trim();
			if(/^h\d$/.test(tagName)) {
				this.setRndId(postDom);
			}
		});
	}

	convertSystemToPost() {
		const targetList = io.github.shunshun94.trpg.logEditor.getPostsByName('system');
		targetList.each((i, v)=>{
			const target = $(v);
			const contentDom = target.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.CONTENT}`);
			const nameDom = target.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`);
			const nameExecResult = /\[\s+(.+)\s+\]\s*/.exec(contentDom.text());
			if(nameExecResult) {
				const name = nameExecResult[1];
				const newContent = contentDom.text().replace(nameExecResult[0], '');
				contentDom.html(newContent);
				nameDom.html(name); 
			} else {
				console.error(i, 'failed to get execResult', contentDom.text());
			}
		});
	}

	searchSameMemberDoublePost() {
		const doms = Array.from(this.getMainDom().children());
		let cursor = this.getRndId();
		for(const rawDom of doms) {
			const dom = $(rawDom);
			const tag = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-tag`).val().trim();
			if(tag === 'p') {
				const clazz = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-class`).val().trim();
				const name = dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).html().trim();
				const target = `${name}-${clazz}`;
				if(cursor === target) {
					dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.MERGE}`)[0].focus();
					return;
				} else {
					cursor = target;
				}
			} else {
				cursor = this.getRndId();
			}

		}
		alert('見つかりませんでした');
	}

	showPreview() {
		const body = io.github.shunshun94.trpg.logEditor.export.generateBody($('#mainEditor .logList'));
		$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}`).empty();
		$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}`).append(body);
		$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}`).append(`<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}-close">プレビューを閉じる</button>`);
		$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}`).show();
	}
	closePreview() {
		$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}`).empty();
		$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}`).hide();
	}

	openBackScreen() {
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`<div class="${io.github.shunshun94.trpg.logEditor.CLASSES.BACKSCREEN}"></div>`);
	}
	
	closeTmpWindow() {
		$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.BACKSCREEN}`).remove();
		$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.TMP_WINDOW}`).remove();
	}

	bindEvents() {
		const self = this;
		window.onbeforeunload = (e)=>{
			const currentHash = io.github.shunshun94.trpg.logEditor.export.calcCurrentHash(
				$('#mainEditor .logList'),
				self.head,
				self.omit,
				io.github.shunshun94.trpg.logEditor.DOMS.BODY.attr('class')
			);
			html = $('#mainEditor .logList').html();
			if( io.github.shunshun94.trpg.logEditor.export.getLastHash() !== currentHash ) {
				return true;
			}
		};

		io.github.shunshun94.trpg.logEditor.DOMS.BODY.keypress((e)=>{
			const typed = $(e.target);
			if( typed.hasClass( io.github.shunshun94.trpg.logEditor.CLASSES.NAME ) && (e.which === 13) ) {
				e.preventDefault();
			}
		});

		io.github.shunshun94.trpg.logEditor.DOMS.BODY.keydown((e)=>{
			if( e.keyCode === 83 && e.ctrlKey ) {
				e.preventDefault();
				io.github.shunshun94.trpg.logEditor.export.exec(
					this.getMainDom(),
					this.head,
					this.omit,
					io.github.shunshun94.trpg.logEditor.DOMS.BODY.attr('class'));
				return;
			}
		});

		io.github.shunshun94.trpg.logEditor.DOMS.BODY.click((e)=>{
			const clicked = $(e.target);
			const isButton = e.target.localName === 'button';
			const targetPost = clicked.parents(`.${io.github.shunshun94.trpg.logEditor.CLASSES.POST}`);
			if(isButton && targetPost.length) {
				if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.DUPLICATE) ) {
					this.duplicate(targetPost);
				}
				if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.MERGE) ) {
					this.copyToTrash([targetPost, targetPost.prev()]);
					this.merge(targetPost);
				}
				if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.DELETE) ) {
					this.copyToTrash([targetPost]);
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
				io.github.shunshun94.trpg.logEditor.export.exec(
						targetBlock.find('.logList'),
						this.head,
						this.omit,
						io.github.shunshun94.trpg.logEditor.DOMS.BODY.attr('class'));
				return;
			}
			if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU) ) {
				this.openBackScreen();
				this.openNameConfigScreen();
				return;
			}
			if( clicked.hasClass(`${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-classInsert`) ) {
				const tr = clicked.parents(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-tr`);
				this.insertClassToNameConfig(tr);
			}
			if( clicked.hasClass(`${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}-close`) ) {
				this.closePreview();
				return;
			}
			if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_EXEC) ) {
				this.applyNameConfig();
				this.closeTmpWindow(clicked);
				return;
			}
			if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.STYLE_RESET_MENU) ) {
				this.styleReset();
				return;
			}
			if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.ID_INSERTION_MENU) ) {
				this.insertIdToHs();
				return;
			}
			if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.DARKMODE_MENU) ) {
				io.github.shunshun94.trpg.logEditor.DOMS.BODY.toggleClass(io.github.shunshun94.trpg.logEditor.CLASSES.DARKMODE);
			}
			if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.SYSTEM_TO_POST_MENU) ) {
				this.convertSystemToPost();
				return;
			}
			if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.SAME_MEMBER_MENU) ) {
				this.searchSameMemberDoublePost();
				return;
			}
			if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW_MENU) ) {
				this.showPreview();
				return;
			}
			if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.TRASHBOX_MENU)) {
				$('#trashbox').toggle(400);
				$('#tmpEditorB').toggle(400);
				return;
			}
			if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.BACKSCREEN) ) {
				this.closeTmpWindow(clicked);
				return;
			}
			if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.TRASHBOX_CLOSE)) {
				$('#trashbox').hide(400);
				$('#tmpEditorB').show(400);
				return;
			}
			if( clicked.hasClass(io.github.shunshun94.trpg.logEditor.CLASSES.DELETE_ALL) ) {
				$('#trashbox .logList .io-github-shunshun94-trpg-logEditor-Post').remove();
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
				<h2>出力</h2><button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE}">保存する(Ctrl+S)</button>
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
				<div class="trashBlock" id="trashbox">
					<h2>ゴミ箱</h2>
					<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.TRASHBOX_CLOSE}">閉じる</button>
					<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.DELETE_ALL}">空にする</button>
					<div class="logList"></div>
				</div>
			</div>
		`);
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`
			<div id="menu">
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU}">名前に関して設定</button>
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.STYLE_RESET_MENU}">style を全削除</button>
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.ID_INSERTION_MENU}">全ての見出しにランダムな ID を挿入</button>
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SYSTEM_TO_POST_MENU}">System の発言を個人の発言に変換</button>
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAME_MEMBER_MENU}">同じ発言者の連続した発言にジャンプ</button>
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.TRASHBOX_MENU}">ゴミ箱を開閉</button>
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.DARKMODE_MENU}">ナイトモード ON/OFF</button>
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW_MENU}">プレビュー</button>
			</div>
		`);
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`
			<footer>
				<p>本ツールは Ccfolia や Udonariumのテキストログを編集するツールですがそれらの開発チームとこのツールは無関係です</p>
				<p>作者連絡先: <a href="https://twitter.com/Shunshun94" target="_blank">@Shunshun94</a> /
				ソースコード: <a href="https://github.com/Shunshun94/shared/tree/master/jquery/io/github/shunshun94/trpg/logEditor" target="_blank">GitHub</a> /
				作者欲しい物リスト: <a href="amzn.asia/8mNqdKy" target="_blank">Amazon</a></p>
			</footer>
		`);
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`
			<datalist id="${io.github.shunshun94.trpg.logEditor.CLASSES.CAND_TAGS}">
				${io.github.shunshun94.trpg.logEditor.Editor.CONSTS.TAGS.map((t)=>{
					return `<option value="${t}"></option>`
				}).join('')}
			</datalist>
			<datalist id="${io.github.shunshun94.trpg.logEditor.CLASSES.RANDOM_ID}">
				${io.github.shunshun94.trpg.logEditor.Editor.CONSTS.CLASSES.map((t)=>{
					return `<option value="${t}"></option>`
				}).join('')}
			</datalist>
		`);
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`
			<div class="${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}"></div>
		`);
	}
};
io.github.shunshun94.trpg.logEditor.Editor.CONSTS = {
	TAGS: ['p', 'h3', 'h2', 'h4', 'hr', 'h1'],
	CLASSES: ['tab1', 'tab0']
};