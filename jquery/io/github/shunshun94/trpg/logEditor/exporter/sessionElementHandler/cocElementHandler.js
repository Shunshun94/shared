var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.OperationTableExporter = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter || {};
io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.COC = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.COC || {};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.COC.SESSION_ELEMENT_HANDLERS = [
    {
        name: 'coc7CommonRoll',
        getMatchResult: (post)=>{
            return (/\(([\dD<=]+)\)\sボーナス・ペナルティダイス\[([\-\d]+)\]\s＞\s([\d\s,]+)\s＞\s(\d+)\s?＞?\s?([レギュラーハドイクストリム成功ティカル失敗ファンブ]*)/gm).exec(post.content);
        },
        getTableData: (post, matchResult)=> {
            const diceResults = [matchResult[3].split(',').map((d)=>{return Number(d.trim())})];
            const bonus = Number(matchResult[2]);
            const command = bonus ?
                (bonus > 0 ? `${matchResult[1]} （ボーナスダイス${bonus}個）` : `${matchResult[1]} （ペナルティダイス${bonus * -1}個）`) :
                matchResult[1];
            return {
                name: post.name.trim(),
                content: `ダイスロール: ${command}`,
                dice: {
                    command: command,
                    dice:    diceResults,
                    result:  matchResult[5] || matchResult[4]
                },
                before: {
                    name: post.name,
                    content: io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.removeSystemNamePrefix(post.content.substring(0, matchResult.index).trim())
                },
                after: {
                    name: post.name,
                    content: post.content.substring(matchResult.index).replace(matchResult[0], '').trim()
                }
            };
        }
    }, {
        name: 'coc6CommonRoll',
        getMatchResult: (post)=>{
            return (/\(([\dD<=]+)\)\s?故?障?ナ?ン?バ?ー?\[?(\d*)\]?\s＞\s([\d]+)\s＞\s([故障\/ファンブル自動決定的成功スペシャ致命的失敗]*)/gm).exec(post.content);
        },
        getTableData: (post, matchResult)=> {
            const diceResults = [[Number(matchResult[3])]];
            const broken = Number(matchResult[2]);
            const command = broken ? `${matchResult[1]} （故障ナンバー${broken}）` : matchResult[1];
            return {
                name: post.name.trim(),
                content: `ダイスロール: ${command}`,
                dice: {
                    command: command,
                    dice:    diceResults,
                    result:  matchResult[5] || matchResult[4]
                },
                before: {
                    name: post.name,
                    content: io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.removeSystemNamePrefix(post.content.substring(0, matchResult.index).trim())
                },
                after: {
                    name: post.name,
                    content: post.content.substring(matchResult.index).replace(matchResult[0], '').trim()
                }
            };
        }
    }
];


