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
		this.tabList = data.tabList || [];
		this.originalFileName = data.fileTitle;
		this.initPosts(htmls);
		this.activateSort();
		io.github.shunshun94.trpg.logEditor.export.htmlExporter.setLastHash(
			io.github.shunshun94.trpg.logEditor.export.htmlExporter.calcCurrentHash(
					$('#mainEditor .logList'),
					this.head,
					this.omit,
					io.github.shunshun94.trpg.logEditor.DOMS.BODY.attr('class')
				));
		this.bindEvents();
	}

	additionalLoad(data) {
		const htmls = this.domsToPost(data.doms);
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(io.github.shunshun94.trpg.logEditor.menu.AppendMenu.generateDom());
		io.github.shunshun94.trpg.logEditor.menu.AppendMenu.selectHowHandleLogs().then(
			(action)=>{
				if(action === 'head') {
					this.getMainDom().prepend(htmls.join(''));
				}
				if(action === 'tail') {
					this.getMainDom().append(htmls.join(''));
				}
				if(action === 'tmpA') {
					$(this.getTmpDoms()[1]).append(htmls.join(''));
				}
				if(action === 'tmpB') {
					$(this.getTmpDoms()[0]).append(htmls.join(''));
				}
				io.github.shunshun94.trpg.logEditor.menu.AppendMenu.close();
			}, (cancel)=>{
				io.github.shunshun94.trpg.logEditor.menu.AppendMenu.close();
			}
		);
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

	appendParentheses(post) {
		const contentDom = post.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.CONTENT}`);
		contentDom.html('「' + contentDom.html() + '」');
	}

	beHostPlayer(post) {
		this.changePostName(post, false, io.github.shunshun94.trpg.logEditor.WORDS.HOSTPLAYER);
	}

	changePostName(post, isReverse = false, opt_newName = false) {
		const nameList = isReverse ? this.getNameList().sort().reverse() : this.getNameList().sort();
		const nameMap  = this.getNameStyleList();
		const currentName = post.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).text();
		const currentNameIndex = nameList.indexOf(currentName);
		const newName = opt_newName || nameList[currentNameIndex + 1] || nameList[0];
		post.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).text(newName);
		post.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-style`).val((nameMap[newName] || {}).style || '');
		const keptClasses = [];
		const keptClassesRegExpResult = post.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-class`).val().matchAll(/tab\d+/g);
		for(const match of keptClassesRegExpResult) {
			keptClasses.push(match[0])
		}
		post.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-class`).val((keptClasses.join(' ') + ' ' + ((nameMap[newName] || {}).class || '')).trim());
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
	}

	toggleSub(post) {
		const targetDom = post.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-class`);
		if(targetDom.val().includes('tab1')) {
			targetDom.val(targetDom.val().replace('tab1', '').trim());
		} else {
			targetDom.val(`tab1 ${targetDom.val()}`.trim());
		}
	}

	openSaveScreen(targetBlock = 'mainEditor') {
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(io.github.shunshun94.trpg.logEditor.menu.saveMenu.generateDom(targetBlock));
	}

	showAddElementMenu() {
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.generateDom(this.getNameList()));
	}

	insertUpdateBackGroundPicture() {
		const url   = $(`#${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bg-url`).val();
		const title = $(`#${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bg-title`).val();
		const post = {
			tag: 'p',
			name: 'YTCHAT_SYSTEM',
			content: `bg:${url}<br/>背景を変更<br/>${title}`,
			id: '',
			class: 'background-picture',
			style: ''
		};
		const dom = io.github.shunshun94.trpg.logEditor.jsonToEditorHtml(post);
		$(this.getTmpDoms()[0]).append(dom);
		io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.registerBg(title, url);
	}

	insertUpdateBackGroundMusic() {
		const url    = io.github.shunshun94.trpg.logEditor.export.ytchatExporter.getShoterYouTubeUrl(
		               $(`#${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgm-url`).val());
		const title  = $(`#${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgm-title`).val();
		const volume = $(`#${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgm-volume`).val();
		const post = {
			tag: 'p',
			name: 'YTCHAT_SYSTEM',
			content: `bgm:${volume}:${url}<br/>音楽を変更<br/>${title}`,
			id: '',
			class: 'background-music',
			style: ''
		};
		const dom = io.github.shunshun94.trpg.logEditor.jsonToEditorHtml(post);
		$(this.getTmpDoms()[0]).append(dom);
		io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.registerBgm(title, url);
	}

	insertNewElement() {
		const post = io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.getPostObject();
		const dom = io.github.shunshun94.trpg.logEditor.jsonToEditorHtml(post);
		$(this.getTmpDoms()[1]).append(dom);
	}

	triggerResourceModifyTables() {
		const modifyHistory = io.github.shunshun94.trpg.logEditor.resources.generateresourcesInfoTables(this.getMainDom());
		const columns = io.github.shunshun94.trpg.logEditor.resources.getColumnsFromResourceInfoTables(modifyHistory);

		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(io.github.shunshun94.trpg.logEditor.menu.ResrouceTableColumnConfig.generateDom(columns));
	}

	insertResourceModifyTables(columns) {
		const modifyHistory = io.github.shunshun94.trpg.logEditor.resources.generateresourcesInfoTables(this.getMainDom());
		const htmls = io.github.shunshun94.trpg.logEditor.resources.convertResourceHistoryToTableHtmls(modifyHistory, columns, true);
		htmls.forEach((post)=>{
			$(this.getTmpDoms()[0]).append(io.github.shunshun94.trpg.logEditor.jsonToEditorHtml(post.domSeed));
		});
	}

	getNameList() {
		return Array.from(new Set($.makeArray($(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).map((i,v)=>{return $(v).text()})))).filter((n)=>{return n;});
	}

	getNameStyleList() {
		const result = {};
		const names =   $.makeArray( $(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).map((i,v)=>{return $(v).text()}) );
		const styles =  $.makeArray( $(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-style`).map((i,v)=>{return $(v).val().trim().replaceAll('"', '')}) );
		const classes = $.makeArray( $(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-class`).map((i,v)=>{return $(v).val().replaceAll(/tab\d+/g, '').trim()}) );
		names.forEach((name, i)=>{
			if( name ) {
				if(                ! result[name] )        { result[name] = {}; }
				if( styles[i]  && (! result[name].style) ) { result[name].style = styles[i];  }
				if( classes[i] && (! result[name].class) ) { result[name].class = classes[i]; }
			}
		});
		return result;
	}

	openNameConfigScreen() {
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(io.github.shunshun94.trpg.logEditor.menu.NameConfig.generateDom(this.getNameStyleList(), io.github.shunshun94.trpg.logEditor.DOMS.BODY.attr('class')));
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
			target.list = io.github.shunshun94.trpg.logEditor.getPostsByName(name);
			target.list.find(`.io-github-shunshun94-trpg-logEditor-Post-params-param-input-style`).val(target.style || ' ');
			if(target.class) {
				target.list.find(`.io-github-shunshun94-trpg-logEditor-Post-params-param-input-class`).each((i,v)=>{
					const keptValues = $(v).val().split(' ').filter((c)=>{
						return this.tabList.includes(c) || /tab\d+/.exec(c);
					}).join(' ');
					$(v).val(`${keptValues} ${target.class}`.trim());
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
		const body = io.github.shunshun94.trpg.logEditor.export.htmlExporter.generateBody($('#mainEditor .logList'));
		$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}`).empty();
		$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}`).append(body);
		$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}`).append(`<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}-close">プレビューを閉じる</button>`);
		$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}`).append(`<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW}-update">プレビューを再読み込みする</button>`);
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
			const currentHash = io.github.shunshun94.trpg.logEditor.export.htmlExporter.calcCurrentHash(
				$('#mainEditor .logList'),
				self.head,
				self.omit,
				io.github.shunshun94.trpg.logEditor.DOMS.BODY.attr('class')
			);
			html = $('#mainEditor .logList').html();
			if( io.github.shunshun94.trpg.logEditor.export.htmlExporter.getLastHash() !== currentHash ) {
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
			if( e.keyCode === 77 && e.altKey ) {
				e.preventDefault();
				io.github.shunshun94.trpg.logEditor.menu.PopupMenu.toggle();
				return;
			}
			if( e.keyCode === 83 && e.ctrlKey ) {
				e.preventDefault();
				this.openBackScreen();
				this.openSaveScreen();
				return;
			}
		});

		io.github.shunshun94.trpg.logEditor.DOMS.BODY.on('input', (e)=>{
			const inputted = $(e.target);
			if(inputted.hasClass(`${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-url`)) {
				io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.insertByUrl(inputted);
			}
			if(inputted.hasClass(`${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-style`)) {
				io.github.shunshun94.trpg.logEditor.menu.NameConfig.onModifyStyle(inputted, io.github.shunshun94.trpg.logEditor.DOMS.BODY.attr('class'));
			}
			if(inputted.hasClass(`${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-color`)) {
				io.github.shunshun94.trpg.logEditor.menu.NameConfig.onModifyColor(inputted, io.github.shunshun94.trpg.logEditor.DOMS.BODY.attr('class'));
			}
		});

		io.github.shunshun94.trpg.logEditor.DOMS.BODY.click((e)=>{
			const clicked = $(e.target);
			const targetPost = clicked.parents(`.${io.github.shunshun94.trpg.logEditor.CLASSES.POST}`);
			if(targetPost.length) {
				io.github.shunshun94.trpg.logEditor.kickPostClickedEvents(this, clicked, targetPost);
			} else {
				io.github.shunshun94.trpg.logEditor.kickGeneralClicedEvents(this, clicked);
			}
		});

		io.github.shunshun94.trpg.logEditor.DOMS.BODY.contextmenu((e)=>{
			const clicked = $(e.target);
			const targetPost = clicked.parents(`.${io.github.shunshun94.trpg.logEditor.CLASSES.POST}`);
			if(targetPost.length) {
				const result = io.github.shunshun94.trpg.logEditor.kickPostRightClickedEvents(this, clicked, targetPost);
				if(result) {
					e.preventDefault();
				}
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
		return doms.map((d)=>{
			try {
				return io.github.shunshun94.trpg.logEditor.jsonToEditorHtml(d);
			}catch (e) {
				console.error(e, d);
				return false;
			}
		}).filter((d)=>{return d;});
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
			<div id="tmpEditor">
				<div class="editBlock" id="tmpEditorB">
					<h2>一次置き場B</h2><button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE}">保存する</button>
					<div class="logList"></div>
				</div>
				<div class="editBlock" id="tmpEditorA">
					<h2>一時置き場A</h2><button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE}">保存する</button>
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
			<div class="editBlock" id="mainEditor">
				<h2>出力</h2><button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE}">保存する(Ctrl+S)</button>
				<div class="logList"></div>
			</div>
		`);
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`
			<div id="menu">
				${io.github.shunshun94.trpg.logEditor.menu.PopupMenu.generateHtml()}
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAME_MEMBER_MENU}">同じ発言者の連続した発言にジャンプ</button>
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU}">要素を追加</button>
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.TRASHBOX_MENU}">ゴミ箱を開閉</button>
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.DARKMODE_MENU}">ナイトモード ON/OFF</button>
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.PREVIEW_MENU}">プレビュー</button>
			</div>
		`);
		io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(`
			<footer>
				<p>本ツールはココフォリアやユドナリウム、FloconやLINEのテキストログを編集するツールですがそれらの開発チームとこのツールは無関係です</p>
				<p>作者連絡先: <a href="https://twitter.com/Shunshun94" target="_blank">@Shunshun94</a> /
				ソースコード: <a href="https://github.com/Shunshun94/shared/tree/master/jquery/io/github/shunshun94/trpg/logEditor" target="_blank">GitHub</a> /
				作者欲しい物リスト: <a href="https://amzn.asia/8mNqdKy" target="_blank">Amazon</a> /
				動作説明動画：<a href="https://youtu.be/_4rlcFfCui8" target="_blank">YouTube</a></p>
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