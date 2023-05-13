var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.resources = io.github.shunshun94.trpg.logEditor.resources || {};

io.github.shunshun94.trpg.logEditor.resources.CONSTS = io.github.shunshun94.trpg.logEditor.resources.CONSTS || {};

io.github.shunshun94.trpg.logEditor.resources.CONSTS.REGEXPS = {
    ResourceModify: (io.github.shunshun94.trpg.logEditor.export.OperationTableExporter) ? io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS.REGEXP.ResrouceManage : /\[\s(.+)\s\]\s(.+)\s:\s(\d+)\s→\s(\d+)/gm,
    EditedResourceModify: (io.github.shunshun94.trpg.logEditor.export.OperationTableExporter) ? io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS.REGEXP.EditedResourceManage : /([^\t\n\r]+)\s:\s(\d+)\s→\s(\d+)/gm
};

io.github.shunshun94.trpg.logEditor.resources.getNameList = (doms) => {
    return (new Set($.makeArray(doms.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).map((i,v)=>{return $(v).text()})))).filter((n)=>{return n;});
};

io.github.shunshun94.trpg.logEditor.resources.postToPostElements = (tmp_dom) => {
    const dom = $(tmp_dom);
    return {
        name: dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`).text(),
        content: dom.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.CONTENT}`).text()
    };
};

io.github.shunshun94.trpg.logEditor.resources.getFirstResourceModificationLogFrom = (content, name) => {
    const regexpA = io.github.shunshun94.trpg.logEditor.resources.CONSTS.REGEXPS.ResourceModify.exec(content);
    if(regexpA) {
        return { body: regexpA[0], name: regexpA[1], status: regexpA[2], before: regexpA[3], after: regexpA[4] };
    }

    const regexpB = io.github.shunshun94.trpg.logEditor.resources.CONSTS.REGEXPS.EditedResourceModify.exec(content);
    if(regexpB) {
        return { body: regexpB[0], name: name, status: regexpB[1], before: regexpB[2], after: regexpB[3]};
    }

    return null;
};

io.github.shunshun94.trpg.logEditor.resources.pickResourceModificationLog = (postElement, postIndex) => {
    const result = {index: postIndex};
    let rd;
    while(rd = io.github.shunshun94.trpg.logEditor.resources.getFirstResourceModificationLogFrom(postElement.content, postElement.name)) {
        if(! result.resources) { result.resources = {}; }
        if(! result.resources[rd.name]) { result.resources[rd.name] = {}; }
        result.resources[rd.name][rd.status] = {before: rd.before, after:  rd.after};
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
                if(! memberList[name].resources[statusName]) { memberList[name].resources[statusName] = {before: post.resources[name][statusName].before}; }
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
        if(! joinLeaveMap[target.join]) { joinLeaveMap[target.join] = { index: target.join, resources: {} }; }
        joinLeaveMap[target.join].resources[name] = target.resources;
        if(! joinLeaveMap[target.leave]) { joinLeaveMap[target.leave] = { index: target.leave, resources: {} }; }
        joinLeaveMap[target.leave].resources[name] = {};
    }
    const joinLeaveList = [];
    for(var index in joinLeaveMap) {
        joinLeaveList.push(joinLeaveMap[index]);
    }

    return history.concat(joinLeaveList).sort((a,b)=>{return a.index - b.index;});
};

io.github.shunshun94.trpg.logEditor.resources.generateResroucesInfoTables = (doms) => {
    const modifiedPosts = Array.from(doms.children()).map(io.github.shunshun94.trpg.logEditor.resources.postToPostElements);
    const resourceModificationHistory = modifiedPosts.map(io.github.shunshun94.trpg.logEditor.resources.pickResourceModificationLog).filter((element)=>{return element.resources});
    const resourceHistory = io.github.shunshun94.trpg.logEditor.resources.appendkMemberJoinLeaveLog(modifiedPosts, resourceModificationHistory);
    return resourceHistory;
};

