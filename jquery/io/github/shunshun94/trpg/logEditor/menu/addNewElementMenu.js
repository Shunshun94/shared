var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.menu = io.github.shunshun94.trpg.logEditor.menu || {};
io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu = io.github.shunshun94.trpg.logEditor.menu.AddNewElementMenu || {};

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
        <div class="experimentalfunction"><div class="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions">
            <div class="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bg">
                <table>
                    <tr>
                        <th style="text-align:right;">画像URL</th>
                        <td><input
                            id="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bg-url"
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
            </div>
            <br/>
            <div class="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgm">
                <table>
                    <tr>
                        <th style="text-align:right;">音楽URL</th>
                        <td><input
                            id="${io.github.shunshun94.trpg.logEditor.CLASSES.ADD_ELEMENT_MENU_WINDOW}-ytsheetOptions-bgm-url"
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
            </div>
        </div></div>
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
