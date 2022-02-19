var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.pkmn = io.github.shunshun94.trpg.pkmn || {};
io.github.shunshun94.trpg.pkmn.sheet = io.github.shunshun94.trpg.pkmn.sheet || {};

io.github.shunshun94.trpg.pkmn.sheet.SaveUtil = io.github.shunshun94.trpg.pkmn.sheet.SaveUtil || {};

io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.saveAll = () => {
    const data = io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.getValues();
    com.hiyoko.util.downloadFile(`${data['trainer-name'] || data['pkmn-name'] || data['pkmn-race'] || Number(new Date())}.json`, JSON.stringify(data));
};

io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.getValues = (baseDom = document.getElementsByTagName('body')[0]) => {
    const result = {};
    ['input', 'textarea', 'select'].forEach((tagName)=>{
        Array.from(baseDom.getElementsByTagName(tagName)).forEach((d)=>{
            const id = d.id;
            result[id] = d.value;
        });
    });
    return result;
};

io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.loadFile = (e) => {
    const targetFile = e.dataTransfer.files[0];
    targetFile.arrayBuffer().then((rawFile)=>{
        const rawJson = Encoding.convert(new Uint8Array(rawFile), {
            to: 'unicode',
            from: Encoding.detect(new Uint8Array(rawFile)),
            type: 'string'
        });
        const json = JSON.parse(rawJson);
        for(const key in json) {
            document.getElementById(key).value = json[key];
        }
    });
};