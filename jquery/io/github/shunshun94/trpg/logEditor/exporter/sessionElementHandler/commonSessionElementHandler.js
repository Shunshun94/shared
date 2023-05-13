var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.OperationTableExporter = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter || {};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS || {};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS.REGEXP = {
    SystemNamePrefix: /\n.*\s*:\s*$/,
    ResrouceManage: /\[\s(.+)\s\]\s(.+)\s:\s(\d+)\s→\s(\d+)/gm,
    EditedResourceManage: /([^\t\n\r]+)\s:\s(\d+)\s→\s(\d+)/gm
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.removeSystemNamePrefix = (text) => {
    const execResult = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS.REGEXP.SystemNamePrefix.exec(text);
    if( execResult ) {
        return text.replace(execResult[0], '').trim();
    }
    return text;
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS.SESSION_ELEMENT_HANDLERS = [
    {
        name: 'commonResourceManage',
        getMatchResult: (post)=>{
            return (io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS.REGEXP.ResrouceManage).exec(post.content);
        },
        getTableData: (post, matchResult)=> {
            const diff = Number(matchResult[4]) - Number(matchResult[3]);
            const name = matchResult[1];
            return {
                name: name,
                paramUpdate: {
                    column: matchResult[2],
                    before: matchResult[3],
                    after:  matchResult[4],
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
        name: 'editedResourceManage',
        getMatchResult: (post)=>{
            return (io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS.REGEXP.EditedResourceManage).exec(post.content);
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
            return (/\(([\dD\-\+\*\/\(\)\*]+)>?=?\d*\)\s[＞→]\s([\d\[\],\+\-\*\/\(\)\*]+)\s[＞→]\s(\d+)/gm).exec(post.content);
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
                    content: io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.removeSystemNamePrefix(post.content.substring(0, matchResult.index).trim())
                },
                after: {
                    name: post.name,
                    content: post.content.substring(matchResult.index).replace(matchResult[0], '').trim()
                }
            };
        }
    }, {
        name: 'singleDiceRoll',
        getMatchResult: (post)=>{
            return (/\(([\dD\-\+\*\/\(\)\*]+)>?=?\d*\)\s[＞→]\s(\d+)/gm).exec(post.content);
        },
        getTableData: (post, matchResult)=> {
            return {
                name: post.name.trim(),
                content: `ダイスロール: ${matchResult[0]}`,
                dice: {
                    command: matchResult[1],
                    dice:    [Number(matchResult[2])],
                    result:  matchResult[2]
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