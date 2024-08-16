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
	FILE_DROPED: 'io-github-shunshun94-trpg-logEditor-file-droped',
	RESOURCE_TABLE_COLUMN_CONFIG_DECIDED: 'io-github-shunshun94-trpg-logEditor-resource-table-column-config-decided'
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
	POST_TAG_H3: 'io-github-shunshun94-trpg-logEditor-Post-params-param-button-postTagh3',
	POST_TAG_H3: 'io-github-shunshun94-trpg-logEditor-Post-params-param-button-postTagh4',
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
	RESOURCE_TABLE_COLUMN_CONFIG_WINDOW: 'io-github-shunshun94-trpg-logEditor-menu-ResrouceTableColumn',
	RESOURCE_TABLE_COLUMN_CONFIG_WINDOW_EXEC: 'io-github-shunshun94-trpg-logEditor-menu-ResrouceTableColumn-exec',
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
	INSERT_RESOURCE_MODIFICATION_LOGS: 'menu-insertResourceModificationLogs',
	ADD_FILE_MENU: 'menu',
	DARKMODE: 'darkmode',
	EXPERIMENTAL: 'experimental',
	BACKSCREEN: 'io-github-shunshun94-trpg-logEditor-backScreen',
	TMP_WINDOW: 'io-github-shunshun94-trpg-logEditor-tmpWindow',
	PREVIEW: 'io-github-shunshun94-trpg-logEditor-preview'
};
io.github.shunshun94.trpg.logEditor.CLASSES.RESOURCE_TABLE_COLUMN_CONFIG_WINDOW

io.github.shunshun94.trpg.logEditor.EXPERIMENTAL_FUNC_PASSWORD = 'c74ffc7879c92accd74d76359b085d3883a02b65de892203c2191090c1cd6407';
io.github.shunshun94.trpg.logEditor.WORDS = {
	HOSTPLAYER: localStorage.getItem('io.github.shunshun94.trpg.logEditor.HOSTPLAYER') || 'GM'
};
