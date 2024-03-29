var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.menu = io.github.shunshun94.trpg.logEditor.menu || {};

io.github.shunshun94.trpg.logEditor.menu.NameConfig = io.github.shunshun94.trpg.logEditor.menu.NameConfig || {};

io.github.shunshun94.trpg.logEditor.menu.NameConfig.generateDom = (nameStyleMap, isDarkMode) => {
	return `<div
		class="${io.github.shunshun94.trpg.logEditor.CLASSES.TMP_WINDOW} ${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}"
	>
	<input id="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-tab-simpleMode" type="radio" name="tab_item">
	<label class="tab_item" for="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-tab-simpleMode">色だけ変えるモードで編集（試験運転中）</label>
	<input id="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-tab-detailMode" type="radio" name="tab_item" checked>
	<label class="tab_item" for="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-tab-detailMode">詳細モードで編集</label>
	<table>
	<tr>
		<th>今の名前</th>
		<th class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-simpleHide">変更後の名前</th>
		<th class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-simpleHide">class一括変更</th>
		<th class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-simpleHide">style一括変更</th>
		<th class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-detailHide">文字色設定</th>
	</tr>
	${io.github.shunshun94.trpg.logEditor.menu.NameConfig.generateListByNames(nameStyleMap, isDarkMode)}
	</table>
	<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_EXEC}">決定</button>
	</div>`;
};

io.github.shunshun94.trpg.logEditor.menu.NameConfig.generateListByNames = (nameStyleMap, isDarkMode) => {
	const nameList = Object.keys(nameStyleMap);
	return nameList.map((name, num)=>{
		const style = nameStyleMap[name].style || '';
		const colorExecResult = /color:\s*(#[a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9])/.exec(style);
		const color = colorExecResult ? colorExecResult[1] : ( isDarkMode ? '#FFFFFF' : '#000000' );
		return `<tr class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-tr">
			<th>${name}</th>
			<td class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-td ${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-simpleHide">
				<input type="text" class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-name" placeholder="空白の場合は特に設定しません" />
			</td>
			<td class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-td ${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-simpleHide">
				<input type="text" class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-class" placeholder="空白の場合は特に設定しません" />
				<button class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-classInsert">自動生成</button>
			</td>
			<td class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-td ${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-simpleHide">
				<input type="text"
					id="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-style-${num}"
					class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-style"
					value="${style}" />
			</td>
			<td class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-td ${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-detailHide">
				<input type="color"
					id="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-color-${num}"
					class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-color"
					value="${color}" />
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

io.github.shunshun94.trpg.logEditor.menu.NameConfig.onModifyStyle = (targetStyleDom, isDarkMode) => {
	const num = /\d+$/.exec(targetStyleDom.attr('id'));
	const colorExecResult = /color:(#[a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9])/.exec(targetStyleDom.val());
	const color = colorExecResult ? colorExecResult[1] : ( isDarkMode ? '#FFFFFF' : '#000000' );
	$(`#${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-color-${num}`).val(color);
	return color;
};

io.github.shunshun94.trpg.logEditor.menu.NameConfig.onModifyColor = (targetColorDom, isDarkMode) => {
	const num = /\d+$/.exec(targetColorDom.attr('id'));
	const newColor = targetColorDom.val();
	const cuurentStyle = $(`#${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-style-${num}`).val();
	const newStyle = cuurentStyle.split(';').filter((attribute)=>{
		return ! (attribute.trim().startsWith('color'));
	}).join(';') + `color:${newColor};`;
	$(`#${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-style-${num}`).val(newStyle);
	return newStyle;
};

io.github.shunshun94.trpg.logEditor.menu.NameConfig.getInputInfo = () => {
	const result = {};
	$(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}`).find('tr').each((i, tr)=>{
		if(i === 0) {return;}
		const memberResult = {}; 
		const name = $(tr).find('th').text();
		io.github.shunshun94.trpg.logEditor.menu.NameConfig.PARAMS.forEach((column)=>{
			const value = $(tr).find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU_WINDOW}-${column}`).val().trim();
			if(value) {memberResult[column] = value; }
		});
		result[name] = memberResult;
	});
	return result;
};