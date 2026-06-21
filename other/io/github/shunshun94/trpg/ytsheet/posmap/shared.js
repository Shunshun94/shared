var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ytsheet = io.github.shunshun94.trpg.ytsheet || {};
io.github.shunshun94.trpg.ytsheet.posmap = io.github.shunshun94.trpg.ytsheet.posmap || {};

io.github.shunshun94.trpg.ytsheet.posmap.getSheetData = (tmpUrl) => {
    const url = (/^[A-Za-z0-9]+$/).test(tmpUrl) ? `https://yutorize.work/ytsheet/sw2.5/?id=${tmpUrl}` : tmpUrl;
    return new Promise((resolve, reject)=>{
        $.ajax({
            type:'get',
            url: `${url}&mode=json`,
            async:true,
            dataType:'jsonp'
        }).done((data)=>{
            const sheetData = {
                name: data.namePlate || data.characterName,
                id: data.id,
                imageURL: data.imageURL
            };
            sheetData.posMapData = io.github.shunshun94.trpg.ytsheet.posmap.importPosMapData(data);
            resolve(sheetData);
        });
    });
};

io.github.shunshun94.trpg.ytsheet.posmap.getSheetDataList = (urlList) => {
    return Promise.all(urlList.map((url)=>{
        return io.github.shunshun94.trpg.ytsheet.posmap.getSheetData(url);
    }));
};
 
io.github.shunshun94.trpg.ytsheet.posmap.importPosMapData = (sheetData) => {
    const startString = '{{PositionMapping}}';
    const result = {};
    const rawFreeText = (sheetData.freeNote || '').split(startString).at(-1).split('&lt;br&gt;').slice(1);
    let cursor = '';
    for(var i = 0; i < rawFreeText.length; i++) {
        const line = rawFreeText[i].trim();
        if(! rawFreeText[i].startsWith('|')) { break; }
        if( i % 3 == 0 ) {
            const title = line.split('|').at(-2);
            cursor = title;
            result[cursor] = {
                map: {
                    title: title
                },
                items: [{
                    name: sheetData.namePlate || sheetData.characterName,
                    id: sheetData.id,
                    image: sheetData.imageURL
                }]
            };
        }
        if ( i % 3 == 1 ) {
            const [ , top, row, bottom ] = line.split('|');
            result[cursor].map.top = top;
            result[cursor].map.bottom = bottom;
            result[cursor].items[0].row = Number(row);
        }
        if ( i % 3 == 2 ) {
            const [ , left, column, right ] = line.split('|');
            result[cursor].map.left = left;
            result[cursor].map.right = right;
            result[cursor].items[0].column = Number(column);
        }
    }
    return result;
};

io.github.shunshun94.trpg.ytsheet.posmap.changeTab = (tabElement) => {
    tabElement.parentNode.getElementsByClassName('active')[0]?.classList.remove('active');
    tabElement.classList.add('active');
    const idSuffix = tabElement.id.split('-').at(-1);
    const contentParentElement = document.getElementsByClassName('positionMapping-content')[0];
    contentParentElement.getElementsByClassName('active')[0]?.classList.remove('active');
    document.getElementById(`${contentParentElement.id}-${idSuffix}`).classList.add('active');
    return tabElement;
};
