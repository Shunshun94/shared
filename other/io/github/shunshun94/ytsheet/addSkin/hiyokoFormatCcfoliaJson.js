var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.ytsheet = io.github.shunshun94.ytsheet || {};
io.github.shunshun94.ytsheet.addSkin = io.github.shunshun94.ytsheet.addSkin || {};
io.github.shunshun94.ytsheet.addSkin.HiyokoFormatCcfoliaJson = io.github.shunshun94.ytsheet.addSkin.HiyokoFormatCcfoliaJson || {};

io.github.shunshun94.ytsheet.addSkin.HiyokoFormatCcfoliaJson.generateStatusSummary = (characterJsonData) => {
    const result = [];
    const store = io.github.shunshun94.ytsheet.addSkin.store;
    result.push([
        `生命抵抗力：${store.regist.physical.get()}（${store.regist.physical.get() + 7}）`,
        `精神抵抗力：${store.regist.mental.get()}（${store.regist.mental.get() + 7}）`
    ].join(' '));
    const statusLength = Number(characterJsonData.statusNum);
    for(var i = 0; i < statusLength; i++) {
        result.push('●' + characterJsonData[`status${ i + 1}Style`]);
        result.push([
            Number(store.acc.get(i)) ? `命中：${store.acc.get(i)}（${Number(store.acc.get(i)) + 7}）` : '',
            (store.atk.get(i) !== null) ? `打撃：2d${store.atk.get(i)}`: ''
        ].filter((d)=>{return d}).join(' '));
        result.push([
            Number(store.eva.get(i)) ? `回避：${store.eva.get(i)}（${Number(store.eva.get(i)) + 7}）` : '',
            Number(store.def.get(i)) ? `防護：${store.def.get(i)}` : ''
        ].filter((d)=>{return d}).join(' '));
    }
    result.push('\n特殊能力');
    result.push((characterJsonData.skills || '').replaceAll(/&lt;br&gt;/g, '\n').split('\n').filter((line)=>{
        return /^([●○◯〇△＞▶〆≫☆🗨□☑]|\[[常準主補宣]\]|>>)/.test(line);
    }));
    return result.flat();
};

io.github.shunshun94.ytsheet.addSkin.HiyokoFormatCcfoliaJson.generate = (isUseFixedValue = false) => {
    const store = io.github.shunshun94.ytsheet.addSkin.store;
    getJsonData('ccfolia').then((characterJsonData) => {
        output.generateCcfoliaJson(generateType, characterJsonData, location.href).then((jsonString)=>{
            const json = JSON.parse(jsonString);
            json.data.externalUrl = '';
            // 移動力.魔物レベル0ランダムの値 というフォーマットになる
            json.data.initiative = Number('-' + String((parseInt((/\d+/.exec(characterJsonData.mobility) || ['00'])[0]))).padStart(2, '0') + '.' + String(characterJsonData.lv || '00').padStart(2, '0') + '0' + String(Math.floor((Math.random() * 100) % 100)).padStart(2, '0'));
            if(isUseFixedValue) {
                json.data.commands = json.data.commands.split('\n').map((l)=>{
                    if(l.startsWith('2d') && ! l.includes('ダメージ')) {
                        return l.replace(/2d[^\s]*/, `C($&)`).replace('2d', '7')
                    } else {
                        return l;
                    }
                }).join('\n');
            }
            json.data.commands += '\n' + Array.from(document.getElementsByClassName('loots')[0]?.getElementsByTagName('dl')[0].children || []).map((elem)=>{return elem.textContent}).map((d, i)=>{
                if( i % 2 ) { return `${d}\n`} else { return `戦利品　${d}：`; }
            }).join('').trim();
            json.data.commands += '\n' + `魔物知識判定：${store.reputation.known.get()} / ${store.reputation.weak.get()} @まもち`;
            store.elements.hpCells.forEach((e, i)=>{
                const value = store.hp.get(i);
                if( value ) {
                    json.data.status[i].value = value;
                    json.data.status[i].max = value;
                }
            });
            let skippedCount = 0;
            store.elements.mpCells.forEach((e, i)=>{
                const value = store.mp.get(i);
                if( value && json.data.status[i + store.elements.hpCells.length - skippedCount] ) {
                    json.data.status[i + store.elements.hpCells.length - skippedCount].value = value;
                    json.data.status[i + store.elements.hpCells.length - skippedCount].max = value;
                } else {
                    skippedCount++;
                }
            });
            const totalFragments = io.github.shunshun94.ytsheet.addSkin.flagments.getTotalFragments();
            const registBonusByFragments = Math.min(4, Math.ceil(totalFragments / 5));
            json.data.params = json.data.params.map((param) => {
                if( param.label.includes('抵抗修正') ) { param.value = String(registBonusByFragments); }
                return param;
            });
            json.data.memo = [
                (totalFragments ? '剣の欠片：' + totalFragments + '個' : ''),
                `種族：${characterJsonData.taxa}　知覚：${characterJsonData.perception}`,
                `弱点：${characterJsonData.weakness}`,
                ``, '能力値',
            ].concat(io.github.shunshun94.ytsheet.addSkin.HiyokoFormatCcfoliaJson.generateStatusSummary(characterJsonData)).join('\n').trim();
            popTextareaForCopy(JSON.stringify(json));
        });
    });
};




