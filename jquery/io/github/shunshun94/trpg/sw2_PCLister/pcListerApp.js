var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.SW2_PCListerApp = io.github.shunshun94.trpg.SW2_PCListerApp || {};
io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS = io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS || {}

io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS.COLUMNS_LIST = ['hit', 'dodge', 'magic', 'mental', 'life', 'hp', 'guard', 'rate', 'damage', 'initiative', 'enemy'];

io.github.shunshun94.trpg.SW2_PCListerApp.drawOutput = () => {
    const characters =   io.github.shunshun94.trpg.SW2_PCListerApp.getCharacterIdMap();
    const buffs      =   io.github.shunshun94.trpg.SW2_PCListerApp.getBuffIdMap();
    const appliedBuffs = io.github.shunshun94.trpg.SW2_PCListerApp.getBuffApplyTable();
    const urlsResult = {
        'outputUrl': [`${location.origin}${location.pathname}?sheets=`],
        'pcList-simple': [], 'pcList-fullA': [], 'pcList-fullB': [], 'pcList-fullC': [], 'pcList-fullD': [], 'pcList-fullE': [], 'pcList-fullF': []
    };
    const urlsResultConnector = {
        'outputUrl': ',', 'pcList-simple': ' ', 'pcList-fullA': ' ', 'pcList-fullB': ' ', 'pcList-fullC': ' ', 'pcList-fullD': ' ', 'pcList-fullE': ' ', 'pcList-fullF': ' '
    };
    const urlsResultFormat = {
        'outputUrl': '{url}', 
        'pcList-simple': '[{name}#{ID}]',
        'pcList-fullA': '[{name}({pl})#{ID}]',
        'pcList-fullB': '[{name}#{ID}]({pl})',
        'pcList-fullC': '[{name}({pl}さん)#{ID}]',
        'pcList-fullD': '[{name}#{ID}]({pl}さん)',
        'pcList-fullE': '[[{name}>{url}]]',
        'pcList-fullF': '[{name}({pl}さん)]({url})'
    };
    for(const buffId in appliedBuffs) {
        const buff = buffs[buffId];
        const buffedCharacters = appliedBuffs[buffId];
        for(const charId in buffedCharacters) {
            io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS.COLUMNS_LIST.forEach((columnName, i)=>{
                characters[charId][i + 1] += buff[io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS.BUFF_COLOMN_INDEX[columnName]];
            });
        }
    }
    for(const id in characters) {
        const char = characters[id];
        io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS.COLUMNS_LIST.forEach((c, i)=>{
            $(`#${id} .${c}`).text(char[i + 1]);
        });
        const url = $(`#${id} .name a`).attr('href');
        const name = $(`#${id} .name a`).text();
        const pl = $(`#${id} .name span`).text();
        const cid = /id=([a-zA-Z0-9]+)/.exec(url)[1];

        Object.keys(urlsResult).forEach((key)=>{
            urlsResult[key].push(
                urlsResultFormat[key] // char 内にはないので html から取るように修正すること
                    .replace('{url}', url)
                    .replace('{name}', name)
                    .replace('{pl}', pl)
                    .replace('{ID}', cid)
            );
        });
    }
    Object.keys(urlsResult).forEach((key)=>{
        $('#outputLinks #' + key).val(urlsResult[key].join(urlsResultConnector[key]));
    });
};

io.github.shunshun94.trpg.SW2_PCListerApp.getCharacterIdMap = () => {
    const characterIds = io.github.shunshun94.trpg.SW2_PCListerApp.getCharacterIdList();
    const characters = {};
    io.github.shunshun94.trpg.SW2_PCListerApp.getBaseTableOriginalData().forEach((l, i)=>{
        characters[characterIds[i].id] = l;
    });
    return characters;
};

io.github.shunshun94.trpg.SW2_PCListerApp.getBuffIdMap = () => {
    const buffIds = io.github.shunshun94.trpg.SW2_PCListerApp.getBuffIdList();
    const buffs = {};
    io.github.shunshun94.trpg.SW2_PCListerApp.getBuffTableData().forEach((l, i)=>{
        buffs[buffIds[i].id] = l.map(Number);
    });
    return buffs;
};

io.github.shunshun94.trpg.SW2_PCListerApp.getCharacterIdList = () => {
    return $('.baseTable-line').map((i, v)=>{return {id: v.id, name: $(v).find('.name').text()}}).get();
}

io.github.shunshun94.trpg.SW2_PCListerApp.getBuffIdList = () => {
    return $('.buffTable-line').map((i, v)=>{return {id: v.id, name: $(v).find('.buff-name').val()}}).get();
}

io.github.shunshun94.trpg.SW2_PCListerApp.generateBuffApplyTable = (currentValue = {}) => {
    const characterList = io.github.shunshun94.trpg.SW2_PCListerApp.getCharacterIdList();
    const buffList = io.github.shunshun94.trpg.SW2_PCListerApp.getBuffIdList();

    $('.buffApplyTable').empty();

    const nameList = $('<tr></tr>');
    characterList.forEach((char)=>{
        const name = $('<th></th>');
        name.text((char.name.length < 5) ? char.name : `${char.name.substr(0,3)}..`);
        nameList.append(name);
    });
    $('.buffApplyTable').append(nameList);

    buffList.forEach((buff)=>{
        const tr = $('<tr class="buffApplyTable-line"></tr>');

        characterList.forEach((char)=>{
            const td = $('<td></td>');
            const input = $(`<input type="checkbox" value="${buff.id}-${char.id}" />`);

            if(currentValue[buff.id] && currentValue[buff.id][char.id]) {
                input.prop('checked', true);
            }
            td.append(input);
            tr.append(td);
        });
        $('.buffApplyTable').append(tr);
    });
};

io.github.shunshun94.trpg.SW2_PCListerApp.getBuffApplyTable = () => {
    const result = {};
    $('.buffApplyTable input[type=checkbox]:checked').each((i, v)=>{
        const ids = $(v).val().split('-');
        if(! result[ids[0]]) {
            result[ids[0]] = {};
        }
        result[ids[0]][ids[1]] = 1;
    });
    return result;
};

io.github.shunshun94.trpg.SW2_PCListerApp.reloadBuffApplyTable = () => {
    io.github.shunshun94.trpg.SW2_PCListerApp.generateBuffApplyTable(
        io.github.shunshun94.trpg.SW2_PCListerApp.getBuffApplyTable()
    );
};

io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS.BUFF_TABLE_COLUMNGUIDE = {
    'hit': '命中',
    'dodge': '回避',
    'magic': '魔法行使',
    'mental': '精神抵抗',
    'life': '生命抵抗',
    'hp': 'HP',
    'guard': '防護点',
    'rate': '威力',
    'damage': '追加ダメージ',
    'initiative': '先制',
    'enemy': '魔物知識'
};

io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS.BUFF_COLOMN_INDEX = {
    'name': 0,
    'hit': 1,
    'dodge': 2,
    'magic': 3,
    'mental': 4,
    'life': 5,
    'hp': 6,
    'guard': 7,
    'rate': 11,
    'damage': 10,
    'initiative': 8,
    'enemy': 9
};
for(var key in io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS.BUFF_COLOMN_INDEX) {
    io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS.BUFF_COLOMN_INDEX[`buff-${key}`] = io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS.BUFF_COLOMN_INDEX[key];
}

io.github.shunshun94.trpg.SW2_PCListerApp.appendBuffDataTableTr = () => {
    const tr = $('<tr class="buffTable-line"></tr>');
    tr.attr('id', com.hiyoko.util.rndString());
    tr.append(`<td><input type="text" class="buff-name" /></td>`);
    io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS.COLUMNS_LIST.forEach((d)=>{
        tr.append(`<td><input type="number" value="0" title="${io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS.BUFF_TABLE_COLUMNGUIDE[d]}" class="buff-${d}" /></td>`);
    });
    tr.append('<td><button class="removeButton">✕</button></td>');
    $('#buffTable-appendTr').before(tr);
    return tr;
};

io.github.shunshun94.trpg.SW2_PCListerApp.generateTr = (data) => {
    const tr = $('<tr class="baseTable-line"></tr>');
    tr.attr('id', com.hiyoko.util.rndString());
    const name = $('<td></td>');
    const nameA = $('<a></a>');
    nameA.text(data.name);
    name.addClass('name');
    nameA.attr('href', data.url);
    nameA.attr('target', '_blank');
    name.append(nameA);
    const plName = $('<span></span>');
    plName.text(data.pl || '無記名');
    name.append(plName);
    tr.append(name);

    ['hit', 'dodge', 'magic', 'mental', 'life', 'hp', 'guard', 'rate', 'damage', 'disabled', 'initiative', 'enemy', 'remove'].forEach((d)=>{
       const td = $('<td></td>');
       td.addClass(d);
       const value = data[d] === 0 ? '0' : data[d] || '';
       td.text(value);
       td.attr('title', value);
       tr.append(td);
    });
    tr.find('.remove').append('<button class="removeButton">✕</button>');
    return tr;
};

io.github.shunshun94.trpg.SW2_PCListerApp.getBaseTableOriginalData = () => {
    const result = [];
    $(`.name`).each((i, d)=>{
        result.push([]);
        result[i].push($(d).text());
    });
    io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS.COLUMNS_LIST.forEach((c)=>{
        $(`.${c}`).each((i, d)=>{
            result[i].push(Number($(d).attr('title')));
        });
    });
    return result;
};

io.github.shunshun94.trpg.SW2_PCListerApp.getBuffTableData = () => {
    const result = [];
    $('.buffTable-line').each((_, d)=>{
        const buff = [];
        $(d).find('input').each((i, input)=>{
            const $input = $(input);
            buff[io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS.BUFF_COLOMN_INDEX[$input.prop('class')]] = $input.val();
        });
        result.push(buff);
    });
    return result;
};

io.github.shunshun94.trpg.SW2_PCListerApp.handleLoadedCharacterSheet = (dataList)=>{
    $('#sheetUrl').val('');
    $('.noDisplay').removeClass('noDisplay');
    dataList.forEach((data)=>{
        $('.baseTable').append(io.github.shunshun94.trpg.SW2_PCListerApp.generateTr(data));
    });
    if(dataList[0].type !== 'm') {
        com.hiyoko.util.updateLocalStorage('com-hiyoko-sample-sw2sheetparse-index', dataList[0].url, dataList[0].name);
    }
    io.github.shunshun94.trpg.SW2_PCListerApp.reloadBuffApplyTable();
};

io.github.shunshun94.trpg.SW2_PCListerApp.onloadJson = (json) => {
    Promise.all(json.map((d)=>{return io.github.shunshun94.trpg.SW2_PCLister.getSheet(d.url)})).then((dataList)=>{
        dataList.forEach(io.github.shunshun94.trpg.SW2_PCListerApp.handleLoadedCharacterSheet);
        const buffMap = {};
        io.github.shunshun94.trpg.SW2_PCListerApp.getBuffIdList().forEach((d)=>{
            buffMap[d.name] = d.id;
        });
        const characterMap = {};
        io.github.shunshun94.trpg.SW2_PCListerApp.getCharacterIdList().forEach((d)=>{
            characterMap[d.name] = d.id;
        });
        json.forEach((c)=>{
            (c.buffs || []).forEach((b)=>{
                $(`input[value=${buffMap[b.name]}-${characterMap[c.name]}]`).prop('checked', true);
            });
        });
        io.github.shunshun94.trpg.SW2_PCListerApp.drawOutput();
    });
};

io.github.shunshun94.trpg.SW2_PCListerApp.bindEvents = () => {
    $('#add').click((e)=>{
        io.github.shunshun94.trpg.SW2_PCLister.getSheet($('#sheetUrl').val()).then(io.github.shunshun94.trpg.SW2_PCListerApp.handleLoadedCharacterSheet);
    });
    $('#buffTable-appendTr-exec').click((e)=>{
        io.github.shunshun94.trpg.SW2_PCListerApp.appendBuffDataTableTr();
        io.github.shunshun94.trpg.SW2_PCListerApp.reloadBuffApplyTable();
    });
    $('.buffTable').change((e)=>{
        localStorage.setItem('io-github-shunshun94-trpg-sw2_pclister-buffs', JSON.stringify(io.github.shunshun94.trpg.SW2_PCListerApp.getBuffTableData()));
        io.github.shunshun94.trpg.SW2_PCListerApp.drawOutput();
    });
    $('.output').click((e)=>{
        const target = $(e.target);
        if(target.hasClass('removeButton')) {
            target.parent().parent().remove();
            io.github.shunshun94.trpg.SW2_PCListerApp.reloadBuffApplyTable();
            io.github.shunshun94.trpg.SW2_PCListerApp.drawOutput();
        }
    });
    $('#buffManager').change((e)=>{
        io.github.shunshun94.trpg.SW2_PCListerApp.drawOutput();
    });
    $('footer').on('dblclick', (e)=>{
        $('footer').remove();
    });
    $('#outputLinks input').focus((e)=>{
        $(e.target).select();
    });
    const body = $('body');
    body.on('dragleave', (e) => {
	    body.css('background-color', '');
        e.preventDefault();
    });
    body.on('dragover', (e) => {
	    body.css('background-color', 'lightyellow');
        e.preventDefault();
    });
    body.on('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const codes = new Uint8Array(fileReader.result);
            const rawString = Encoding.convert(codes, {
                to: 'unicode',
                from: Encoding.detect(codes),
                type: 'string'
            });
            try {
                const loadedData = JSON.parse(rawString);
                io.github.shunshun94.trpg.SW2_PCListerApp.onloadJson(loadedData);
            } catch(err) {
                alert('データの読み込みに失敗しました');
                console.error(err, rawString);
            }
        };
    	fileReader.readAsArrayBuffer(e.originalEvent.dataTransfer.files[0]);
        body.css('background-color', '');
    });
};

io.github.shunshun94.trpg.SW2_PCListerApp.bindEvents();

com.hiyoko.util.forEachMap(JSON.parse(localStorage.getItem('com-hiyoko-sample-sw2sheetparse-index') || '{}'), function(v, k) {
	if(! /^\d+/.test(k)) { $('#sheets').append(`<option value="${k}">${v}</option>`); }
});

JSON.parse(localStorage.getItem('io-github-shunshun94-trpg-sw2_pclister-buffs') || `[
    ["転倒",            "-2","-2","-2","0","0","0","0","-2","-2", "0", "0", "1"],
    ["ファナティシズム", "2","-2", "0","0","0","0","0", "0", "0", "0", "0", "18"],
    ["全力攻撃1",        "0","-2", "0","0","0","0","0", "0", "0", "4", "0", "1"]]`).forEach((d)=>{
    const tr = io.github.shunshun94.trpg.SW2_PCListerApp.appendBuffDataTableTr();
    tr.find('input').each((i, v)=>{
        const dom = $(v);
        $(v).val(d[io.github.shunshun94.trpg.SW2_PCListerApp.CONSTS.BUFF_COLOMN_INDEX[dom.prop('class')]]);
    });
});

Promise.all((com.hiyoko.util.getQueriesV3().sheets || '').split(',').filter((d)=>{return d.trim()}).map((url)=>{
    return io.github.shunshun94.trpg.SW2_PCLister.getSheet(url);
})).then((dataList)=>{
    io.github.shunshun94.trpg.SW2_PCListerApp.handleLoadedCharacterSheet(dataList.flat());
    io.github.shunshun94.trpg.SW2_PCListerApp.drawOutput();
});
