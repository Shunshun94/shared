document.getElementById('exec-save').onclick = io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.saveAll;
document.getElementsByTagName('body')[0].onkeydown = (e) => {
    if(e.code === 'KeyS' && e.ctrlKey) {
        e.preventDefault();
        io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.saveAll();
    }
};
document.getElementById('exec-trainer-ccfolia').onclick = io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.getTrainerAsCcfolia;
document.getElementById('exec-pkmn-ccfolia').onclick = io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.getPkmnAsCcfolia;
document.getElementById('exec-pkmn-text').onclick = io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.getPkmnAsText;

document.getElementById('base').ondrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.loadFile(e);
};
document.getElementById('base').ondragover = (e) => {
    e.preventDefault();
    e.stopPropagation();  
};

document.getElementsByTagName('body')[0].addEventListener('paste', (e)=>{
    if(['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {return;}
    e.preventDefault();
    io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.importFromYakkun(e);
});