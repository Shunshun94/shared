var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.ytsheet = io.github.shunshun94.ytsheet || {};
io.github.shunshun94.ytsheet.addSkin = io.github.shunshun94.ytsheet.addSkin || {};
io.github.shunshun94.ytsheet.addSkin.HiyokoFormatCcfoliaJson = io.github.shunshun94.ytsheet.addSkin.HiyokoFormatCcfoliaJson || {};

io.github.shunshun94.ytsheet.addSkin.HiyokoFormatCcfoliaJson.generateStatusSummary = (characterJsonData) => {
    const result = [];
    const mountSuffix = (characterJsonData.mount && (Number(characterJsonData.lv) - Number(characterJsonData.lvMin))) ? `-${Number(characterJsonData.lv) - Number(characterJsonData.lvMin) + 1}` : '';
    result.push([
        `生命抵抗力：${io.github.shunshun94.ytsheet.addSkin.store.regist.physical.get()}（${io.github.shunshun94.ytsheet.addSkin.store.regist.physical.get() + 7}）`,
        `精神抵抗力：${io.github.shunshun94.ytsheet.addSkin.store.regist.mental.get()}（${io.github.shunshun94.ytsheet.addSkin.store.regist.mental.get() + 7}）`
    ].join(' '));
    const statusLength = Number(characterJsonData.statusNum);
    for(var i = 0; i < statusLength; i++) {
        result.push('●' + characterJsonData[`status${ i + 1}Style`]);
        result.push([
            characterJsonData[`status${ i + 1}${mountSuffix}Accuracy`] ? `命中：${characterJsonData[`status${ i + 1}${mountSuffix}Accuracy`]}（${characterJsonData[`status${ i + 1}${mountSuffix}AccuracyFix`]}）` : '',
            characterJsonData[`status${ i + 1}${mountSuffix}Damage`] ? `打撃：${characterJsonData[`status${ i + 1}${mountSuffix}Damage`]}`: ''
        ].filter((d)=>{return d}).join(' '));
        result.push([
            characterJsonData[`status${ i + 1}${mountSuffix}Evasion`] ? `回避：${characterJsonData[`status${ i + 1}${mountSuffix}Evasion`]}（${characterJsonData[`status${ i + 1}${mountSuffix}EvasionFix`]}）` : '',
            characterJsonData[`status${ i + 1}${mountSuffix}Defense`] ? `防護：${characterJsonData[`status${ i + 1}${mountSuffix}Defense`]}` : ''
        ].filter((d)=>{return d}).join(' '));
    }
    result.push('\n特殊能力');
    result.push((characterJsonData.skills || '').replaceAll(/&lt;br&gt;/g, '\n').split('\n').filter((line)=>{
        return /^([●○◯〇△＞▶〆≫☆🗨□☑]|\[[常準主補宣]\]|>>)/.test(line);
    }));
    return result.flat();
};

io.github.shunshun94.ytsheet.addSkin.HiyokoFormatCcfoliaJson.generate = (isUseFixedValue = false) => {
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
            json.data.commands += '\n' + `魔物知識判定：${characterJsonData.reputation} / ${characterJsonData['reputation+']} @まもち`;
            io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells.forEach((e, i)=>{
                const value = io.github.shunshun94.ytsheet.addSkin.store.hp.get(i);
                if( value ) {
                    json.data.status[i].value = value;
                    json.data.status[i].max = value;
                }
            });
            let skippedCount = 0;
            io.github.shunshun94.ytsheet.addSkin.store.elements.mpCells.forEach((e, i)=>{
                const value = io.github.shunshun94.ytsheet.addSkin.store.mp.get(i);
                if( value && json.data.status[i + io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells.length - skippedCount] ) {
                    json.data.status[i + io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells.length - skippedCount].value = value;
                    json.data.status[i + io.github.shunshun94.ytsheet.addSkin.store.elements.hpCells.length - skippedCount].max = value;
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




