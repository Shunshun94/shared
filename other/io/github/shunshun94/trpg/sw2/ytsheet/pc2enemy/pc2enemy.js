var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.ytsheet = io.github.shunshun94.trpg.sw2.ytsheet || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY = io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY || {};
io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.exec = (json) => {
    const result = {
        author: json.playerName,
        initiative: json.initiative,
        intellect: (Number(json.sttInt) > 29) ? '高い' : '人間並み',
        language: io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getLanguage(json)
    };

    return result;
};

io.github.shunshun94.trpg.sw2.ytsheet.PC2ENEMY.getLanguage = (json) => {
    const languageCount = Number(json.languageNum);
    const list = [];
    for(var i = 0; i < languageCount; i++) {
        if(json[`language${i + 1}Talk`]) { list.push(json[`language${i + 1}`]) }
    }
    return list.join('、');
};