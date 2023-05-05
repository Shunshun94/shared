var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.DOMS = {
	BODY: $('body')
};
io.github.shunshun94.trpg.logEditor.EVENTS = {
	FILE_LOADED: 'io-github-shunshun94-trpg-logEditor-file-loaded',
	FILE_DROPED: 'io-github-shunshun94-trpg-logEditor-file-droped'
};
io.github.shunshun94.trpg.logEditor.CLASSES = {
	FILTER: 'io-github-shunshun94-trpg-logEditor-FileLoader-filter',
	POST: 'io-github-shunshun94-trpg-logEditor-Post',
	HANDLE: 'io-github-shunshun94-trpg-logEditor-Post-handle',
	NAMECHANGE: 'io-github-shunshun94-trpg-logEditor-Post-namechange',
	NAMECYCLE: 'io-github-shunshun94-trpg-logEditor-Post-namecycle',
	PARENTHESES: 'io-github-shunshun94-trpg-logEditor-Post-parentheses',
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
	POPUP_MENU: 'io-github-shunshun94-trpg-logEditor-menu-PopupMenu',
	POPUP_MENU_TOGGLE: 'io-github-shunshun94-trpg-logEditor-menu-PopupMenuToggle',
	NAME_MENU_WINDOW: 'io-github-shunshun94-trpg-logEditor-menu-NameConfig',
	NAME_MENU_EXEC: 'io-github-shunshun94-trpg-logEditor-menu-NameConfig-exec',
	SAVE_MENU_WINDOW: 'io-github-shunshun94-trpg-logEditor-menu-SaveMenu',
	APPEND_MENU_WINDOW: 'io-github-shunshun94-trpg-logEditor-menu-AppendMenu',
	ADD_ELEMENT_MENU_WINDOW: 'io-github-shunshun94-trpg-logEditor-menu-AddElementMenu',
	STYLE_RESET_MENU: 'menu-styleReset',
	ID_INSERTION_MENU: 'menu-idInsertion',
	SAME_MEMBER_MENU: 'menu-sameMember',
	ADD_ELEMENT_MENU: 'menu-addElement',
	TRASHBOX_MENU: 'menu-trashbox',
	DARKMODE_MENU: 'menu-editorVisual',
	PREVIEW_MENU: 'menu-preview',
	TEKEY_STATUS_MODIFY_TO_CCFOLIA: 'menu-tekeyStatusModifyToCcfoliaStatusModify',
	SYSTEM_TO_POST_MENU: 'menu-systemToPost',
	ADD_FILE_MENU: 'menu',
	DARKMODE: 'darkmode',
	EXPERIMENTAL: 'experimental',
	BACKSCREEN: 'io-github-shunshun94-trpg-logEditor-backScreen',
	TMP_WINDOW: 'io-github-shunshun94-trpg-logEditor-tmpWindow',
	PREVIEW: 'io-github-shunshun94-trpg-logEditor-preview'
};

io.github.shunshun94.trpg.logEditor.EXPERIMENTAL_FUNC_PASSWORD = 'b7e85de2b6358fca404f6764a3cd1f7e58333aa4ac986e3d4354ac8e02b0d402';
io.github.shunshun94.trpg.logEditor.HOSTPLAYER = localStorage.getItem('io.github.shunshun94.trpg.logEditor.HOSTPLAYER') || 'GM';
