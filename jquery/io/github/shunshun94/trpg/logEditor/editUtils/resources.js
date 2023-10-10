var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.resources = io.github.shunshun94.trpg.logEditor.resources || {};

io.github.shunshun94.trpg.logEditor.resources.CONSTS = io.github.shunshun94.trpg.logEditor.resources.CONSTS || {};

io.github.shunshun94.trpg.logEditor.resources.CONSTS.REGEXPS = {
    ResourceModify: [
        /<?b?r?\/?>?([^\t\n\r<>]+)\s:\s(-?\d+)\s→\s(-?\d+)<?b?r?\/?>?/gm
    ],
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
     for (var regexp of io.github.shunshun94.trpg.logEditor.resources.CONSTS.REGEXPS.ResourceModify) {
        const result = regexp.exec(content);
        if(result) {
            return { body: result[0], name: name, status: result[1], before: Number(result[2]), after: Number(result[3]) };
        }
    }

    return null;
};

io.github.shunshun94.trpg.logEditor.resources.mergeAdjacentPosts = (list) => {
    let cursor = -2;
    return list.map((post, idx, array)=>{
        if(post.resources) {
            if(idx - 1 === cursor) {
                let target = cursor;
                while(! array[target].resources) {
                    target--;
                }
                for(var name in array[idx].resources) {
                    for(var column in array[idx].resources[name]) {
                        if(! array[target].resources[name]        ) { array[target].resources[name] = {}; }
                        if(! array[target].resources[name][column]) {
                            array[target].resources[name][column] = {};
                            array[target].resources[name][column].before = array[idx].resources[name][column].before;
                        }
                        array[target].resources[name][column].after = array[idx].resources[name][column].after;
                        array[target].resources[name][column].max   = array[idx].resources[name][column].max;
                    }
                }
                array[idx].resources = false;
                array[idx].shouldRemove = true;
            }
            cursor = idx;
        }
        return array[idx];
    }).filter((post)=>{return ! (post.shouldRemove || false);});
};

io.github.shunshun94.trpg.logEditor.resources.pickResourceModificationLog = (postElement, postIndex) => {
    const result = postElement
    result.index = postIndex;
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

        result.content = result.content.replace(rd.body, '');
    }
    if(result.resources && result.content) {
        const content1 = JSON.parse(JSON.stringify(result));
        delete content1.resources;
        return [content1, { resources: result.resources, index: postIndex + 0.5 }];
    } else {
        return result;
    }
};

io.github.shunshun94.trpg.logEditor.resources.appendkMemberJoinLeaveLog = (posts, history) => {
    const memberList = {};
    history.forEach((post, idx)=>{
        for(var name in (post.resources || {})) {
            if(! memberList[name]) { memberList[name] = {resources:{}}; }
            memberList[name][memberList[name].join ? 'leave' : 'join'] = post.index;
            for(var statusName in post.resources[name]) {
                if(! memberList[name].resources[statusName]) {
                    memberList[name].resources[statusName] = {
                        before: post.resources[name][statusName].before,
                        after: post.resources[name][statusName].before,
                        max: post.resources[name][statusName].before
                    };
                }
            }
        }
    });

    const joinLeaveMap = {};
    for(var name in memberList) {
        const target = memberList[name];
        if(! joinLeaveMap[target.join]) { joinLeaveMap[target.join] = { index: target.join - 0.1, resources: {} }; }
        joinLeaveMap[target.join].resources[name] = target.resources;
        if(! joinLeaveMap[target.leave]) { joinLeaveMap[target.leave] = { index: target.leave + 0.1, resources: {} }; }
        joinLeaveMap[target.leave].resources[name] = {};
    }

    const joinLeaveList = [];
    for(var index in joinLeaveMap) {
        joinLeaveList.push(joinLeaveMap[index]);
    }
    joinLeaveList.sort((a,b)=>{return a.index - b.index;});

    return history.concat(joinLeaveList).sort((a,b)=>{return a.index - b.index;}).flat();
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
                    if(history.resources[name][column].before && history.resources[name][column].before !== tableObject[name][column].after) {
                        console.warn(index, `${name} の ${column} が更新されますが更新前の値が一致しません（元々：${tableObject[name][column].after} / 更新時：${history.resources[name][column].before}）`, tableObject);
                    }
                    tableObject[name][column].before = history.resources[name][column].before;
                    tableObject[name][column].after  = history.resources[name][column].after;
                    tableObject[name][column].max    = tableObject[name][column].max || history.resources[name][column].before;
                } catch (e) {
                    console.error(e);
                    throw {
                        error: e,
                        history: history,
                        tableObject: tableObject,
                        name: name,
                        column: column,
                        idx: idx
                    };
                }
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
                if(masterColumn.regexp.test(column)) {
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
                const columnName = column.name || column;
                const statusTd = document.createElement('td');
                if(part[columnName]) {
                    if(part[columnName].before && part[columnName].before !== part[columnName].after) {
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
        if (front && back) {
            result.partsColumns.push({ name: front[1], regexp: new RegExp(`.*` + front[1] + `.*`) });
        } else if(front) {
            result.partsColumns.push({ name: front[1], regexp: new RegExp(`.*` + front[1]), method: 'endsWith' });
        } else if(back) {
            result.partsColumns.push({ name: back[1],  regexp: new RegExp(back[1] + `.*`),  method: 'startsWith'});
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
    if(history.resources) {
        const tableObject = io.github.shunshun94.trpg.logEditor.resources.generateTableObject(history, idx, (pastTableObject.tableObject));
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
            },
            isTable: true
        };
    } else {
        return {
            tableObject: pastTableObject.tableObject,
            domSeed: history
        };
    }
};

io.github.shunshun94.trpg.logEditor.resources.convertResourceHistoryToTableHtmls = (history, tmp_columnOrder = io.github.shunshun94.trpg.logEditor.resources.CONSTS.DEFAULT_COLUMN_ORDER, filter = false) => {
    const columnOrder = io.github.shunshun94.trpg.logEditor.resources.separateColumnOrder(tmp_columnOrder);
    let lastTableObject = {tableObject: {}};
    const result = history.map((log, idx)=>{
        lastTableObject = io.github.shunshun94.trpg.logEditor.resources.convertResourceObjectToTableHtml(log, idx, lastTableObject, columnOrder);
        return lastTableObject;
    });
    if(filter) {
        return result.filter((post)=>{ return post.isTable; });
    } else {
        return result;
    }
};

io.github.shunshun94.trpg.logEditor.resources.getColumnsFromResourceInfoTables = (history) => {
    const columns = {};
    history.forEach((post)=>{
        for(var name in post.resources) {
            for(var column in post.resources[name]) {
                columns[column] = true;
            }
        }
    });
    return Object.keys(columns);
};

io.github.shunshun94.trpg.logEditor.resources.generateresourcesInfoTables = (doms) => {
    const modifiedPosts = Array.from(doms.children()).map(io.github.shunshun94.trpg.logEditor.resources.postToPostElements);
    const resourceModificationHistory = modifiedPosts.map(io.github.shunshun94.trpg.logEditor.resources.pickResourceModificationLog).flat();
    const resourceHistory = io.github.shunshun94.trpg.logEditor.resources.appendkMemberJoinLeaveLog(modifiedPosts, resourceModificationHistory);
    const result = io.github.shunshun94.trpg.logEditor.resources.mergeAdjacentPosts(resourceHistory);
    return result;
};

io.github.shunshun94.trpg.logEditor.resources.generateresourcesInfoTablesFromObject = (list) => {
    const resourceModificationHistory = list.map(io.github.shunshun94.trpg.logEditor.resources.pickResourceModificationLog).flat();
    const resourceHistory = io.github.shunshun94.trpg.logEditor.resources.appendkMemberJoinLeaveLog(list, resourceModificationHistory);
    const result = io.github.shunshun94.trpg.logEditor.resources.mergeAdjacentPosts(resourceHistory);
    return result;
};

