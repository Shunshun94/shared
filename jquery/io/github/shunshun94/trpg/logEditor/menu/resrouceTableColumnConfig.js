var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.menu = io.github.shunshun94.trpg.logEditor.menu || {};

io.github.shunshun94.trpg.logEditor.menu.ResrouceTableColumnConfig = io.github.shunshun94.trpg.logEditor.menu.ResrouceTableColumnConfig || {};

io.github.shunshun94.trpg.logEditor.menu.ResrouceTableColumnConfig.generateDom = (defaultColumns) => {
	return `<div
		class="${io.github.shunshun94.trpg.logEditor.CLASSES.TMP_WINDOW} ${io.github.shunshun94.trpg.logEditor.CLASSES.RESOURCE_TABLE_COLUMN_CONFIG_WINDOW}"
	>
	<input
        type="text"
        value="${defaultColumns.join(' ')}"
        id="${io.github.shunshun94.trpg.logEditor.CLASSES.RESOURCE_TABLE_COLUMN_CONFIG_WINDOW}-input"
        class="${io.github.shunshun94.trpg.logEditor.CLASSES.RESOURCE_TABLE_COLUMN_CONFIG_WINDOW}-input"
        />
	<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_EXEC}">決定</button>
	</div>`;
};