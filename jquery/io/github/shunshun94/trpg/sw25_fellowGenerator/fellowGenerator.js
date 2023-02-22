var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.FellowGenerator = io.github.shunshun94.trpg.FellowGenerator || {};

io.github.shunshun94.trpg.FellowGenerator.TABLE_KEY = [
    { key: 1, column: '1・2' },
    { key: 3, column: '3・4' },
    { key: 5, column: '5' },
    { key: 6, column: '6' }
];

io.github.shunshun94.trpg.FellowGenerator.generate = (json, isDetail = false) => {
    if(isDetail) {
        return io.github.shunshun94.trpg.FellowGenerator.generateDetail(json);
    } else {
        return io.github.shunshun94.trpg.FellowGenerator.generateSimple(json);
    }
};

io.github.shunshun94.trpg.FellowGenerator.generateSimple = (json) => {
    if(json.fellowPublic !== '1') {
        throw "フェローのデータがありません";
    }
    return io.github.shunshun94.trpg.FellowGenerator.TABLE_KEY.map((key)=>{
        const act1Name  = json[`fellow${ key.key }Action`];
        const act1Value = json[`fellow${ key.key }Num`];
        const act2Name  = json[`fellow${ key.key }-2Action`];
        const act2Value = json[`fellow${ key.key }-2Num`];
        if( act1Name ) {
            if( act2Name ) {
                return `出目 ${ key.column }: ${ act1Name } (${act1Value}) / ${ act2Name } (${act2Value})`;
            } else {
                return `出目 ${ key.column }: ${ act1Name } (${act1Value})`;
            }
        }
    }).join('\n');
};

io.github.shunshun94.trpg.FellowGenerator.generateDetail = (json) => {
    if(json.fellowPublic !== '1') {
        throw "フェローのデータがありません";
    }
    return io.github.shunshun94.trpg.FellowGenerator.TABLE_KEY.map((key)=>{
        const act1Name  = json[`fellow${ key.key }Action`];
        const act1Value = json[`fellow${ key.key }Num`];
        const act1Note  = json[`fellow${ key.key }Note`];
        const act2Name  = json[`fellow${ key.key }-2Action`];
        const act2Value = json[`fellow${ key.key }-2Num`];
        const act2Note  = json[`fellow${ key.key }-2Note`];
        if( act1Name ) {
            if( act2Name ) {
                return `出目 ${ key.column }: ${ act1Name } (${act1Value}) ${act1Note} OR ${ act2Name } (${act2Value}) ${act2Note}`;
            } else {
                return `出目 ${ key.column }: ${ act1Name } (${act1Value}) ${act1Note}`;
            }
        }
    }).join('\n');
};
