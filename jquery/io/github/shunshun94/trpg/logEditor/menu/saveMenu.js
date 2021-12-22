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
        >HTMLとして出力（再編集可能）</button><br/><br/>
        <span class="experimentalfunction"><button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save" value="${target} ytchat"
        >ゆとチャットっぽいHTMLとして出力</button><br/><br/></span>
        <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save" value="${target} hameln"
        >ハーメルン用テキストファイルとして出力</button><br/><br/>
        <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save" value="${target} pixiv"
        >Pixiv小説用テキストファイルとして出力</button><br/><br/>
        <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.SAVE_MENU_WINDOW}-save" value="${target} commonText"
        >汎用テキストファイルとして出力</button>
	</div>`;
};