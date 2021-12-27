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
        <table>
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
