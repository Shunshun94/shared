var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.FileLoader = io.github.shunshun94.trpg.logEditor.FileLoader || {};

io.github.shunshun94.trpg.logEditor.FileLoader.CONST = io.github.shunshun94.trpg.logEditor.FileLoader.CONST || {};
io.github.shunshun94.trpg.logEditor.FileLoader.CONST.ID = io.github.shunshun94.trpg.logEditor.CLASSES.FILTER + 'tabmanage';

io.github.shunshun94.trpg.logEditor.FileLoader.filtTabs = (data) => {
    return new Promise((resolve, reject)=>{
        const tabs = data.tabs;
        const tabsCount = Object.keys(tabs).length;
        if(tabsCount > 2) {
            io.github.shunshun94.trpg.logEditor.FileLoader.openBackScreen();
            io.github.shunshun94.trpg.logEditor.FileLoader.openTabManageWindow(tabs);
            $(`.${io.github.shunshun94.trpg.logEditor.CLASSES.FILTER} > button`).click((e)=>{
                const collectedTabs = io.github.shunshun94.trpg.logEditor.FileLoader.collectTabManageInputInfo();
                data.doms = io.github.shunshun94.trpg.logEditor.FileLoader.filterDoms(data.doms, collectedTabs);
                data.tabList = io.github.shunshun94.trpg.logEditor.FileLoader.collectUsedTabsClasses(collectedTabs);
                resolve(data);
                io.github.shunshun94.trpg.logEditor.FileLoader.closeTabManageWindow();
            });
        } else {
            data.tabList = [];
            resolve(data);
        }
    });
};

io.github.shunshun94.trpg.logEditor.FileLoader.collectUsedTabsClasses = (collectedTabInfo) => {
    const result = [];
    for(var key in collectedTabInfo) {
        result.push(collectedTabInfo[key].classes.split(' '));
    }
    return [...new Set(result.flat().filter((d)=>{return d}))];
};

io.github.shunshun94.trpg.logEditor.FileLoader.filterDoms = (doms, collectedTabInfo) => {
    return doms.filter((dom)=>{
        return collectedTabInfo[dom.tabName].isActive;
    }).map((dom)=>{
        dom.class = collectedTabInfo[dom.tabName].classes;
        return dom;
    });
};

io.github.shunshun94.trpg.logEditor.FileLoader.collectTabManageInputInfo = () => {
    const result = {};
    Array.from(document.getElementById(io.github.shunshun94.trpg.logEditor.FileLoader.CONST.ID).getElementsByTagName('tr')).forEach((tr)=>{
        const tabName = tr.getElementsByTagName('label')[0].textContent;
        const inputs = tr.getElementsByTagName('input');
        result[tabName] = {
            isActive: inputs[0].checked,
            classes:  inputs[1].value
        };
    });
    return result;
};

io.github.shunshun94.trpg.logEditor.FileLoader.closeTabManageWindow = () => {
    $('#' + io.github.shunshun94.trpg.logEditor.CLASSES.FILTER + 'tabmanage').remove();
};

io.github.shunshun94.trpg.logEditor.FileLoader.generateInputForTab = (tabName, index) => {
    const tabInfo = document.createElement('tr');

    const tabNameLabel = document.createElement('label');
    tabNameLabel.textContent = tabName;

    const tabActivateCheckboxText = document.createElement('label');
    tabActivateCheckboxText.textContent = '読み込む：';
    tabActivateCheckboxText.setAttribute('style', 'padding-left:2em;');

    const tabActivateCheckbox = document.createElement('input');
    tabActivateCheckbox.setAttribute('type', 'checkbox');
    tabActivateCheckbox.setAttribute('checked', '1');

    const tabClassText = document.createElement('label');
    tabClassText.textContent = 'このタブに付与するクラス：';
    tabClassText.setAttribute('style', 'padding-left:2em;');

    const tabClass = document.createElement('input');
    tabClass.setAttribute('type', 'text');
    if(index) {
        tabClass.setAttribute('value', `tab${index}`);
    }

    const beTab1 = document.createElement('button');
    beTab1.className = 'tab1';
    beTab1.textContent = 'tab1 にする';

    [tabNameLabel, tabActivateCheckboxText, tabActivateCheckbox, tabClassText, tabClass, beTab1].forEach((d)=>{
        const td = document.createElement('td');
        td.append(d);
        tabInfo.append(td);
    });

    return tabInfo;
};

io.github.shunshun94.trpg.logEditor.FileLoader.openTabManageWindow = (tabs) => {
    const result = document.createElement('div');
    result.className = io.github.shunshun94.trpg.logEditor.CLASSES.FILTER;
    result.id = io.github.shunshun94.trpg.logEditor.FileLoader.CONST.ID;

    const explainText = document.createElement('p');
    explainText.append('ログの各タブについて出力するか否かを設定してください。');
    explainText.append(document.createElement('br'));
    explainText.append('また、出力する場合どのようなクラスを付与して出力するかを決定してください。');
    explainText.append(document.createElement('br'));
    explainText.append('tab1 のクラスを付与することで小さく表示し、本筋とは関係ない雑談や相談であるとわかりやすくすることができます。');

    const table = document.createElement('table');
    let i = 0;
    for(var tabRawName in tabs) {
        table.append(io.github.shunshun94.trpg.logEditor.FileLoader.generateInputForTab(tabRawName, i));
        i++;
    }

    const done = document.createElement('button');
    done.textContent = '決定';

    result.append(explainText);
    result.append(table);
    result.append(document.createElement('br'));
    result.append(done);
    io.github.shunshun94.trpg.logEditor.DOMS.BODY.append(result.outerHTML);
};