var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ytsheet = io.github.shunshun94.trpg.ytsheet || {};
io.github.shunshun94.trpg.ytsheet.posmap = io.github.shunshun94.trpg.ytsheet.posmap || {};

io.github.shunshun94.trpg.ytsheet.posmap.editorInstances = [];

io.github.shunshun94.trpg.ytsheet.posmap.defaultCharacter;

io.github.shunshun94.trpg.ytsheet.posmap.appendTabButton = (id, label) => {
    const tab = document.createElement('div');
    tab.textContent = label;
    tab.className = 'editor-tab-list-item';
    tab.id = `editor-tab-list-item-${id}`;
    document.getElementById('editor-tab-list-item-add').before(tab);
    return tab;
};

io.github.shunshun94.trpg.ytsheet.posmap.appendNewEditorTab = (idSuffix, items, posMapData) => {
    const newEditorElement = document.createElement('div');
    newEditorElement.id = `editor-tab-content-${idSuffix}`;
    const editor = new io.github.shunshun94.util.PositionMapping.Editor(newEditorElement, posMapData);
    items.forEach((item)=>{ editor.add(item); });
    io.github.shunshun94.trpg.ytsheet.posmap.editorInstances.push(editor);
    document.getElementById('editor-tab-content').appendChild(newEditorElement);
    return editor;
};

io.github.shunshun94.trpg.ytsheet.posmap.buildInitialEditorDoms = (sheetData, importedDataList) => {
    const name = sheetData.name;
    const id = sheetData.id;
    const image = sheetData.imageURL;
    const defaultPosMapMap = importedDataList.map((c)=>{ return c.posMapData; }).reduce((map, posMap)=>{
        return Object.assign(map, posMap);
    }, {});
    Object.keys(defaultPosMapMap).forEach((key, index)=>{
        const idSuffix = `tab${index}`;
        io.github.shunshun94.trpg.ytsheet.posmap.appendTabButton   (idSuffix, defaultPosMapMap[key].map.title);
        io.github.shunshun94.trpg.ytsheet.posmap.appendNewEditorTab(idSuffix, sheetData?.posMapData[key]?.items || [structuredClone(io.github.shunshun94.trpg.ytsheet.posmap.defaultCharacter)], defaultPosMapMap[key].map);
    });
};

io.github.shunshun94.trpg.ytsheet.posmap.updateOutput = () => {
    document.getElementById('editor-tab-content').classList.add('display-all');
    document.getElementById('editor-tab-content-output-textarea').value = '{{PositionMapping}}\n' + io.github.shunshun94.trpg.ytsheet.posmap.editorInstances.map((editor)=>{
        return {
            config: editor.getConfig(),
            items: editor.getItems()
        };
    }).map((editor)=>{
        const result = [];
        result.push(`|>|>|${editor.config.title}|`);
        result.push(`|${editor.config.top}|${editor.items[0].row}|${editor.config.bottom}|`);
        result.push(`|${editor.config.left}|${editor.items[0].column}|${editor.config.right}|`);
        return result.join('\n');
    }).join('\n') + '\n{{/PositionMapping}}';
    document.getElementById('editor-tab-content').classList.remove('display-all');
};

io.github.shunshun94.trpg.ytsheet.posmap.setupEditorEventListeners = () => {
    document.getElementById('editor-tab-list').addEventListener('click', (event)=>{
        if(event.target.id === 'editor-tab-list-item-add') {
            const count = document.getElementsByClassName('editor-tab-list-item').length;
            const idSuffix = `tab${count}`;
            const newTabElement = io.github.shunshun94.trpg.ytsheet.posmap.appendTabButton(idSuffix, `新しいマップ`);
            io.github.shunshun94.trpg.ytsheet.posmap.appendNewEditorTab(idSuffix, [structuredClone(io.github.shunshun94.trpg.ytsheet.posmap.defaultCharacter)]);
            io.github.shunshun94.trpg.ytsheet.posmap.changeTab(newTabElement);
        } else if(event.target.id === 'editor-tab-list-item-output') {
            io.github.shunshun94.trpg.ytsheet.posmap.updateOutput();
            io.github.shunshun94.trpg.ytsheet.posmap.changeTab(event.target);
        } else if(event.target.classList.contains('editor-tab-list-item')) {
            io.github.shunshun94.trpg.ytsheet.posmap.changeTab(event.target);
        }
    });
    document.getElementById('editor-tab-content').addEventListener(`${io.github.shunshun94.util.PositionMapping.consts.className}-input`, (event)=>{
        const idSuffix = event.target.id.replace('editor-tab-content-', '');
        const tabElement = document.getElementById(`editor-tab-list-item-${idSuffix}`);
        tabElement.textContent = event.detail.title;
    });
};

io.github.shunshun94.trpg.ytsheet.posmap.initializeEditor = (targetCharacterUrl, importCharacterUrlList = []) => {
    if( ! importCharacterUrlList.includes(targetCharacterUrl) ) {
        importCharacterUrlList.unshift(targetCharacterUrl);
    }
    io.github.shunshun94.trpg.ytsheet.posmap.getSheetData(targetCharacterUrl).then((sheetData)=>{
        io.github.shunshun94.trpg.ytsheet.posmap.defaultCharacter = {
            name: sheetData.name,
            id: sheetData.id,
            image: sheetData.imageURL,
            row: 0,
            column: 0
        };
        io.github.shunshun94.trpg.ytsheet.posmap.getSheetDataList(importCharacterUrlList).then((importedDataList)=>{
            io.github.shunshun94.trpg.ytsheet.posmap.buildInitialEditorDoms(sheetData, importedDataList);
            io.github.shunshun94.trpg.ytsheet.posmap.setupEditorEventListeners();
        });
    });
};
