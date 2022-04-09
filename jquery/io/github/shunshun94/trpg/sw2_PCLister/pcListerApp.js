var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.SW2_PCListerApp = io.github.shunshun94.trpg.SW2_PCListerApp || {};

io.github.shunshun94.trpg.SW2_PCListerApp.rewriteFixedBaseTable = () => {
    const characters =   io.github.shunshun94.trpg.SW2_PCListerApp.getCharacterIdMap();
    const buffs      =   io.github.shunshun94.trpg.SW2_PCListerApp.getBuffIdMap();
    const appliedBuffs = io.github.shunshun94.trpg.SW2_PCListerApp.getBuffApplyTable();
    for(const buffId in appliedBuffs) {
        const buff = buffs[buffId];
        const buffedCharacters = appliedBuffs[buffId];
        for(const charId in buffedCharacters) {
            ['hit', 'dodge', 'magic', 'mental', 'life', 'hp', 'guard', 'initiative', 'enemy'].forEach((dummy, i)=>{
                characters[charId][i + 1] += buff[i + 1];
            });
        }
    }
    for(const id in characters) {
        const char = characters[id];
        ['hit', 'dodge', 'magic', 'mental', 'life', 'hp', 'guard', 'initiative', 'enemy'].forEach((c, i)=>{
            $(`#${id} .${c}`).text(char[i + 1]);
        });
    }
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

io.github.shunshun94.trpg.SW2_PCListerApp.appendBuffDataTableTr = () => {
    const tr = $('<tr class="buffTable-line"></tr>');
    tr.attr('id', com.hiyoko.util.rndString());
    tr.append(`<td><input type="text" class="buff-name" /></td>`);
    ['hit', 'dodge', 'magic', 'mental', 'life', 'hp', 'guard', 'initiative', 'enemy'].forEach((d)=>{
        tr.append(`<td><input type="number" value="0" class="buff-${d}" /></td>`);
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
    tr.append(name);

    ['hit', 'dodge', 'magic', 'mental', 'life', 'hp', 'guard', 'disabled', 'initiative', 'enemy', 'remove'].forEach((d)=>{
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
    ['hit', 'dodge', 'magic', 'mental', 'life', 'hp', 'guard', 'initiative', 'enemy'].forEach((c)=>{
        $(`.${c}`).each((i, d)=>{
            result[i].push(Number($(d).attr('title')));
        });
    });
    return result;
};

io.github.shunshun94.trpg.SW2_PCListerApp.getBuffTableData = () => {
    const result = [];
    $('.buffTable-line').each((dummy1, d)=>{
        result.push($(d).find('input').map((dummy2, v)=>{ return $(v).val(); }).get());
    });
    return result;
};

io.github.shunshun94.trpg.SW2_PCListerApp.bindEvents = () => {
    $('#add').click((e)=>{
        io.github.shunshun94.trpg.SW2_PCLister.getSheet($('#sheetUrl').val()).then((dataList)=>{
            $('#sheetUrl').val('');
            $('.noDisplay').removeClass('noDisplay');
            dataList.forEach((data)=>{
                $('.baseTable').append(io.github.shunshun94.trpg.SW2_PCListerApp.generateTr(data));
            });
            if(dataList[0].type !== 'm') {
                com.hiyoko.util.updateLocalStorage('com-hiyoko-sample-sw2sheetparse-index', dataList[0].url, dataList[0].name);
            }
            io.github.shunshun94.trpg.SW2_PCListerApp.reloadBuffApplyTable();
        });
    });
    $('#buffTable-appendTr-exec').click((e)=>{
        io.github.shunshun94.trpg.SW2_PCListerApp.appendBuffDataTableTr();
        io.github.shunshun94.trpg.SW2_PCListerApp.reloadBuffApplyTable();
    });
    $('.buffTable').change((e)=>{
        localStorage.setItem('io-github-shunshun94-trpg-sw2_pclister-buffs', JSON.stringify(io.github.shunshun94.trpg.SW2_PCListerApp.getBuffTableData()));
        io.github.shunshun94.trpg.SW2_PCListerApp.rewriteFixedBaseTable();
    });
    $('.output').click((e)=>{
        const target = $(e.target);
        if(target.hasClass('removeButton')) {
            target.parent().parent().remove();
            io.github.shunshun94.trpg.SW2_PCListerApp.reloadBuffApplyTable();
            io.github.shunshun94.trpg.SW2_PCListerApp.rewriteFixedBaseTable();
        }
    });
    $('#buffManager').change((e)=>{
        io.github.shunshun94.trpg.SW2_PCListerApp.rewriteFixedBaseTable();
    });
    $('footer').on('dblclick', (e)=>{
        $('footer').remove();
    });
};

io.github.shunshun94.trpg.SW2_PCListerApp.bindEvents();

com.hiyoko.util.forEachMap(JSON.parse(localStorage.getItem('com-hiyoko-sample-sw2sheetparse-index') || '{}'), function(v, k) {
	if(! /^\d+/.test(k)) { $('#sheets').append(`<option value="${k}">${v}</option>`); }
});

JSON.parse(localStorage.getItem('io-github-shunshun94-trpg-sw2_pclister-buffs') || `[
    ["転倒",            "-2","-2","-2","0","0","0","0","-2","-2", "0"],
    ["ファナティシズム", "2","-2", "0","0","0","0","0", "0", "0", "0"],
    ["全力攻撃1",        "0","-2", "0","0","0","0","0", "0", "0", "4"]]`).forEach((d)=>{
    const tr = io.github.shunshun94.trpg.SW2_PCListerApp.appendBuffDataTableTr();
    tr.find('input').each((i, v)=>{
        $(v).val(d[i])
    });
});