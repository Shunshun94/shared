var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.pkmn = io.github.shunshun94.trpg.pkmn || {};
io.github.shunshun94.trpg.pkmn.sheet = io.github.shunshun94.trpg.pkmn.sheet || {};

io.github.shunshun94.trpg.pkmn.sheet.SaveUtil = io.github.shunshun94.trpg.pkmn.sheet.SaveUtil || {};

io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.saveAll = () => {
    const data = io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.getValues();
    com.hiyoko.util.downloadFile(`${data['pkmn-name'] || data['pkmn-race'] || data['trainer-name'] || Number(new Date())}.json`, JSON.stringify(data));
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
        io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.applyLoadedData(json);        
    });
};

io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.applyLoadedData = (json) => {
    for(const key in json) {
        if(document.getElementById(key)) {
            document.getElementById(key).value = json[key];
        }
    }
};

io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.getTrainerAsCcfolia = (e) => {
    const data = io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.getValues(document.getElementById('trainer-data'));
    const result = {
		kind: "character",
		data: {
            name: data['trainer-name'],
            initiative: -5,
            status: [
                {
                    label: '所持金',
                    value: Number(data['trainer-moeny'])
                }
            ],
            memo: `PL:${data['trainer-player']}\n\n持ち物\n${data['trainer-item']}\n---------------\n${data['trainer-info']}`
        }
    };
    navigator.clipboard.writeText(JSON.stringify(result));
    alert('クリップボードにコピーしました。ココフォリアにペーストすればコマを作成できます');
};

io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.getPkmnAsCcfolia = (e) => {
    const data = io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.getValues();
    const result = {
		kind: "character",
		data: {
            name: data['pkmn-name'] || data['pkmn-race'],
            initiative: 2,
            status: io.github.shunshun94.trpg.pkmn.sheet.getCcfoliaStatus(data),
            params: [
                {
                    label: 'こうげき',
                    value: String(data['pkmn-pattack'])
                }, {
                    label: 'ぼうぎょ',
                    value: String(data['pkmn-pdefence'])
                }, {
                    label: 'とくこう',
                    value: String(data['pkmn-sattack'])
                }, {
                    label: 'とくぼう',
                    value: String(data['pkmn-sdefence'])
                }, {
                    label: 'すばやさ',
                    value: String(data['pkmn-speed'])
                }, {
                    label: 'もちもの',
                    value: String(data['pkmn-item'] || 'なし')
                }
            ],
            memo: `PL:${data['trainer-player']}\n特性:${data['pkmn-charactaristic'] || 'なし'}\n持物:${data['pkmn-item'] || 'なし'}\n---------------\n${data['pkmn-info']}`,
            commands: io.github.shunshun94.trpg.pkmn.sheet.generateChatPallete(data)
        }
    };
    navigator.clipboard.writeText(JSON.stringify(result));
    alert('クリップボードにコピーしました。ココフォリアにペーストすればコマを作成できます');
};

io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.getPkmnAsText = (e) => {
    const data = io.github.shunshun94.trpg.pkmn.sheet.SaveUtil.getValues(document.getElementById('pkmn-data'));
    navigator.clipboard.writeText(io.github.shunshun94.trpg.pkmn.sheet.getText(data));
    alert('クリップボードにコピーしました');
};