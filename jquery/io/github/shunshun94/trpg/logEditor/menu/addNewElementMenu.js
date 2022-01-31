var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.menu = io.github.shunshun94.trpg.logEditor.menu || {};
io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu = io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu || {};

io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.CONSTS = {
    bgmKey: `${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-bgmCandList`,
    bgKey : `${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-bggCandList`
}

io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.generateDom = (nameList = []) => {
    return `<div
        class="${io.github.shunshun94.trpg.logEditor.CLASSES.TMP_WINDOW} ${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}"
    >
        <table class="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-table">
            <tr>
                <th>tag</th>
                <td><input type="text" list="io-github-shunshun94-trpg-logEditor-candidates-tags" /></td>
            </tr>
            <tr>
                <th>名前</th>
                <td><input type="text" list="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-nameList"/></td>
            </tr>
            <tr>
                <th>内容</th>
                <td><textarea></textarea></td>
            </tr>
            <tr>
                <th>id</th>
                <td><input type="text" /></td>
            </tr>
            <tr>
                <th>class</th>
                <td><input type="text" /></td>
            </tr>
            <tr>
                <th>style</th>
                <td><input type="text" /></td>
            </tr>
        </table>
        <button
            class="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-exec"
        >要素追加</button>
        <datalist id="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-nameList">
            ${nameList.map((n)=>{
                return '<option value="' + n + '" />';
            }).join('')}
        </datalist>
        <div class="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions">
            <div class="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bg">
                <table>
                    <tr>
                        <th style="text-align:right;">画像URL</th>
                        <td><input
                            class="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-url"
                            id="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bg-url"
                            list="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgList"
                            type="text" /></td>
                    </tr>
                    <tr>
                        <th style="text-align:right;">タイトル・権利情報</th>
                        <td><input
                            id="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bg-title"
                            type="text" /></td>
                    </tr>
                    <tr><td colspan="2" style="text-align:right;"><button
                        class="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bg-exec"
                    >画像の切り替え作成</button></td></tr>
                </table>
                <datalist id="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgList">
                ${JSON.parse(localStorage.getItem(io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.CONSTS.bgKey) || '[]').map((n)=>{
                    return '<option value="' + n.url + '">' + n.title + '</option>';
                }).join('')}
                </datalist>
            </div>
            <br/>
            <div class="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgm">
                <table>
                    <tr>
                        <th style="text-align:right;">音楽URL</th>
                        <td><input
                            class="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-url"
                            id="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgm-url"
                            list="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgmList"
                            type="text" /></td>
                    </tr>
                    <tr>
                        <th style="text-align:right;">ボリューム</th>
                        <td><input
                            id="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgm-volume"
                            type="number" min="1" max="100" value="10" /></td>
                    </tr>
                    <tr>
                        <th style="text-align:right;">タイトル・権利情報</th>
                        <td><input
                            id="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgm-title"
                            type="text" /></td>
                    </tr>
                    <tr><td colspan="2" style="text-align:right;"><button
                        class="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgm-exec"
                    >音楽の切り替え作成</button></td></tr>
                </table>
                <datalist id="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgmList">
                ${JSON.parse(localStorage.getItem(io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.CONSTS.bgmKey) || '[]').map((n)=>{
                    return '<option value="' + n.url + '">' + n.title + '</option>';
                }).join('')}
                </datalist>
            </div>
        </div>

    </div>`;
};

io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.getPostObject = () => {
    const inputs = $(`.${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW} input`);
    const content = $(`.${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW} textarea`).val().replaceAll('\n', '<br/>');
    return {
        tag: $(inputs[0]).val(),
        name: $(inputs[1]).val(),
        content: content,
        id: $(inputs[2]).val(),
        class: $(inputs[3]).val(),
        style: $(inputs[4]).val()
    };
};

io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.insertByUrl = (updatedDom) => {
    const id = updatedDom.attr('id');
    const regexpExecResult = /ytsheetOptions-(.+)-url/.exec(id);
    if(! Boolean(regexpExecResult)) { return; }
    const key = regexpExecResult[1];
    const url = updatedDom.val();
    const cand = JSON.parse(localStorage.getItem(io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.CONSTS[`${key}Key`]) || '[]').filter((d)=>{
        return d.url === url;
    });
    if(cand.length) {
        $(`#${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-${key}-title`).val(cand[0].title);
    }
};

io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.registerItem = (title, url, key) => {
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.unshift({
        url: url,
        title: title
    });
    const tmp = [];
    const newList = list.filter((d)=>{
        if(tmp.includes(d.url)) {return false;}
        tmp.push(d.url);
        return true;
    });
    localStorage.setItem(key, JSON.stringify(newList));
};

io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.registerBgm = (title, url) => {
    io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.RegisterItem(title, url, io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.CONSTS.bgmKey);
};

io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.registerBg = (title, url) => {
    io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.RegisterItem(title, url, io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu.CONSTS.bgKey);
};
