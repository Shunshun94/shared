var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.menu = io.github.shunshun94.trpg.logEditor.menu || {};

io.github.shunshun94.trpg.logEditor.menu.AppendMenu = io.github.shunshun94.trpg.logEditor.menu.AppendMenu || {};
io.github.shunshun94.trpg.logEditor.menu.AppendMenu.generateDom = () => {
    return `<div
		class="${io.github.shunshun94.trpg.logEditor.CLASSES.APPEND_MENU_WINDOW}"
	>
        <button
                class="${io.github.shunshun94.trpg.logEditor.CLASSES.APPEND_MENU_WINDOW}-load"
                onclick="io.github.shunshun94.trpg.logEditor.menu.AppendMenu.TMP_RESOLVE('head')"
        >出力の先頭に挿入</button><br/><br/>
        <button
                class="${io.github.shunshun94.trpg.logEditor.CLASSES.APPEND_MENU_WINDOW}-load"
                onclick="io.github.shunshun94.trpg.logEditor.menu.AppendMenu.TMP_RESOLVE('tail')"
        >出力の末尾に挿入</button><br/><br/>
        <button
                class="${io.github.shunshun94.trpg.logEditor.CLASSES.APPEND_MENU_WINDOW}-load"
                onclick="io.github.shunshun94.trpg.logEditor.menu.AppendMenu.TMP_RESOLVE('tmpA')"
        >一時置き場Aに挿入</button><br/><br/>
        <button
                class="${io.github.shunshun94.trpg.logEditor.CLASSES.APPEND_MENU_WINDOW}-load"
                onclick="io.github.shunshun94.trpg.logEditor.menu.AppendMenu.TMP_RESOLVE('tmpB')"
        >一時置き場Bに挿入</button><br/><br/>
        <button
                class="${io.github.shunshun94.trpg.logEditor.CLASSES.APPEND_MENU_WINDOW}-load"
                onclick="io.github.shunshun94.trpg.logEditor.menu.AppendMenu.TMP_REJECT('cancel')"
        >読み込みをやめる</button>
	</div>`;
};

io.github.shunshun94.trpg.logEditor.menu.AppendMenu.TMP_RESOLVE;
io.github.shunshun94.trpg.logEditor.menu.AppendMenu.TMP_REJECT;

io.github.shunshun94.trpg.logEditor.menu.AppendMenu.selectHowHandleLogs = () => {
        return new Promise((resolve, reject)=>{
                io.github.shunshun94.trpg.logEditor.menu.AppendMenu.TMP_RESOLVE = resolve;
                io.github.shunshun94.trpg.logEditor.menu.AppendMenu.TMP_REJECT = reject;
        });
};

io.github.shunshun94.trpg.logEditor.menu.AppendMenu.close = () => {
        $(`.${io.github.shunshun94.trpg.logEditor.CLASSES.APPEND_MENU_WINDOW}`).remove();
        io.github.shunshun94.trpg.logEditor.menu.AppendMenu.TMP_RESOLVE = null;
        io.github.shunshun94.trpg.logEditor.menu.AppendMenu.TMP_REJECT = null;
};