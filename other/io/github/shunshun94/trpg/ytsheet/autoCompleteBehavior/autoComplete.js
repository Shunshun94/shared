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

io.github.shunshun94.trpg.ytsheet.AutoComplete.Learning = io.github.shunshun94.trpg.ytsheet.AutoComplete.Learning || {};

io.github.shunshun94.trpg.ytsheet.AutoComplete.Learning.commonColumnFilter = (dom, key) => {
    return dom.name.endsWith(key);
};

io.github.shunshun94.trpg.ytsheet.AutoComplete.Learning.getInputedData = (target) => {
    const inputs = Array.from(target.element.getElementsByTagName('input'));
    const key = target.key || io.github.shunshun94.trpg.ytsheet.AutoComplete.CONSTS.DEFAULT_KEY;
    const nameInputs = inputs.filter((input)=>{
        return (target.keyColumnFilter || io.github.shunshun94.trpg.ytsheet.AutoComplete.Learning.commonColumnFilter)(input, key);
    }).filter((input)=>{return input.value;});
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

io.github.shunshun94.trpg.ytsheet.AutoComplete.load = (targetStorageName) => {
    return JSON.parse(localStorage.getItem(targetStorageName) || '{}');
};

io.github.shunshun94.trpg.ytsheet.AutoComplete.save = (targetStorageName, saveTargets) => {
    const targetStorage = io.github.shunshun94.trpg.ytsheet.AutoComplete.load(targetStorageName);
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

io.github.shunshun94.trpg.ytsheet.AutoComplete.Learning.learn = (targetList) => {
    const systemName = location.href.split('/').slice(-2, -1);
    const storageKey = io.github.shunshun94.trpg.ytsheet.AutoComplete.CONSTS.STORAGE_KEY;
    targetList.forEach((target)=>{
        const targetStorageName = `${storageKey}${systemName}-${target.name || target.element.id}`;
        const saveTargets = io.github.shunshun94.trpg.ytsheet.AutoComplete.Learning.getInputedData(target);
        io.github.shunshun94.trpg.ytsheet.AutoComplete.save(targetStorageName, saveTargets);
    });
};