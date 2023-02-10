var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ytsheet = io.github.shunshun94.trpg.ytsheet || {};

io.github.shunshun94.trpg.ytsheet.AutoComplete = io.github.shunshun94.trpg.ytsheet.AutoComplete || {};
io.github.shunshun94.trpg.ytsheet.AutoComplete.CONSTS = {
    STORAGE_KEY: 'ytsheet-autocomplete-',
    DEFAULT_KEY: 'Name'
};

io.github.shunshun94.trpg.ytsheet.AutoComplete.Common = io.github.shunshun94.trpg.ytsheet.AutoComplete.Common || {};
io.github.shunshun94.trpg.ytsheet.AutoComplete.Learning = io.github.shunshun94.trpg.ytsheet.AutoComplete.Learning || {};
io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting = io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting || {};

io.github.shunshun94.trpg.ytsheet.AutoComplete.Common.commonColumnFilter = (dom, key) => {
    return dom.name.endsWith(key);
};

io.github.shunshun94.trpg.ytsheet.AutoComplete.Common.getNameInputs = (target) => {
    const key = target.key || io.github.shunshun94.trpg.ytsheet.AutoComplete.CONSTS.DEFAULT_KEY;
    const inputs = Array.from(target.element.getElementsByTagName('input'));
    return inputs.filter((input)=>{
        return (target.keyColumnFilter || io.github.shunshun94.trpg.ytsheet.AutoComplete.Common.commonColumnFilter)(input, key);
    });
};

io.github.shunshun94.trpg.ytsheet.AutoComplete.Common.load = (targetStorageName) => {
    return JSON.parse(localStorage.getItem(targetStorageName) || '{}');
};

io.github.shunshun94.trpg.ytsheet.AutoComplete.Common.save = (targetStorageName, saveTargets) => {
    const targetStorage = io.github.shunshun94.trpg.ytsheet.AutoComplete.Common.load(targetStorageName);
    saveTargets.forEach((saveTarget)=>{
        targetStorage[saveTarget.keyColumn] = targetStorage[saveTarget.keyColumn] || {};
        for(var column in saveTarget) {
            if(column !== 'keyColumn') {
                targetStorage[saveTarget.keyColumn][column] = saveTarget[column];
            }
        }
    });
    localStorage.setItem(targetStorageName, JSON.stringify(targetStorage));
};

io.github.shunshun94.trpg.ytsheet.AutoComplete.Learning.getInputedData = (target) => {
    const key = target.key || io.github.shunshun94.trpg.ytsheet.AutoComplete.CONSTS.DEFAULT_KEY;
    const nameInputs = io.github.shunshun94.trpg.ytsheet.AutoComplete.Common.getNameInputs(target).filter((input)=>{return input.value;});
    return nameInputs.map((nameInput)=>{
        const columnNamePrefix = nameInput.name.replace(key, '');
        const result = {};
        result.keyColumn = nameInput.value;
        target.columns.forEach((column)=>{
            const targetDom = document.getElementsByName(`${columnNamePrefix}${column}`)[0];
            if(targetDom && targetDom.value) {
                result[column] = targetDom.value;
            }
        });
        return result;
    });
};

io.github.shunshun94.trpg.ytsheet.AutoComplete.Learning.learn = (targetList) => {
    const systemName = location.href.split('/').slice(-2, -1);
    const storageKey = io.github.shunshun94.trpg.ytsheet.AutoComplete.CONSTS.STORAGE_KEY;
    targetList.forEach((target)=>{
        const targetStorageName = `${storageKey}${systemName}-${target.name || target.element.id}`;
        const saveTargets = io.github.shunshun94.trpg.ytsheet.AutoComplete.Learning.getInputedData(target);
        io.github.shunshun94.trpg.ytsheet.AutoComplete.Common.save(targetStorageName, saveTargets);
    });
};

io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting.bindInputEvent = (nameInput, storageKey, key) => {
    nameInput.setAttribute('list', `${storageKey}-list`);
    nameInput.addEventListener('input', (e)=>{
        const data = io.github.shunshun94.trpg.ytsheet.AutoComplete.Common.load(storageKey);
        const item = data[e.target.value];
        if(item) {
            const columnNamePrefix = e.target.name.replace(key, '');
            for(var column in item) {
                document.getElementsByName(`${columnNamePrefix}${column}`)[0].value = item[column];
            }
        }
    });
};

io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting.generateDataListOptions = (storageKey) => {
    const data = io.github.shunshun94.trpg.ytsheet.AutoComplete.Common.load(storageKey);
    const nameList= [];
    for(var name in data) {
        nameList.push(name);
    }
    return nameList.sort().map((name)=>{
        const option = document.createElement('option');
        option.value = name;
        return option;
    });
};

io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting.generateDataListHtml = (storageKey) => {
    const dataList = document.createElement('datalist');
    dataList.id = `${storageKey}-list`;
    io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting.generateDataListOptions(storageKey).forEach((option)=>{
        //TODO apply でまとめて登録できない？
        dataList.append(option);
    });
    return dataList;
};

io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting.insertDataListHtml = (targetList, baseElement = document.getElementsByTagName('body')[0]) => {
    const systemName = location.href.split('/').slice(-2, -1);
    const storagePrefix = io.github.shunshun94.trpg.ytsheet.AutoComplete.CONSTS.STORAGE_KEY;
    targetList.forEach((target)=>{
        const storageKey = `${storagePrefix}${systemName}-${target.name || target.element.id}`;
        baseElement.append(io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting.generateDataListHtml(storageKey));
    });
};

io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting.updateDataListHtml = (targetList) => {
    const systemName = location.href.split('/').slice(-2, -1);
    const storagePrefix = io.github.shunshun94.trpg.ytsheet.AutoComplete.CONSTS.STORAGE_KEY;
    targetList.forEach((target)=>{
        const storageKey = `${storagePrefix}${systemName}-${target.name || target.element.id}`;
        const dataList = document.getElementById(`${storageKey}-list`);
        dataList.innerHTML = '';
        io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting.generateDataListOptions(storageKey).forEach((option)=>{
            dataList.append(option);
        });
    });
};

io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting.initialize = (targetList, baseElement = document.getElementsByTagName('body')[0]) => {
    const systemName = location.href.split('/').slice(-2, -1);
    const storagePrefix = io.github.shunshun94.trpg.ytsheet.AutoComplete.CONSTS.STORAGE_KEY;
    io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting.insertDataListHtml(targetList, baseElement);
    targetList.forEach((target)=>{
        const key = target.key || io.github.shunshun94.trpg.ytsheet.AutoComplete.CONSTS.DEFAULT_KEY;
        const nameInputs = io.github.shunshun94.trpg.ytsheet.AutoComplete.Common.getNameInputs(target);
        const storageKey = `${storagePrefix}${systemName}-${target.name || target.element.id}`;

        nameInputs.forEach((nameInput)=>{
            io.github.shunshun94.trpg.ytsheet.AutoComplete.Inserting.bindInputEvent(nameInput, storageKey, key);
        });
    });
};