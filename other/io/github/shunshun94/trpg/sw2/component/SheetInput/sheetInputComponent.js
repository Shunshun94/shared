var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.component = io.github.shunshun94.trpg.sw2.component || {};
io.github.shunshun94.trpg.sw2.component.SheetInput = io.github.shunshun94.trpg.sw2.component.SheetInput || {};
io.github.shunshun94.trpg.sw2.component.SheetInput.EVENTS = io.github.shunshun94.trpg.sw2.component.SheetInput.EVENTS || {};
io.github.shunshun94.trpg.sw2.component.SheetInput.EVENTS = {
    SHEET_URL_INPUT: 'io-github-shunshun94-trpg-sw2-component-SheetInput-events-sheet_url_input'
};
io.github.shunshun94.trpg.sw2.component.SheetInput.build = (targetDom, options={}) => {
    const uniqueId = Math.floor(Math.random()*50000);
    const baseClass = options.className || targetDom.class || targetDom.id || 'io-github-shunshun94-trpg-sw2-component-SheetInput';

    const baseInputArea = document.createElement('span');
    const inputAreaId = `${baseClass}-InputArea`;
    baseInputArea.className = inputAreaId;
    baseInputArea.append(document.createTextNode(options.sheetExplanationText || 'キャラクターシートURL：'));

    const sheetUrl = document.createElement('input');
    const listId = `${inputAreaId}-Sheets${uniqueId}`;
    sheetUrl.setAttribute('list', listId);
    sheetUrl.className = `${inputAreaId}-SheetUrl`;
    sheetUrl.id = `${inputAreaId}-SheetUrl${uniqueId}`;
    baseInputArea.append(sheetUrl);

    const button = document.createElement('button');
    button.textContent = options.executeText || '実行';
    button.className = `${inputAreaId}-Exec`;
    button.id = `${inputAreaId}-Exec${uniqueId}`;
    baseInputArea.append(button);
    button.onclick =  (e) => {
        const event = new Event(io.github.shunshun94.trpg.sw2.component.SheetInput.EVENTS.SHEET_URL_INPUT, {
            bubbles: true, cancelable: true,
        });
        event.url = sheetUrl.value;
        event.resolve = ()=>{sheetUrl.value = '';};
        e.target.dispatchEvent(event);
    };

    targetDom.append(baseInputArea);


    const dataList = document.createElement('datalist');
    dataList.id = listId;
    const characterList = JSON.parse(localStorage.getItem('com-hiyoko-sample-sw2sheetparse-index') || '{}');
    const characterSheetFilter = io.github.shunshun94.trpg.sw2.component.SheetInput.getCharacterSheetFilter(options);
    for(var url in characterList) {
        if(characterSheetFilter(url)) {
            const characterOption = document.createElement('option');
            characterOption.value = url;
            characterOption.textContent = characterList[url];
            dataList.append(characterOption);
        }
    }
    targetDom.append(dataList);
    return targetDom;
};

io.github.shunshun94.trpg.sw2.component.SheetInput.getCharacterSheetFilter = (options) => {
    if(['vampire-blood', 'vampireblood', 'VampireBlood', 'vampireBlood'].includes(options.characterSheetFilter || options.filter || '') ) {
        return (url)=>{
            return url.startsWith('https://charasheet.vampire-blood.net/');
        };
    }
    if(['ytsheet', 'ytSheet', 'YtSheet'].includes(options.characterSheetFilter || options.filter || '') ) {
        return (url)=>{
            return (! url.startsWith('https://charasheet.vampire-blood.net/'));
        };
    }
    return ()=>{return true;};
};


