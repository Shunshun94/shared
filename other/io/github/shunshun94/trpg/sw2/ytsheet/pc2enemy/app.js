const initialize = () => {
    loadSheetList();
    bindEvents();
};

const request = (url) => {
    return new Promise((resolve, reject)=>{
        $.ajax({
            type:'get',
            url: `${url}&mode=json`,
            async:true,
            dataType:'jsonp'
        }).done(resolve);
    });
};

const bindEvents = () => {
    document.getElementById('exec').onclick = (e) => {
        const url = document.getElementById('sheetUrl').value;
        request(url).then((json)=>{
            console.log(json);
            const result = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.exec(json);
            console.log(result);
        })
    };
};

const loadSheetList = () => {
    const sheets = document.getElementById('sheets');
    io.github.shunshun94.util.objectToMap(JSON.parse(localStorage.getItem('com-hiyoko-sample-sw2sheetparse-index') || '{}')).forEach((v, k) => {
        if(! k.startsWith('https://charasheet.vampire-blood.net/')) {
            const option = document.createElement('option');
            option.value = k;
            option.textContent = v;
            sheets.append(option);
        }
    });
};

initialize();