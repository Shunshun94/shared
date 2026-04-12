var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.ytsheet = io.github.shunshun94.ytsheet || {};
io.github.shunshun94.ytsheet.addSkin = io.github.shunshun94.ytsheet.addSkin || {};
io.github.shunshun94.ytsheet.addSkin.store = io.github.shunshun94.ytsheet.addSkin.store || {};

io.github.shunshun94.ytsheet.addSkin.store.elements = io.github.shunshun94.ytsheet.addSkin.store.elements || {};
io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells = Array.from(document.getElementsByClassName('hp')).filter((e)=>{ return e.tagName === 'TD' });
io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells.forEach((e, i)=>{ e.title = e.textContent.trim(); });
io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells = Array.from(document.getElementsByClassName('mp')).filter((e)=>{ return e.tagName === 'TD' });
io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells.forEach((e, i)=>{ e.title = e.textContent.trim(); });

io.github.shunshun94.ytsheet.addSkin.store.elements.registCells = Array.from(document.getElementsByClassName('status')[0].getElementsByTagName('dl')).filter((e)=>{ return e.textContent.includes('抵抗力') }).map((dl, _)=>{
    dl.getElementsByTagName('dd')[0].title = /(\d+) \(\d+\)/.exec(dl.getElementsByTagName('dd')[0].textContent)[1];
    dl.getElementsByTagName('dd')[0].className = `regist`;
    return dl.getElementsByTagName('dd')[0];
});

io.github.shunshun94.ytsheet.addSkin.store.hp = io.github.shunshun94.ytsheet.addSkin.store.hp || {};
io.github.shunshun94.ytsheet.addSkin.store.mp = io.github.shunshun94.ytsheet.addSkin.store.mp || {};
io.github.shunshun94.ytsheet.addSkin.store.regist = io.github.shunshun94.ytsheet.addSkin.store.regist || {};
io.github.shunshun94.ytsheet.addSkin.store.regist.physial = io.github.shunshun94.ytsheet.addSkin.store.regist.physial || {};
io.github.shunshun94.ytsheet.addSkin.store.regist.mental = io.github.shunshun94.ytsheet.addSkin.store.regist.mental || {};

io.github.shunshun94.ytsheet.addSkin.store.hp.set = (index, value) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells[index]) {
        io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells[index].textContent = value;
    }
};

io.github.shunshun94.ytsheet.addSkin.store.hp.get = (index) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells[index]) {
        return parseInt(io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells[index].textContent.trim());
    } else {
        return null;
    }
};

io.github.shunshun94.ytsheet.addSkin.store.mp.set = (index, value) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells[index]) {
        io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells[index].textContent = value;
    }
};

io.github.shunshun94.ytsheet.addSkin.store.mp.get = (index) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells[index]) {
        return parseInt(io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells[index].textContent.trim());
    } else {
        return null;
    }
};

io.github.shunshun94.ytsheet.addSkin.store.hp.setAsDiff = (index, diff) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells[index]) {
        const base = parseInt(io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells[index].title.trim());
        io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells[index].textContent = base + diff || base;
    }
};

io.github.shunshun94.ytsheet.addSkin.store.mp.setAsDiff = (index, diff) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells[index]) {
        const base = parseInt(io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells[index].title.trim());
        io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells[index].textContent = base + diff || base;
    }
};

io.github.shunshun94.ytsheet.addSkin.store.regist.physial.set = (value) => {
    const valueAsNum = Number(value);
    io.github.shunshun94.ytsheet.addSkin.store.elements.registCells[0].textContent = `${valueAsNum} (${valueAsNum + 7})`;
};

io.github.shunshun94.ytsheet.addSkin.store.regist.physial.get = () => {
    return Number(/^(\d+)/.exec(io.github.shunshun94.ytsheet.addSkin.store.elements.registCells[0].textContent.trim())[1]);
};

io.github.shunshun94.ytsheet.addSkin.store.regist.physial.setAsDiff = (value) => {
    const valueAsNum = Number(value);
    const baseValue = Number(io.github.shunshun94.ytsheet.addSkin.store.elements.registCells[0].title.trim());
    io.github.shunshun94.ytsheet.addSkin.store.elements.registCells[0].textContent = `${baseValue + valueAsNum} (${baseValue + valueAsNum + 7})`;
};

io.github.shunshun94.ytsheet.addSkin.store.regist.mental.set = (value) => {
    const valueAsNum = Number(value);
    io.github.shunshun94.ytsheet.addSkin.store.elements.registCells[1].textContent = `${valueAsNum} (${valueAsNum + 7})`;
};

io.github.shunshun94.ytsheet.addSkin.store.regist.mental.get = () => {
    return Number(/^(\d+)/.exec(io.github.shunshun94.ytsheet.addSkin.store.elements.registCells[1].textContent.trim())[1]);
};

io.github.shunshun94.ytsheet.addSkin.store.regist.mental.setAsDiff = (value) => {
    const valueAsNum = Number(value);
    const baseValue = Number(io.github.shunshun94.ytsheet.addSkin.store.elements.registCells[1].title.trim());
    io.github.shunshun94.ytsheet.addSkin.store.elements.registCells[1].textContent = `${baseValue + valueAsNum} (${baseValue + valueAsNum + 7})`;
}

io.github.shunshun94.ytsheet.addSkin.store.regist.setAsDiff = (value) => {
    io.github.shunshun94.ytsheet.addSkin.store.regist.physial.setAsDiff(value);
    io.github.shunshun94.ytsheet.addSkin.store.regist.mental.setAsDiff(value);
};
