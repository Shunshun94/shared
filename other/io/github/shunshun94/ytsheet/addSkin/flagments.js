var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.ytsheet = io.github.shunshun94.ytsheet || {};
io.github.shunshun94.ytsheet.addSkin = io.github.shunshun94.ytsheet.addSkin || {};
io.github.shunshun94.ytsheet.addSkin.flagments = io.github.shunshun94.ytsheet.addSkin.flagments || {};

io.github.shunshun94.ytsheet.addSkin.flagments.initialize = () => {
    if(generateType !== 'SwordWorld2Enemy') {
        return;
    };
    Array.from(document.getElementsByClassName('name')).filter((e)=>{ return e.tagName === 'TD' }).forEach((e, i)=>{
    e.innerHTML += `<div style="font-size:70%;background-color:rgba(120, 120, 120, 0.5);" class="fragments screen-shot-remove">
        剣の欠片：
        <button style="width:1em;" class="fragments-minus" value="${i}">-</button>
        <span style="display:inline-block;width:2em;" class="flagments-count">0</span>
        <button style="width:1em;" class="fragments-plus" value="${i}">+</button></div>`;
    });
    document.getElementsByTagName('table')[0].addEventListener('click', (e) => {
        const target = e.target;
        if( (! target.className.startsWith('fragments-')) || target.tagName !== 'BUTTON') {
            return;
        }
        io.github.shunshun94.ytsheet.addSkin.flagments.onUpdate(e);
    });
};

io.github.shunshun94.ytsheet.addSkin.flagments.onUpdate = (e) => {
    const index = e.target.value;
    const countSpan = document.getElementsByClassName('flagments-count')[index];
    let count = parseInt(countSpan.textContent);
    if(e.target.className === 'fragments-minus')  {				
        if(count > 0) {
            count--;
        }
    } else {
        count++;
    }
    countSpan.textContent = count;
    io.github.shunshun94.ytsheet.addSkin.store.hp.setAsDiff(index, count * 5);
    io.github.shunshun94.ytsheet.addSkin.store.mp.setAsDiff(index, count);

    const totalFragments = Array.from(document.getElementsByClassName('flagments-count')).reduce((sum, span) => {
        return sum + parseInt(span.textContent);
    }, 0);
    const registBonusByFragments = Math.min(4, Math.ceil(totalFragments / 5));
    io.github.shunshun94.ytsheet.addSkin.store.regist.setAsDiff(registBonusByFragments);
};

io.github.shunshun94.ytsheet.addSkin.flagments.initialize();
