var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ytsheet = io.github.shunshun94.trpg.ytsheet || {};
io.github.shunshun94.trpg.ytsheet.posmap = io.github.shunshun94.trpg.ytsheet.posmap || {};

io.github.shunshun94.trpg.ytsheet.posmap.appendTabButton = (id, label) => {
    const tab = document.createElement('div');
    tab.textContent = label;
    tab.className = 'viewer-tab-list-item';
    tab.id = `viewer-tab-list-item-${id}`;
    document.getElementById('viewer-tab-list-item-links').before(tab);
    return tab;
};

io.github.shunshun94.trpg.ytsheet.posmap.appendNewViewerTab = (idSuffix, items, posMapData) => {
    const newViewerElement = document.createElement('div');
    newViewerElement.id = `viewer-tab-content-${idSuffix}`;
    const viewer = new io.github.shunshun94.util.PositionMapping.Viewer(newViewerElement, posMapData);
    items.forEach((item)=>{ viewer.add(item); });
    document.getElementById('viewer-tab-content').appendChild(newViewerElement);
    return viewer;
};

io.github.shunshun94.trpg.ytsheet.posmap.buildViewerDoms = (sheetDataList) => {
    const posMapMap = sheetDataList.map((c)=>{ return c.posMapData; }).reduce((map, posMap)=>{
        Object.keys(posMap).forEach((key)=>{
            if(! map[key]) {
                map[key] = posMap[key];
            } else {
                map[key].items.push(...posMap[key].items);
            }
        });
        return map;
    }, {});
    Object.keys(posMapMap).forEach((key, index)=>{
        const idSuffix = `tab${index}`;
        io.github.shunshun94.trpg.ytsheet.posmap.appendTabButton(idSuffix, posMapMap[key].map.title);
        io.github.shunshun94.trpg.ytsheet.posmap.appendNewViewerTab(idSuffix, posMapMap[key].items, posMapMap[key].map);
    });
};

io.github.shunshun94.trpg.ytsheet.posmap.setupViewerEventListeners = () => {
    document.getElementById('viewer-tab-list').addEventListener('click', (event)=>{
        if(event.target.classList.contains('viewer-tab-list-item')) {
            io.github.shunshun94.trpg.ytsheet.posmap.changeTab(event.target);
        }
    });
};

io.github.shunshun94.trpg.ytsheet.posmap.generateLinks = (sheetDataList) => {
    const fixUrl = (url) => {
        return encodeURIComponent(/https:\/\/yutorize\.work\/ytsheet\/sw2\.5\/\?id=([a-zA-Z0-9]+)/.exec(url)?.[1] || url);
    };
    const generateLinkElement = (text, url) => {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = text;
        link.target = '_blank';
        return link;
    };
    const allUrls = sheetDataList.map((sheetData)=>{ return fixUrl(sheetData.url); });
    const base = document.getElementById('viewer-tab-content-links');
    const table = document.createElement('table');
    const header = document.createElement('tr');
    const headerNameCell = document.createElement('th');
    headerNameCell.textContent = '名前';
    header.appendChild(headerNameCell);
    const headerSheetCell = document.createElement('th');
    headerSheetCell.textContent = 'キャラクターシート';
    header.appendChild(headerSheetCell);
    const headerEditCell = document.createElement('th');
    headerEditCell.textContent = '編集';
    header.appendChild(headerEditCell);
    table.appendChild(header);
    sheetDataList.forEach((sheetData)=>{
        const row = document.createElement('tr');

        const nameCell = document.createElement('th');
        nameCell.textContent = sheetData.name;
        row.appendChild(nameCell);

        const sheetLink = generateLinkElement('キャラクターシート', sheetData.url);
        const sheetCell = document.createElement('td');
        sheetCell.appendChild(sheetLink);
        row.appendChild(sheetCell);

        const editCell = document.createElement('td');
        const editLink = generateLinkElement('編集', `edit.html?sheet=${fixUrl(sheetData.url)}&import=${allUrls.join(',')}`);
        editCell.appendChild(editLink);
        row.appendChild(editCell);

        table.appendChild(row);
    });
    base.appendChild(table);
};

io.github.shunshun94.trpg.ytsheet.posmap.initializeViewer = (targetCharacterUrls = []) => {
    io.github.shunshun94.trpg.ytsheet.posmap.getSheetDataList(targetCharacterUrls).then((sheetDataList)=>{
        io.github.shunshun94.trpg.ytsheet.posmap.buildViewerDoms(sheetDataList);
        io.github.shunshun94.trpg.ytsheet.posmap.generateLinks(sheetDataList);
        io.github.shunshun94.trpg.ytsheet.posmap.setupViewerEventListeners();
    });
};
