var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ytsheet = io.github.shunshun94.trpg.ytsheet || {};
io.github.shunshun94.trpg.ytsheet.posmap = io.github.shunshun94.trpg.ytsheet.posmap || {};

io.github.shunshun94.trpg.ytsheet.posmap.EditorInitialConfig = io.github.shunshun94.trpg.ytsheet.posmap.EditorInitialConfig || {};

io.github.shunshun94.trpg.ytsheet.posmap.EditorInitialConfig.initialize = () => {
    const inputPlace = document.getElementById('initial-config');
    inputPlace.classList.add('visible');
    io.github.shunshun94.trpg.sw2.component.SheetInput.build(document.getElementById('initial-config-sheet'), {characterSheetFilter: 'ytsheet'});
    document.getElementById('initial-config-exec').addEventListener('click', (e)=>{
        const sheetUrl = io.github.shunshun94.trpg.ytsheet.posmap.fixUrl(inputPlace.getElementsByClassName('initial-config-sheet-InputArea-SheetUrl')[0].value);
        const importUrls = document.getElementById('initial-config-import').value.split(/[\n,]/).map(io.github.shunshun94.trpg.ytsheet.posmap.fixUrl).filter((d)=>{return d;}).join(',');
        location.href = `./edit.html?sheet=${sheetUrl}&import=${importUrls}`;
    });
};

io.github.shunshun94.trpg.ytsheet.posmap.ViewerInitialConfig = io.github.shunshun94.trpg.ytsheet.posmap.ViewerInitialConfig || {};

io.github.shunshun94.trpg.ytsheet.posmap.ViewerInitialConfig.initialize = () => {
    const inputPlace = document.getElementById('initial-config');
    inputPlace.classList.add('visible');
    document.getElementById('initial-config-exec').addEventListener('click', (e)=>{
        const sheetUrls = document.getElementById('initial-config-import').value.split(/[\n,]/).map(io.github.shunshun94.trpg.ytsheet.posmap.fixUrl).filter((d)=>{return d;}).join(',');
        location.href = `./view.html?sheet=${sheetUrls}`;
    });
};
