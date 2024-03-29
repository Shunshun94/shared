var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.OperationTableExporter = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter || {};
io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.TEMPLATE = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.TEMPLATE || {};

/**************************************************
 *追加したら systemMap.js への追加も忘れないこと！*
 *************************************************/

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.TEMPLATE.SESSION_ELEMENT_HANDLERS = [
    {
        name: 'editedResourceManage',
        getMatchResult: (post)=>{
            return (/([^\t\n\r]+)\s:\s(\d+)\s→\s(\d+)/gm).exec(post.content);
        },
        getTableData: (post, matchResult)=> {
            const diff = Number(matchResult[3]) - Number(matchResult[2]);
            return {
                name: post.name.trim(),
                paramUpdate: {
                    column: matchResult[1],
                    before: matchResult[2],
                    after:  matchResult[3],
                    diff:   diff
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
        name: 'commonDiceRoll',
        getMatchResult: (post)=>{
            return (/\(([\dD\-\+\*\/]+)\)\s＞\s([\d\[\],\+\-\*\/]+)\s＞\s(\d+)/gm).exec(post.content);
        },
        getTableData: (post, matchResult)=> {
            const diceResults = [];
            let text = matchResult[2];
            let execResult;
            while(execResult = /\[([\d,]+)\]/.exec(text)) {
                diceResults.push(execResult[1].split(',').map((d)=>{return Number(d);}));
                text = text.replace(execResult[0], '');
            }

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


