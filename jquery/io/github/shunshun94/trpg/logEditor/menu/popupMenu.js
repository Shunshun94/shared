var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.menu = io.github.shunshun94.trpg.logEditor.menu || {};

io.github.shunshun94.trpg.logEditor.menu.PopupMenu = io.github.shunshun94.trpg.logEditor.menu.PopupMenu || {};

io.github.shunshun94.trpg.logEditor.menu.PopupMenu.generateHtml = () => {
    return `<div class="${io.github.shunshun94.trpg.logEditor.CLASSES.POPUP_MENU}">
        <div class="${io.github.shunshun94.trpg.logEditor.CLASSES.NAME_MENU}">名前に関して設定</div>
        <div class="${io.github.shunshun94.trpg.logEditor.CLASSES.STYLE_RESET_MENU}">style を全削除</div>
        <div class="${io.github.shunshun94.trpg.logEditor.CLASSES.ID_INSERTION_MENU}">全ての見出しにランダムな ID を挿入</div>
        <div class="${io.github.shunshun94.trpg.logEditor.CLASSES.SYSTEM_TO_POST_MENU}">System の発言を個人の発言に変換</div>
    </div>
    <button class="${io.github.shunshun94.trpg.logEditor.CLASSES.POPUP_MENU_TOGGLE}">メニュー(Alt+M)</button>`;
};

io.github.shunshun94.trpg.logEditor.menu.PopupMenu.toggle = () => {
    $(`.${io.github.shunshun94.trpg.logEditor.CLASSES.POPUP_MENU}`).toggle(400);
};