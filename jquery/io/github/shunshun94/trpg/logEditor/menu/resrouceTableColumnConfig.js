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
    <p>ダブルクロスの侵蝕率やステラナイツのブーケ等、<br/>最大値がないステータスの項目を半角スペース区切りで入力してください<br/>
    ここに記載された値は表を生成する際に最大値を出力しません</p>
    <input
        type="text"
        value=""
        id="${io.github.shunshun94.trpg.logEditor.CLASSES.RESOURCE_TABLE_COLUMN_CONFIG_WINDOW}-nomax-input"
        class="${io.github.shunshun94.trpg.logEditor.CLASSES.RESOURCE_TABLE_COLUMN_CONFIG_WINDOW}-nomax-input"
        /><br/>
	<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.RESOURCE_TABLE_COLUMN_CONFIG_WINDOW_EXEC}">決定</button>
	</div>`;
};

io.github.shunshun94.trpg.logEditor.menu.ResrouceTableColumnConfig.getInputValues = () => {
    return {
        columns: document.getElementById(`${io.github.shunshun94.trpg.logEditor.CLASSES.RESOURCE_TABLE_COLUMN_CONFIG_WINDOW}-input`).value.split(' '),
        nomax:   document.getElementById(`${io.github.shunshun94.trpg.logEditor.CLASSES.RESOURCE_TABLE_COLUMN_CONFIG_WINDOW}-nomax-input`).value.split(' '),
    };
};
