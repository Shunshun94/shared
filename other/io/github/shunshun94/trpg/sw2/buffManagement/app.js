var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.BuffManagement = io.github.shunshun94.trpg.sw2.BuffManagement || {};
io.github.shunshun94.trpg.sw2.BuffManagement.CONSTS = {
    storageKey: 'io-github-shunshun94-trpg-sw2_pclister-buffs',
    columns: [
        { "name": ""},
        { "name": "名称", "id": 0, type: 'text'},
        { "name": "命中修正", "id": 1},
        { "name": "回避修正", "id": 2},
        { "name": "魔力修正", "id": 3},
        { "name": "精神抵抗修正", "id": 4},
        { "name": "生命抵抗修正", "id": 5},
        { "name": "追加D修正", "id": 10},
        { "name": "削除"},
    ],
    reversedColumns: {},
    buffColumns: [],
    EVENT: 'io-github-shunshun94-trpg-sw2-buffManagement-update',
};

io.github.shunshun94.trpg.sw2.BuffManagement.CONSTS.columns.forEach((col) => {
    if(col.id !== undefined) {
        io.github.shunshun94.trpg.sw2.BuffManagement.CONSTS.reversedColumns[col.id] = col;
    }
});
io.github.shunshun94.trpg.sw2.BuffManagement.CONSTS.buffColumns = io.github.shunshun94.trpg.sw2.BuffManagement.CONSTS.columns.filter((col) => col.id !== undefined);

io.github.shunshun94.trpg.sw2.BuffManagement.onUpate = (e) => {
    const checkboxStatusList = io.github.shunshun94.trpg.sw2.BuffManagement.collectCheckBoxStatus();
    const buffs = io.github.shunshun94.trpg.sw2.BuffManagement.collectBuffsFromTable();
    io.github.shunshun94.trpg.sw2.BuffManagement.saveToStorage(buffs);
    const copyBase = io.github.shunshun94.trpg.sw2.BuffManagement.updateQuickInputRow(buffs, checkboxStatusList);
    const event = new CustomEvent(io.github.shunshun94.trpg.sw2.BuffManagement.CONSTS.EVENT, { detail: copyBase, bubbles: true });
    e.target.dispatchEvent(event);
};

io.github.shunshun94.trpg.sw2.BuffManagement.updateQuickInputRow = (buffs, checkboxStatusList) => {
    const columnList = io.github.shunshun94.trpg.sw2.BuffManagement.CONSTS.buffColumns;
    const checked = checkboxStatusList.map((status, idx) => { return { checked: status, index: idx } }).filter((item) => item.checked).map((item)=>{ return item.index; });
    const checkedBuffs = buffs.filter((_, index) => checked.includes(index));
    const result = {};
    columnList.slice(1).forEach((col) => {
        let val = 0;
        checkedBuffs.forEach((buff) => {
            val += Number(buff[col.id] || 0);
        });
        document.querySelector(`.quick-output-${col.id}`).value = `:${col.name}=${val}`;
        result[col.name] = `:${col.name}=${val}`;
    });
    result.report = '受けているバフ・デバフ\n' + checkedBuffs.map((buff)=>{
        const buffDetail = columnList.slice(1).filter((col) => Number(buff[col.id])).map((d)=> {
            return `${d.name}:${buff[d.id] || 0}`;
        }).join(', ');
        return `　${buff[0]}${buffDetail ? `(${buffDetail})` : ''}`;
    }).join('\n') + '\n\n合計\n' + Object.entries(result).filter(([key, _]) => key !== 'report').map(([key, value]) => value).join('\n');
    return result;
};

io.github.shunshun94.trpg.sw2.BuffManagement.collectCheckBoxStatus = () => {
    const table = document.querySelector('.buff-management-table');
    return Array.from(table.rows).map((row)=>{
        return row.querySelector('input[type="checkbox"]');
    }).filter((checkbox) => checkbox !== null).map((checkbox) => {
        return checkbox.checked
    });
};

io.github.shunshun94.trpg.sw2.BuffManagement.collectBuffsFromTable = () => {
    const columnList = io.github.shunshun94.trpg.sw2.BuffManagement.CONSTS.buffColumns;
    const currentMasterData = {};
    io.github.shunshun94.trpg.sw2.BuffManagement.loadFromStorage().forEach((buff) => {
        currentMasterData[buff[0]] = buff;
    });
    const table = document.querySelector('.buff-management-table');
    return Array.from(table.rows).map((row) => {
        return Array.from(row.getElementsByTagName('input'));
    }).filter((inputs) => {
        return inputs.length;
    }).slice(1).map((inputs) => { // 結果カラム除外したいので slice
        const result = [];
        const name = inputs[1].value;
        const masterData = currentMasterData[name];
        inputs.slice(1).forEach((input, idx) => { // チェックボックス除外したいので slice
            const col = columnList[idx];
            for( var i = result.length; i < col.id; i++ ) {
                result.push(masterData ? masterData[i] || 0 : 0);
            }
            result.push(input.value);
        });
        for ( var i = result.length; i < (masterData || []).length; i++ ) {
            result.push(masterData ? masterData[i] || 0 : 0);
        }
        return result;    
    });
};

io.github.shunshun94.trpg.sw2.BuffManagement.removeBuffLine = (e) => {
    const button = e.target;
    const row = button.closest('tr');
    row.parentNode.removeChild(row);
};

io.github.shunshun94.trpg.sw2.BuffManagement.generateBuffLine = (_, buff = {}, checkStatus = false) => {
    const newRow = document.createElement('tr');
    const checkCell = document.createElement('td');
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = checkStatus;
    checkCell.appendChild(checkBox);
    newRow.appendChild(checkCell);

    io.github.shunshun94.trpg.sw2.BuffManagement.CONSTS.columns.forEach(col => {
        if(col.id === undefined) { return; }
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = col.type || 'number';
        input.value = buff[col.id] || ( input.type === 'number' ? '0' : '' );
        input.className = `quick-input-${col.id} quick-input`;
        cell.appendChild(input);
        newRow.appendChild(cell);
    });

    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', io.github.shunshun94.trpg.sw2.BuffManagement.removeBuffLine);
    deleteCell.appendChild(deleteButton);
    newRow.appendChild(deleteCell);
    return newRow;
};

io.github.shunshun94.trpg.sw2.BuffManagement.copyItem = (e) => {
    if(e.target.classList.contains('quick-output')) { navigator.clipboard.writeText(e.target.value);}
}

io.github.shunshun94.trpg.sw2.BuffManagement.generateInitialTableElement = (
    buffs = io.github.shunshun94.trpg.sw2.BuffManagement.loadFromStorage(),
    checkStatusList = []
) => {
    const table = document.createElement('table');
    table.addEventListener('change', io.github.shunshun94.trpg.sw2.BuffManagement.onUpate);
    table.addEventListener('input', io.github.shunshun94.trpg.sw2.BuffManagement.onUpate);
    table.addEventListener('click', io.github.shunshun94.trpg.sw2.BuffManagement.copyItem);
    table.classList.add('buff-management-table');
    const headerRow = document.createElement('tr');
    io.github.shunshun94.trpg.sw2.BuffManagement.CONSTS.columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col.name.replace('修正', '').slice(0, 3);
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    const quickInputRow = document.createElement('tr');
    quickInputRow.appendChild(document.createElement('td'));
    const quickInputLabel = document.createElement('td');
    quickInputLabel.textContent = '修正値更新コマンド';
    quickInputRow.appendChild(quickInputLabel);
    io.github.shunshun94.trpg.sw2.BuffManagement.CONSTS.columns.forEach(col => {
        if(! col.id) { return; }
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.readOnly = true;
        input.value = `:${col.name}=0`;
        input.className = `quick-output-${col.id} quick-output`;
        cell.appendChild(input);
        quickInputRow.appendChild(cell);
    });
    quickInputRow.appendChild(document.createElement('td'));
    table.appendChild(quickInputRow);

    buffs.forEach((buff, index) => {      
        const row = io.github.shunshun94.trpg.sw2.BuffManagement.generateBuffLine(null, buff, checkStatusList[index]);
        table.appendChild(row);
    });
    const footerRow = document.createElement('tr');
    const footerCell = document.createElement('td');
    footerCell.colSpan = 9;
    const addButton = document.createElement('button');
    addButton.textContent = '行追加';
    addButton.addEventListener('click', (e) => {
        const newRow = io.github.shunshun94.trpg.sw2.BuffManagement.generateBuffLine(e);
        table.insertBefore(newRow, footerRow);
    });
    footerCell.appendChild(addButton);
    footerRow.appendChild(footerCell);
    table.appendChild(footerRow);
    return table;
};

io.github.shunshun94.trpg.sw2.BuffManagement.loadFromStorage = () => {
    return JSON.parse(localStorage.getItem(io.github.shunshun94.trpg.sw2.BuffManagement.CONSTS.storageKey) || `[
        ["転倒",            "-2","-2","-2","0","0","0","0","-2","-2", "0", "0", "1"],
        ["ファナティシズム", "2","-2", "0","0","0","0","0", "0", "0", "0", "0", "18"],
        ["全力攻撃1",        "0","-2", "0","0","0","0","0", "0", "0", "4", "0", "1"]]`);
};

io.github.shunshun94.trpg.sw2.BuffManagement.saveToStorage = (buffs) => {
    localStorage.setItem(io.github.shunshun94.trpg.sw2.BuffManagement.CONSTS.storageKey, JSON.stringify(buffs));
    return buffs;
};
