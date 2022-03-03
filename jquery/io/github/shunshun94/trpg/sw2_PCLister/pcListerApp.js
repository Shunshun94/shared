var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.SW2_PCListerApp = io.github.shunshun94.trpg.SW2_PCListerApp || {};

io.github.shunshun94.trpg.SW2_PCListerApp.generateTr = (data) => {
    const tr = $('<tr></tr>');

    const name = $('<td></td>');
    const nameA = $('<a></a>');
    nameA.text('🔗' + data.name);
    nameA.attr('href', data.url);
    nameA.attr('target', '_blank');
    name.append(nameA);
    tr.append(name);

    ['hit', 'dodge', 'magic', 'mental', 'life', 'hp', 'guard', 'disabled', 'initiative', 'enemy', 'remove'].forEach((d)=>{
       const td = $('<td></td>');
       td.addClass(d);
       td.text(data[d] === 0 ? '0' : data[d] || '');
       tr.append(td);
    });
    tr.find('.remove').append('<button class="remmoveButton">✕</button>')
    return tr;
};

io.github.shunshun94.trpg.SW2_PCListerApp.bindEvents = () => {
    $('#add').click((e)=>{
        io.github.shunshun94.trpg.SW2_PCLister.getSheet($('#sheetUrl').val()).then((data)=>{
            $('#sheetUrl').val('');
            $('.noDisplay').removeClass('noDisplay');
            $('.baseTable').append(io.github.shunshun94.trpg.SW2_PCListerApp.generateTr(data));
        });
    });
};

io.github.shunshun94.trpg.SW2_PCListerApp.bindEvents();