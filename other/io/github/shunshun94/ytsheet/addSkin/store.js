var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.ytsheet = io.github.shunshun94.ytsheet || {};
io.github.shunshun94.ytsheet.addSkin = io.github.shunshun94.ytsheet.addSkin || {};
io.github.shunshun94.ytsheet.addSkin.store = io.github.shunshun94.ytsheet.addSkin.store || {};

io.github.shunshun94.ytsheet.addSkin.store.consts = {
    fixedValueRegExp: /(\d+)\s\(\d+\)/,
    damageRegExp: /2d6?([\+\-]?\d*)?/,
    reputationSeparator: '／',
};

io.github.shunshun94.ytsheet.addSkin.store.elements = io.github.shunshun94.ytsheet.addSkin.store.elements || {};
io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells = Array.from(document.getElementsByClassName('hp')).filter((e)=>{ return e.tagName === 'TD' });
io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells.forEach((e, i)=>{ e.title = e.textContent.trim(); });
io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells = Array.from(document.getElementsByClassName('mp')).filter((e)=>{ return e.tagName === 'TD' });
io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells.forEach((e, i)=>{ e.title = e.textContent.trim(); });
io.github.shunshun94.ytsheet.addSkin.store.elements.registCells = Array.from(document.getElementsByClassName('status')[0].getElementsByTagName('dl')).filter((e)=>{ return e.textContent.includes('抵抗力') }).map((dl, _)=>{
    dl.getElementsByTagName('dd')[0].title = io.github.shunshun94.ytsheet.addSkin.store.consts.fixedValueRegExp.exec(dl.getElementsByTagName('dd')[0].textContent)[1];
    dl.getElementsByTagName('dd')[0].className = `regist`;
    return dl.getElementsByTagName('dd')[0];
});
io.github.shunshun94.ytsheet.addSkin.store.elements.accCells = Array.from(document.getElementsByClassName('acc')).filter((e)=>{ return e.tagName === 'TD' });
io.github.shunshun94.ytsheet.addSkin.store.elements.accCells.forEach((e, i)=>{
    if(io.github.shunshun94.ytsheet.addSkin.store.consts.fixedValueRegExp.test(e.textContent)) {
        e.title = io.github.shunshun94.ytsheet.addSkin.store.consts.fixedValueRegExp.exec(e.textContent)[1];
    } else {
        e.title = e.textContent.trim();
    }
});
io.github.shunshun94.ytsheet.addSkin.store.elements.atkCells = Array.from(document.getElementsByClassName('atk')).filter((e)=>{ return e.tagName === 'TD' });
io.github.shunshun94.ytsheet.addSkin.store.elements.atkCells.forEach((e, i)=>{
    if(io.github.shunshun94.ytsheet.addSkin.store.consts.damageRegExp.test(e.textContent)) {
        e.title = Number(io.github.shunshun94.ytsheet.addSkin.store.consts.damageRegExp.exec(e.textContent)[1] || 0);
    } else {
        e.title = e.textContent.trim();
    }
});
io.github.shunshun94.ytsheet.addSkin.store.elements.evaCells = Array.from(document.getElementsByClassName('eva')).filter((e)=>{ return e.tagName === 'TD' });
io.github.shunshun94.ytsheet.addSkin.store.elements.evaCells.forEach((e, i)=>{
    if(io.github.shunshun94.ytsheet.addSkin.store.consts.fixedValueRegExp.test(e.textContent)) {
        e.title = io.github.shunshun94.ytsheet.addSkin.store.consts.fixedValueRegExp.exec(e.textContent)[1];
    } else {
        e.title = e.textContent.trim();
    }
});
io.github.shunshun94.ytsheet.addSkin.store.elements.defCells = Array.from(document.getElementsByClassName('def')).filter((e)=>{ return e.tagName === 'TD' });
io.github.shunshun94.ytsheet.addSkin.store.elements.defCells.forEach((e, i)=>{ e.title = e.textContent.trim(); });
io.github.shunshun94.ytsheet.addSkin.store.elements.levelCell = document.getElementsByClassName('lv')[0];
io.github.shunshun94.ytsheet.addSkin.store.elements.levelCell.title = Number(io.github.shunshun94.ytsheet.addSkin.store.elements.levelCell.textContent.trim() || 0);
io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell = Array.from(document.getElementsByClassName('status')[0].getElementsByTagName('dt')).filter((elem)=>{
    return elem.textContent === '知名度／弱点値'
})[0].parentElement.getElementsByTagName('dd')[0];
io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell.title = io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell.textContent.split(io.github.shunshun94.ytsheet.addSkin.store.consts.reputationSeparator).join(',');

io.github.shunshun94.ytsheet.addSkin.store.hp = io.github.shunshun94.ytsheet.addSkin.store.hp || {};
io.github.shunshun94.ytsheet.addSkin.store.mp = io.github.shunshun94.ytsheet.addSkin.store.mp || {};
io.github.shunshun94.ytsheet.addSkin.store.acc = io.github.shunshun94.ytsheet.addSkin.store.acc || {};
io.github.shunshun94.ytsheet.addSkin.store.atk = io.github.shunshun94.ytsheet.addSkin.store.atk || {};
io.github.shunshun94.ytsheet.addSkin.store.eva = io.github.shunshun94.ytsheet.addSkin.store.eva || {};
io.github.shunshun94.ytsheet.addSkin.store.def = io.github.shunshun94.ytsheet.addSkin.store.def || {};
io.github.shunshun94.ytsheet.addSkin.store.regist = io.github.shunshun94.ytsheet.addSkin.store.regist || {};
io.github.shunshun94.ytsheet.addSkin.store.regist.physical = io.github.shunshun94.ytsheet.addSkin.store.regist.physical || {};
io.github.shunshun94.ytsheet.addSkin.store.regist.mental = io.github.shunshun94.ytsheet.addSkin.store.regist.mental || {};
io.github.shunshun94.ytsheet.addSkin.store.reputation = io.github.shunshun94.ytsheet.addSkin.store.reputation || {};
io.github.shunshun94.ytsheet.addSkin.store.reputation.known = io.github.shunshun94.ytsheet.addSkin.store.reputation.known || {};
io.github.shunshun94.ytsheet.addSkin.store.reputation.weak = io.github.shunshun94.ytsheet.addSkin.store.reputation.weak || {};
io.github.shunshun94.ytsheet.addSkin.store.level = io.github.shunshun94.ytsheet.addSkin.store.level || {};
io.github.shunshun94.ytsheet.addSkin.store.taxa = io.github.shunshun94.ytsheet.addSkin.store.taxa || {};

io.github.shunshun94.ytsheet.addSkin.store.hp.set = (index, value) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells[index]) {
        io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells[index].textContent = value || '―';
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
        io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells[index].textContent = value || '―';
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
        io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells[index].textContent = base + diff || base || '―';
    }
};

io.github.shunshun94.ytsheet.addSkin.store.mp.setAsDiff = (index, diff) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells[index]) {
        const base = parseInt(io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells[index].title.trim());
        io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells[index].textContent = base + diff || base || '―';
    }
};

io.github.shunshun94.ytsheet.addSkin.store.regist.physical.set = (value) => {
    const valueAsNum = Number(value);
    io.github.shunshun94.ytsheet.addSkin.store.elements.registCells[0].textContent = `${valueAsNum} (${valueAsNum + 7})`;
};

io.github.shunshun94.ytsheet.addSkin.store.regist.physical.get = () => {
    return Number(/^(\d+)/.exec(io.github.shunshun94.ytsheet.addSkin.store.elements.registCells[0].textContent.trim())[1]);
};

io.github.shunshun94.ytsheet.addSkin.store.regist.physical.setAsDiff = (value) => {
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
    io.github.shunshun94.ytsheet.addSkin.store.regist.physical.setAsDiff(value);
    io.github.shunshun94.ytsheet.addSkin.store.regist.mental.setAsDiff(value);
};

io.github.shunshun94.ytsheet.addSkin.store.acc.get = (index) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.accCells[index]) {
        if(io.github.shunshun94.ytsheet.addSkin.store.consts.fixedValueRegExp.test(io.github.shunshun94.ytsheet.addSkin.store.elements.accCells[index].textContent)) {
            return io.github.shunshun94.ytsheet.addSkin.store.consts.fixedValueRegExp.exec(io.github.shunshun94.ytsheet.addSkin.store.elements.accCells[index].textContent.trim())[1];
        }
    }
    return null;
};
io.github.shunshun94.ytsheet.addSkin.store.acc.set = (index, value) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.accCells[index]) {
        io.github.shunshun94.ytsheet.addSkin.store.elements.accCells[index].textContent = Number(value) ? `${value} (${Number(value) + 7})` : '―';
    }
};
io.github.shunshun94.ytsheet.addSkin.store.acc.setAsDiff = (index, diff) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.accCells[index]) {
        const base = parseInt(io.github.shunshun94.ytsheet.addSkin.store.elements.accCells[index].title.trim());
        io.github.shunshun94.ytsheet.addSkin.store.acc.set(index, base + diff || base || null);
    }
};

io.github.shunshun94.ytsheet.addSkin.store.atk.get = (index) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.atkCells[index]) {
        const cellText = io.github.shunshun94.ytsheet.addSkin.store.elements.atkCells[index].textContent.trim();
        if( io.github.shunshun94.ytsheet.addSkin.store.consts.damageRegExp.test(cellText) ) {
            return io.github.shunshun94.ytsheet.addSkin.store.consts.damageRegExp.exec(cellText)[1];
        }
    }
    return null;
};
io.github.shunshun94.ytsheet.addSkin.store.atk.set = (index, value) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.atkCells[index] && ( value === 0 || value === '0' || Number(value) )) {
        io.github.shunshun94.ytsheet.addSkin.store.elements.atkCells[index].textContent = `2d${value > 0 ? `+${value}` : value < 0 ? `${value}` : ''}`;
    } else {
        io.github.shunshun94.ytsheet.addSkin.store.elements.atkCells[index].textContent = '―'
    }
};
io.github.shunshun94.ytsheet.addSkin.store.atk.setAsDiff = (index, diff) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.atkCells[index]) {
        const base = parseInt(io.github.shunshun94.ytsheet.addSkin.store.elements.atkCells[index].title.trim());
        io.github.shunshun94.ytsheet.addSkin.store.atk.set(index, base + diff || base || null);
    }
};

io.github.shunshun94.ytsheet.addSkin.store.eva.get = (index) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.evaCells[index]) {
        const cellText = io.github.shunshun94.ytsheet.addSkin.store.elements.evaCells[index].textContent.trim();
        if(io.github.shunshun94.ytsheet.addSkin.store.consts.fixedValueRegExp.test(cellText)) {
            return io.github.shunshun94.ytsheet.addSkin.store.consts.fixedValueRegExp.exec(cellText)[1];
        }
    }
    return null;
};
io.github.shunshun94.ytsheet.addSkin.store.eva.set = (index, value) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.evaCells[index]) {
        io.github.shunshun94.ytsheet.addSkin.store.elements.evaCells[index].textContent = Number(value) ? `${value} (${Number(value) + 7})` : '―';
    }
};
io.github.shunshun94.ytsheet.addSkin.store.eva.setAsDiff = (index, diff) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.evaCells[index]) {
        const base = parseInt(io.github.shunshun94.ytsheet.addSkin.store.elements.evaCells[index].title.trim());
        io.github.shunshun94.ytsheet.addSkin.store.eva.set(index, base + diff || base || null);
    }
};

io.github.shunshun94.ytsheet.addSkin.store.def.get = (index) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.defCells[index]) {
        return io.github.shunshun94.ytsheet.addSkin.store.elements.defCells[index].textContent.trim();
    }
    return null;
};
io.github.shunshun94.ytsheet.addSkin.store.def.set = (index, value) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.defCells[index]) {
        io.github.shunshun94.ytsheet.addSkin.store.elements.defCells[index].textContent = value || '―';
    }
};
io.github.shunshun94.ytsheet.addSkin.store.def.setAsDiff = (index, diff) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.defCells[index]) {
        const base = parseInt(io.github.shunshun94.ytsheet.addSkin.store.elements.defCells[index].title.trim());
        io.github.shunshun94.ytsheet.addSkin.store.def.set(index, base + diff || base || null);
    }
};

io.github.shunshun94.ytsheet.addSkin.store.reputation.known.get = () => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell) {
        const cellText = io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell.textContent.trim();
        const values = cellText.split(io.github.shunshun94.ytsheet.addSkin.store.consts.reputationSeparator);
        return Number(values[0]) || null;
    }
    return null;
};
io.github.shunshun94.ytsheet.addSkin.store.reputation.known.set = (value) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell) {
        const cellText = io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell.textContent.trim();
        const values = cellText.split(io.github.shunshun94.ytsheet.addSkin.store.consts.reputationSeparator);
        values[0] = value || '―';
        io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell.textContent = values.join(io.github.shunshun94.ytsheet.addSkin.store.consts.reputationSeparator);
    }
};
io.github.shunshun94.ytsheet.addSkin.store.reputation.known.setAsDiff = (diff) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell) {
        const base = Number(io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell.title.split(',')[0].trim() || '―');
        io.github.shunshun94.ytsheet.addSkin.store.reputation.known.set(base + diff || base || null);
    }
};

io.github.shunshun94.ytsheet.addSkin.store.reputation.weak.get = () => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell) {
        const cellText = io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell.textContent.trim();
        const values = cellText.split(io.github.shunshun94.ytsheet.addSkin.store.consts.reputationSeparator);
        return Number(values[1]) || null;
    }
    return null;
};
io.github.shunshun94.ytsheet.addSkin.store.reputation.weak.set = (value) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell) {
        const cellText = io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell.textContent.trim();
        const values = cellText.split(io.github.shunshun94.ytsheet.addSkin.store.consts.reputationSeparator);
        values[1] = value || '―';
        io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell.textContent = values.join(io.github.shunshun94.ytsheet.addSkin.store.consts.reputationSeparator);
    }
};
io.github.shunshun94.ytsheet.addSkin.store.reputation.weak.setAsDiff = (diff) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell) {
        const base = Number(io.github.shunshun94.ytsheet.addSkin.store.elements.reputationCell.title.split(',')[1].trim() || '―');
        io.github.shunshun94.ytsheet.addSkin.store.reputation.weak.set(base + diff || base || null);
    }
};

io.github.shunshun94.ytsheet.addSkin.store.level.get = () => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.levelCell) {
        return Number(io.github.shunshun94.ytsheet.addSkin.store.elements.levelCell.textContent.trim()) || null;
    }
    return null;
};
io.github.shunshun94.ytsheet.addSkin.store.level.set = (value) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.levelCell) {
        io.github.shunshun94.ytsheet.addSkin.store.elements.levelCell.textContent = value || '―';
    }
};
io.github.shunshun94.ytsheet.addSkin.store.level.setAsDiff = (diff) => {
    if(io.github.shunshun94.ytsheet.addSkin.store.elements.levelCell) {
        const base = Number(io.github.shunshun94.ytsheet.addSkin.store.elements.levelCell.title.trim() || '―');
        io.github.shunshun94.ytsheet.addSkin.store.level.set(base + diff || base || null);
    }
};

io.github.shunshun94.ytsheet.addSkin.store.taxa.get = () => {
    return document.getElementsByClassName('taxa')[0].innerText.trim().replace('分類：', '');
};
