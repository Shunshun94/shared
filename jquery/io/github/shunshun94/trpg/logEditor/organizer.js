var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.DOMS = {
	BODY: $('body')
};
io.github.shunshun94.trpg.logEditor.EVENTS = {
	FILE_LOADED: 'io-github-shunshun94-trpg-logEditor-file-loaded'
};
io.github.shunshun94.trpg.logEditor.CLASSES = {
	FILTER: 'io-github-shunshun94-trpg-logEditor-FileLoader-filter',
	POST: 'io-github-shunshun94-trpg-logEditor-Post',
	HANDLE: 'io-github-shunshun94-trpg-logEditor-Post-handle',
	DUPLICATE: 'io-github-shunshun94-trpg-logEditor-Post-duplicate',
	MERGE: 'io-github-shunshun94-trpg-logEditor-Post-merge',
	DELETE: 'io-github-shunshun94-trpg-logEditor-Post-delete',
	RANDOM_ID: 'io-github-shunshun94-trpg-logEditor-Post-params-param-button-random_id',
	TOGGLE_SUB: 'io-github-shunshun94-trpg-logEditor-Post-params-param-button-toggle_sub',
	CAND_TAGS: 'io-github-shunshun94-trpg-logEditor-candidates-tags',
	CAND_CLASSES: 'io-github-shunshun94-trpg-logEditor-candidates-classes',
	SELECTED: 'io-github-shunshun94-trpg-logEditor-Post-selected',
	INPUTS: 'io-github-shunshun94-trpg-logEditor-Post-params-param-input',
	CONTENT: 'io-github-shunshun94-trpg-logEditor-Post-content',
	NAME: 'io-github-shunshun94-trpg-logEditor-Post-name',
	SAVE: 'io-github-shunshun94-trpg-logEditor-save',
	DELETE_ALL: 'io-github-shunshun94-trpg-logEditor-deleteAll',
	TRASHBOX_CLOSE: 'io-github-shunshun94-trpg-logEditor-closeTrashBox',
	NAME_MENU: 'menu-nameMenu',
	NAME_MENU_WINDOW: 'io-github-shunshun94-trpg-logEditor-menu-NameConfig',
	NAME_MENU_EXEC: 'io-github-shunshun94-trpg-logEditor-menu-NameConfig-exec',
	STYLE_RESET_MENU: 'menu-styleReset',
	ID_INSERTION_MENU: 'menu-idInsertion',
	SAME_MEMBER_MENU: 'menu-sameMember',
	TRASHBOX_MENU: 'menu-trashbox',
	DARKMODE_MENU: 'menu-editorVisual',
	PREVIEW_MENU: 'menu-preview',
	SYSTEM_TO_POST_MENU: 'menu-systemToPost',
	DARKMODE: 'darkmode',
	BACKSCREEN: 'io-github-shunshun94-trpg-logEditor-backScreen',
	TMP_WINDOW: 'io-github-shunshun94-trpg-logEditor-tmpWindow',
	PREVIEW: 'io-github-shunshun94-trpg-logEditor-preview'
};

io.github.shunshun94.trpg.logEditor.DOMS.BODY.on(io.github.shunshun94.trpg.logEditor.EVENTS.FILE_LOADED, (e, domList)=>{
	console.log(domList);
	io.github.shunshun94.trpg.logEditor.FileLoader.filtLongFile(domList.doms).then((filteredList)=>{
		new io.github.shunshun94.trpg.logEditor.Editor({
			doms: filteredList,
			head: domList.head,
			omitted: domList.omitted
		});
	});
});
