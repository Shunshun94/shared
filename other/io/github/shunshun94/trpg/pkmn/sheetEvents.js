document.getElementById('exec-save').onclick = io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.saveAll;
document.getElementsByTagName('body')[0].onkeydown = (e) => {
    if(e.code === 'KeyS' && e.ctrlKey) {
        e.preventDefault();
        io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.saveAll();
    }
};

document.getElementById('base').ondrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.loadFile(e);
};
document.getElementById('base').ondragover = (e) => {
    e.preventDefault();
    e.stopPropagation();  
};