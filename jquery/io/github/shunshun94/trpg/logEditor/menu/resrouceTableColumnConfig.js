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
    <p>ステータスの項目を半角スペース区切りで入力してください<br/><br/>
    ステータス名の前または後にアスタリスク（*）を挿入すると前方一致・後方一致でステータスを設定できます<br/>
    例：以下の入力欄に「*HP」と記入すれば「翼HP」「胴HP」「HP」のいずれも「HP」として扱い、表示します</p>
	<input
        type="text"
        value="${defaultColumns.join(' ')}"
        id="${io.github.shunshun94.trpg.logEditor.CLASSES.RESOURCE_TABLE_COLUMN_CONFIG_WINDOW}-input"
        class="${io.github.shunshun94.trpg.logEditor.CLASSES.RESOURCE_TABLE_COLUMN_CONFIG_WINDOW}-input"
        />
	<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.RESOURCE_TABLE_COLUMN_CONFIG_WINDOW_EXEC}">決定</button>
	</div>`;
};