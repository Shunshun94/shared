var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.menu = io.github.shunshun94.trpg.logEditor.menu || {};

io.github.shunshun94.trpg.logEditor.menu.saveMenu = io.github.shunshun94.trpg.logEditor.menu.saveMenu || {};
io.github.shunshun94.trpg.logEditor.menu.saveMenu.generateDom = (target) => {
    return `<div
		class="${io.github.shunshun94.trpg.logEditor.CLASSES.TMP_WINDOW} ${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}"
	>
        <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save" value="${target} html"
        >HTMLとして出力（再編集可能・まよったらとりあえずこれ）</button><br/><br/>
        <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save disableInConvert" value="${target} css"
        >CSSとして出力</button><br/><br/>
        <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save disableInConvert" value="${target} htmlCss"
        >CSSつきHTMLとして出力</button><br/><br/>
        <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save disableInConvert" value="${target} ytchat"
        >ゆとチャットっぽいHTMLとして出力</button><br/><br/>
        <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save" value="${target} hameln"
        >ハーメルン用テキストファイルとして出力</button><br/><br/>
        <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save" value="${target} pixiv"
        >Pixiv小説用テキストファイルとして出力</button><br/><br/>
        <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save" value="${target} commonText"
        >汎用テキストファイルとして出力</button><br/><br/>
        <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save disableInConvert " value="${target} operationTable"
        >分析・再利用用 HTML として出力（SW2.5とCoCにのみ対応 / フォーマットは今後変更の可能性あり）</button><br/><br/>
        <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save  disableInConvert" value="${target} operationJson"
        >分析・再利用用 JSON として出力（SW2.5とCoCにのみ対応 / フォーマットは今後変更の可能性あり）</button><br/><br/>
        <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save " value="${target} UniCoeText"
        >ユニコエへの挿入用テキストファイルとして出力（SW2.5とCoCにのみ対応 / フォーマットは今後変更の可能性あり）</button><br/><br/>
        <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save " value="${target} YukkuriMovieMaker"
        >ゆっくりムービーメーカーの台本への挿入用テキストファイルとして出力（SW2.5とCoCにのみ対応 / フォーマットは今後変更の可能性あり）</button>
        <br/><br/>
        <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save experimentalfunction  disableInConvert" value="${target} IdLogExporter"
        >ID のある要素の一覧を json 形式で出力</button>
	</div>`;
};