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
    document.getElementById('input').addEventListener(
        io.github.shunshun94.trpg.sw2.component.SheetInput.EVENTS.SHEET_URL_INPUT,
        (e) => {
            const url = e.url;
            request(url).then((json)=>{
                json.sourceUrl = url;
                const result = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.exec(json);
                e.resolve();
                console.log(result);
            })
        }
    );
};

const loadSheetList = () => {
    io.github.shunshun94.trpg.sw2.component.SheetInput.build(document.getElementById('input'), {characterSheetFilter: 'ytsheet'});
};

initialize();