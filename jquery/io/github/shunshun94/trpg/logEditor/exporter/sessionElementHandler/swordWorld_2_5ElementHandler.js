var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.OperationTableExporter = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter || {};
io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.SW25 = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.SW25 || {}

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.SW25.SESSION_ELEMENT_HANDLERS = [
    {
        name: 'rateTableDiceRoll',
        getMatchResult: (post)=>{
            return (/(KeyNo\.\d[\+\-\d\[\]cmragf<=]*)\s＞\s2D:\[([\d,\s]+)\]=([\d,]+)\s＞\s([\d,\+\-\*\/\(\)]+)\s＞\s?([\d回転]*)\s?＞?\s(\d+)/gm).exec(post.content);
        },
        getTableData: (post, matchResult)=> {
            const diceResults = matchResult[2].split(' ').map((pair)=>{
                return pair.split(',').map((d)=>{return Number(d)});
            });
            return {
                name: post.name.trim(),
                content: `ダイスロール: ${matchResult[0]}`,
                dice: {
                    command: matchResult[1],
                    dice:    diceResults,
                    result:  matchResult[6]
                },
                before: {
                    name: post.name,
                    content: post.content.substring(0, matchResult.index).trim()
                },
                after: {
                    name: post.name,
                    content: post.content.substring(matchResult.index).replace(matchResult[0], '').trim()
                }
            };
        }
    }, {
        name: 'druidMagicDiceRoll',
        getMatchResult: (post)=>{
            return (/\((Dru\[\d+,\d+,\d\][\+\-]?\d*)\)\s?＞\s?2D\[(\d,\d)\]=\d+\s?＞\s?\d+[\+\-]?\d*\s?＞\s?(\d+)/gm).exec(post.content);
        },
        getTableData: (post, matchResult)=> {
            const diceResults = [matchResult[2].split(',').map(Number)];
            return {
                name: post.name.trim(),
                content: `ダイスロール: ${matchResult[0]}`,
                dice: {
                    command: matchResult[1],
                    dice:    diceResults,
                    result:  matchResult[3]
                },
                before: {
                    name: post.name,
                    content: post.content.substring(0, matchResult.index).trim()
                },
                after: {
                    name: post.name,
                    content: post.content.substring(matchResult.index).replace(matchResult[0], '').trim()
                }
            };
        }
    }
];