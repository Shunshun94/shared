var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.menu = io.github.shunshun94.trpg.logEditor.menu || {};

io.github.shunshun94.trpg.logEditor.menu.NameConfig = io.github.shunshun94.trpg.logEditor.menu.NameConfig || {};

io.github.shunshun94.trpg.logEditor.menu.NameConfig.generateDom = (names) => {
	return `<div
		class="${io.github.shunshun94.trpg.logEditor.CLASSES.TMP_WINDOW} ${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}"
	>
	<input id="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-tab-simpleMode" type="radio" name="tab_item" checked><label class="tab_item" for="all">簡単モードで編集</label>
	<input id="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-tab-detailMode" type="radio" name="tab_item"         ><label class="tab_item" for="all">詳細モードで編集</label>
	<table>
	<tr><th>今の名前</th><th>変更後の名前</th><th>class一括変更</th><th>style一括変更</th></tr>
	${io.github.shunshun94.trpg.logEditor.menu.NameConfig.generateListByNames(names)}
	</table>
	<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_EXEC}">決定</button>
	</div>`;
};

io.github.shunshun94.trpg.logEditor.menu.NameConfig.generateListByNames = (names) => {
	return names.map((name)=>{
		return `<tr class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-tr">
			<th>${name}</th>
			<td class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-td">
				<input type="text" class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-name"　 placeholder="空白の場合は特に設定しません" />
			</td>
			<td class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-td">
				<input type="text" class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-class"　placeholder="空白の場合は特に設定しません" />
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-classInsert">自動生成</button>
			</td>
			<td class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-td">
				<input type="text" class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-style"　placeholder="空白の場合は特に設定しません" />
			</td>
		</tr>`
	}).join('\n');
};

io.github.shunshun94.trpg.logEditor.menu.NameConfig.PARAMS = ['name', 'class', 'style'];

io.github.shunshun94.trpg.logEditor.menu.NameConfig.generateClass = (seed) => {
	let str = '';
	for(let i = 0; i < seed.length; i++) {
		str += String(seed.charCodeAt(i));
	}
	return `_${str}`;
};

io.github.shunshun94.trpg.logEditor.menu.NameConfig.getInputInfo = () => {
	const result = {};
	$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}`).find('tr').each((i, tr)=>{
		if(i === 0) {return;}
		const memberResult = {}; 
		const name = $(tr).find('th').text();
		const isActive = io.github.shunshun94.trpg.logEditor.menu.NameConfig.PARAMS.filter((column)=>{
			const value = $(tr).find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-${column}`).val().trim();
			if(value) {memberResult[column] = value; }
			return value;
		});
		if(isActive.length) {
			result[name] = memberResult;
		}
	});
	return result;
};