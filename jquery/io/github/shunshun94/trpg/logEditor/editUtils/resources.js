var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.resources = io.github.shunshun94.trpg.logEditor.resources || {};

io.github.shunshun94.trpg.logEditor.resources.CONSTS = io.github.shunshun94.trpg.logEditor.resources.CONSTS || {};

io.github.shunshun94.trpg.logEditor.resources.CONSTS.REGEXPS = {
    ResourceModify: (io.github.shunshun94.trpg.logEditor.export.OperationTableExporter) ? io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS.REGEXP.ResourceManage : /\[\s(.+)\s\]\s(.+)\s:\s(-?\d+)\s→\s(-?\d+)/gm,
    EditedResourceModify: (io.github.shunshun94.trpg.logEditor.export.OperationTableExporter) ? io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS.REGEXP.EditedResourceManage : /([^\t\n\r]+)\s:\s(-?\d+)\s→\s(-?\d+)/gm,
    ResourceWithPartsName: {
        back: /([^\*]+)\*$/,
        front: /^\*([^\*]+)/
    }
};

io.github.shunshun94.trpg.logEditor.resources.CONSTS.DEFAULT_COLUMN_ORDER = ['*HP','*MP'];

io.github.shunshun94.trpg.logEditor.resources.getNameList = (doms) => {
    return (new Set($.makeArray(doms.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).map((i,v)=>{return $(v).text()})))).filter((n)=>{return n;});
};

io.github.shunshun94.trpg.logEditor.resources.postToPostElements = (tmp_dom) => {
    const dom = $(tmp_dom);
    return {
        name: dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).text(),
        content: dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.CONTENT}`).html().replace(/<br\/?>/gm, '\n')
    };
};

io.github.shunshun94.trpg.logEditor.resources.getFirstResourceModificationLogFrom = (content, name) => {
    const regexpA = io.github.shunshun94.trpg.logEditor.resources.CONSTS.REGEXPS.ResourceModify.exec(content);
    if(regexpA) {
        return { body: regexpA[0], name: regexpA[1], status: regexpA[2], before: Number(regexpA[3]), after: Number(regexpA[4]) };
    }

    const regexpB = io.github.shunshun94.trpg.logEditor.resources.CONSTS.REGEXPS.EditedResourceModify.exec(content);
    if(regexpB) {
        return { body: regexpB[0], name: name, status: regexpB[1], before: Number(regexpB[2]), after: Number(regexpB[3])};
    }

    return null;
};

io.github.shunshun94.trpg.logEditor.resources.pickResourceModificationLog = (postElement, postIndex) => {
    const result = {index: postIndex};
    let rd;
    while(rd = io.github.shunshun94.trpg.logEditor.resources.getFirstResourceModificationLogFrom(postElement.content, postElement.name)) {
        if(! result.resources) { result.resources = {}; }
        if(! result.resources[rd.name]) { result.resources[rd.name] = {}; }

        if(! result.resources[rd.name][rd.status]) {
            result.resources[rd.name][rd.status] = {before: rd.before, after:  rd.after};
        } else {
            // 1度の発言で2回更新されている場合はマージしてしまう
            result.resources[rd.name][rd.status].after = rd.after;
        }

        postElement.content = postElement.content.replace(rd.body, '');
    }
    return result;
};

io.github.shunshun94.trpg.logEditor.resources.appendkMemberJoinLeaveLog = (posts, history) => {
    const memberList = {};
    history.forEach((post, i)=>{
        for(var name in post.resources) {
            if(! memberList[name]) { memberList[name] = {resources:{}}; }
            for(var statusName in post.resources[name]) {
                if(! memberList[name].resources[statusName]) { memberList[name].resources[statusName] = {after: post.resources[name][statusName].before, max: post.resources[name][statusName].before}; }
            }
        }
    });

    posts.forEach((post, idx)=>{
        if(memberList[post.name]) {
            memberList[post.name][memberList[post.name].join ? 'leave' : 'join'] = idx;
        }
    });

    const joinLeaveMap = {};
    for(var name in memberList) {
        const target = memberList[name];
        if(! joinLeaveMap[target.join]) { joinLeaveMap[target.join] = { index: target.join - 1, resources: {} }; }
        joinLeaveMap[target.join].resources[name] = target.resources;
        if(! joinLeaveMap[target.leave]) { joinLeaveMap[target.leave] = { index: target.leave + 1, resources: {} }; }
        joinLeaveMap[target.leave].resources[name] = {};
    }
    const joinLeaveList = [];
    for(var index in joinLeaveMap) {
        joinLeaveList.push(joinLeaveMap[index]);
    }

    return history.concat(joinLeaveList).sort((a,b)=>{return a.index - b.index;});
};

io.github.shunshun94.trpg.logEditor.resources.removeBeforeFromEachColumns = (tableObject) => {
    const nameList = Object.keys(tableObject);
    nameList.forEach((name)=>{
        const columnList = Object.keys(tableObject[name]);
        columnList.forEach((column)=>{
            delete tableObject[name][column].before;
        });
    });
    return tableObject;
};

io.github.shunshun94.trpg.logEditor.resources.generateTableObject = (history, idx, pastTableObject = {}) => {
    const tableObject = io.github.shunshun94.trpg.logEditor.resources.removeBeforeFromEachColumns(JSON.parse(JSON.stringify(pastTableObject)));
    const index = history.id || history.index || idx;
    for(var name in history.resources) {
        if(! tableObject[name]) {
            tableObject[name] = JSON.parse(JSON.stringify(history.resources[name]));
        }
        const updatedColumnList = Object.keys(history.resources[name]);
        if(updatedColumnList.length) {
            updatedColumnList.forEach((column)=>{
                try {
                    if(history.resources[name][column].before !== tableObject[name][column].after) {
                        console.warn(index, `${name} の ${column} が更新されますが更新前の値が一致しません（元々：${tableObject[name][column].after} / 更新時：${history.resources[name][column].before}）`);
                    }
                } catch (e) {
                    console.error(e, name, column, history, idx, tableObject);
                }

                tableObject[name][column].before = history.resources[name][column].before;
                tableObject[name][column].after  = history.resources[name][column].after;
            });
        } else {
            delete tableObject[name];
        }
    }
    return tableObject;
};

io.github.shunshun94.trpg.logEditor.resources.convertRawTableToTableWithParts = (tableObject, columnOrder) => {
    const result = {};
    Object.keys(tableObject).forEach((name)=>{
        const characterResult = {};
        Object.keys(tableObject[name]).forEach((column)=>{
            columnOrder.partsColumns.forEach((masterColumn)=>{
                if(column[masterColumn.method](masterColumn.name)) {
                    const partsName = column.replace(masterColumn.name, '');
                    if(partsName) { // 羽HP とか HP羽 とかだった場合
                        if(! characterResult[partsName]) { characterResult[partsName] = {}; }
                        characterResult[partsName][masterColumn.name] = tableObject[name][column];
                    } else { // HP とかだった場合
                        if(! characterResult.singleParts) { characterResult.singleParts = {}; }
                        characterResult.singleParts[column] = tableObject[name][column];
                    }
                }
            });
        });
        columnOrder.sharedColumns.forEach((column)=>{
            if(! characterResult.shared) { characterResult.shared = {}; }
            characterResult.shared[column] = tableObject[name][column];
        });
        result[name] = characterResult;
    });
    return result;
};

io.github.shunshun94.trpg.logEditor.resources.convertTableObjectToTableHtmlV2 = (rawTableObject, columnOrder) => {
    const tableObject = io.github.shunshun94.trpg.logEditor.resources.convertRawTableToTableWithParts(rawTableObject, columnOrder);
    const result = document.createElement('table');
    result.setAttribute('border', 1);
    result.className = 'resource-table';
    Object.keys(tableObject).forEach((name)=>{
        const character = tableObject[name];
        const parts  = Object.keys(character);
        parts.forEach((partsName, partsIndex)=>{
            const part = character[partsName];
            const tr = document.createElement('tr');
            if(partsIndex === 0) {
                const nameTh = document.createElement('th');
                nameTh.textContent = name;
                nameTh.setAttribute('rowspan', parts.length);
                tr.append(nameTh);
            }

            const currentColumns = (partsName === 'shared') ? columnOrder.sharedColumns : columnOrder.partsColumns;
            const firstColumnIsJoined = ['singleParts', 'shared'].includes(partsName) || parts.length === columnOrder.defaultHeight;

            if(! firstColumnIsJoined) {
                const partsNameTh = document.createElement('th');
                partsNameTh.textContent = partsName;
                tr.append(partsNameTh);
            }

            currentColumns.forEach((column, columnIndex)=>{
                const columnName = column.name;
                const statusTd = document.createElement('td');
                if(part[columnName]) {
                    if(part[columnName].before) {
                        statusTd.innerHTML = `<span class="resource-table-columnName">${columnName}</span><span class="resource-table-value resource-table-value-before">${part[columnName].before}</span><span class="resource-table-value resource-table-value-after">${part[columnName].after}</span><span class="resource-table-value resource-table-value-max">${part[columnName].max}</span>`;
                        statusTd.className = 'resource-table-updated';
                    } else {
                        statusTd.innerHTML = `<span class="resource-table-columnName">${columnName}</span><span class="resource-table-value resource-table-value-after">${part[columnName].after}</span><span class="resource-table-value resource-table-value-max">${part[columnName].max}</span>`;
                    }
                } else {
                    statusTd.className = 'resource-table-no_info';
                } 
                if(firstColumnIsJoined) {
                    statusTd.setAttribute('colspan', 2);
                }
                tr.append(statusTd);
            });
            result.append(tr);
        });
    });

    return {
        content: result
    };
};

io.github.shunshun94.trpg.logEditor.resources.convertTableObjectToTableHtmlV1 = (tableObject, columnOrder) => {
    const result = document.createElement('table');
    result.setAttribute('border', 1);
    result.className = 'resource-table';
    Object.keys(tableObject).forEach((name)=>{
        const characterTr = document.createElement('tr');
        const characterNameTh = document.createElement('th');
        characterNameTh.textContent = name;
        characterTr.append(characterNameTh);

        const character = tableObject[name];
        columnOrder.forEach((column)=>{
            const statusTd = document.createElement('td');
            if(character[column]) {
                if(character[column].before) {
                    statusTd.innerHTML = `<span class="resource-table-columnName">${column}</span><span class="resource-table-value resource-table-value-before">${character[column].before}</span><span class="resource-table-value resource-table-value-after">${character[column].after}</span><span class="resource-table-value resource-table-value-max">${character[column].max}</span>`;
                    statusTd.className = 'resource-table-updated';
                } else {
                    statusTd.innerHTML = `<span class="resource-table-columnName">${column}</span><span class="resource-table-value resource-table-value-after">${character[column].after}</span><span class="resource-table-value resource-table-value-max">${character[column].max}</span>`;
                }
            } else {
                statusTd.className = 'resource-table-no_info';
            }
            characterTr.append(statusTd);
        });

        result.append(characterTr);
    });
    return {
        content: result
    };
};

io.github.shunshun94.trpg.logEditor.resources.separateColumnOrder = (rawColumnOrder) => {
    const result = {
        sharedColumns: [],
        partsColumns: []
    };
    const regexps = io.github.shunshun94.trpg.logEditor.resources.CONSTS.REGEXPS.ResourceWithPartsName;
    rawColumnOrder.forEach((rawColumn)=>{
        const front = regexps.front.exec(rawColumn);
        const back  = regexps.back.exec(rawColumn);
        if(front) {
            result.partsColumns.push({ name: front[1], method: 'endsWith' });
        } else if(back) {
            result.partsColumns.push({ name: back[1], method: 'startsWith'});
        } else {
            result.sharedColumns.push(rawColumn);
        }
    });
    result.defaultHeight = result.sharedColumns.length ? 2 : 1;
    if( result.sharedColumns.length > result.partsColumns ) {
        result.partsColumnsEmpty  = result.sharedColumns.length - result.partsColumns.length;
        result.sharedColumnsEmpty = 0;
    } else {
        result.partsColumnsEmpty  = 0;
        result.sharedColumnsEmpty = result.partsColumns.length - result.sharedColumns.length;
    }
    return result;
};

io.github.shunshun94.trpg.logEditor.resources.convertResourceObjectToTableHtml = (history, idx, pastTableObject = {}, columnOrder) => {
    const tableObject = io.github.shunshun94.trpg.logEditor.resources.generateTableObject(history, idx, (pastTableObject.tableObject || {}));
    let htmlObject;
    if( columnOrder.sharedColumns && columnOrder.partsColumns ) {
        htmlObject = io.github.shunshun94.trpg.logEditor.resources.convertTableObjectToTableHtmlV2(tableObject, columnOrder);
    } else {
        htmlObject = io.github.shunshun94.trpg.logEditor.resources.convertTableObjectToTableHtmlV1(tableObject, columnOrder);
    }

    return {
        tableObject: tableObject,
        domSeed: {
            tag: 'div',
            name: '',
            content: htmlObject.content.outerHTML,
            id: '',
            class: '',
            style: ''
        }
    };
};

io.github.shunshun94.trpg.logEditor.resources.convertResourceHistoryToTableHtmls = (history, tmp_columnOrder = io.github.shunshun94.trpg.logEditor.resources.CONSTS.DEFAULT_COLUMN_ORDER) => {
    const columnOrder = io.github.shunshun94.trpg.logEditor.resources.separateColumnOrder(tmp_columnOrder);
    console.log(columnOrder);
    let lastTableObject = {tableObject: {}};
    return history.map((log, idx)=>{
        lastTableObject = io.github.shunshun94.trpg.logEditor.resources.convertResourceObjectToTableHtml(log, idx, lastTableObject, columnOrder);
        return lastTableObject;
    });
};

io.github.shunshun94.trpg.logEditor.resources.generateresourcesInfoTables = (doms) => {
    const modifiedPosts = Array.from(doms.children()).map(io.github.shunshun94.trpg.logEditor.resources.postToPostElements);
    const resourceModificationHistory = modifiedPosts.map(io.github.shunshun94.trpg.logEditor.resources.pickResourceModificationLog).filter((element)=>{return element.resources});
    const resourceHistory = io.github.shunshun94.trpg.logEditor.resources.appendkMemberJoinLeaveLog(modifiedPosts, resourceModificationHistory);
    return resourceHistory;
};
