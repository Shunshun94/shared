var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.OperationTableExporter = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter || {};
io.github.shunshun94.trpg.logEditor.export.OperationJsonExporter = io.github.shunshun94.trpg.logEditor.export.OperationJsonExporter || {};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS || {};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS.SESSION_ELEMENT_HANDLERS = [
    {
        name: 'commonResourceManage',
        getMatchResult: (post)=>{
            return (/\[\s(.+)\s\]\s(.+)\s:\s(\d+)\s→\s(\d+)/gm).exec(post.content);
        },
        getTableData: (post, matchResult)=> {

        }
    }, {
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
    }
];

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.getSessionElement = (post) => {
    const filteredElement = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS.SESSION_ELEMENT_HANDLERS.map((element)=>{
        return {
            matchResult: element.getMatchResult(post),
            element: element
        };
    }).filter((d)=>{return d.matchResult;}).sort((a,b)=>{return a.matchResult.index - b.matchResult.index;});
    if(filteredElement.length) {
        return filteredElement[0];
    } else {
        return false;
    }
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.domToJson = (doms) => {
    const result = [];
    Array.from(doms.children()).filter((dom)=>{
        return $(dom).find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-tag`).val().trim() === 'p';
    }).map((dom)=>{
        const d = $(dom);
        return {
            name:    d.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`   ).html().trim(),
            content: d.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.CONTENT}`).textWithLF().trim()
        };
    }).forEach((tmp_post)=>{
        let post = {after: tmp_post};
        let tmp  = false;
        while(post) {
            if(post.before && post.before.content) {
                result.push(post.before);
            }
            tmp  = JSON.parse(JSON.stringify(post.after));
            if(post.name) {
                delete post.after;
                delete post.before;
                result.push(post);
            }
            const postParsed = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.getSessionElement(tmp);
            if(postParsed) {
                post = postParsed.element.getTableData(tmp, postParsed.matchResult);
            } else {
                if(tmp.content) {
                    result.push(tmp);
                }
                post = false;
            }
        }
         // A発言者、B発言内容、Cダイスロール元式、Dダイスロール出目、Eダイスロール結果、F変更対象パラメータ、Gパラメータ変更元、Hパラメータ変更後、Iパラメータの変更差値
    });

    return result;
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.exec = (doms, head, omit, mode) => {
    const json = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.domToJson(doms);
    const html = '';
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.download(html, `saved_${Number(new Date())}.html`, 'text/html;charset=utf-8;');
};



io.github.shunshun94.trpg.logEditor.export.OperationJsonExporter.exec = (doms, head, omit, mode) => {
    const json = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.domToJson(doms);
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.download(JSON.stringify(json), `saved_${Number(new Date())}.json`, 'text/json;charset=utf-8;');
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.download = (text, title, type) => {
	const url = window.URL.createObjectURL(new Blob([ text ], { "type" : type }));
	const dlLink = document.createElement("a");
	document.body.appendChild(dlLink);
	dlLink.download = title;
	dlLink.href = url;
	dlLink.click();
	dlLink.remove();
	URL.revokeObjectURL(url);
};

(function(r){function l(a){return b(a,c,t,function(a){return u[a]})}function m(a){return b(a,f,v,function(a){return w[a]})}function b(a,b,d,e){return a&&d.test(a)?a.replace(b,e):a}function d(a){if(null==a)return"";if("string"==typeof a)return a;if(Array.isArray(a))return a.map(d)+"";var b=a+"";return"0"==b&&1/a==-(1/0)?"-0":b}var u={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},c=/[&<>"']/g,t=new RegExp(c.source),w={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"},f=/&(?:amp|lt|gt|quot|#39);/g,
v=new RegExp(f.source),e=/<(?:.|\n)*?>/mg,n=new RegExp(e.source),g=/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,p=new RegExp(g.source),h=/<br\s*\/?>/mg,q=new RegExp(h.source);r.fn.textWithLF=function(a){var c=typeof a;return"undefined"==c?m(b(b(this.html(),h,q,"\n"),e,n,"")):this.html("function"==c?function(c,f){var k=a.call(this,c,m(b(b(f,h,q,"\n"),e,n,"")));return"undefined"==typeof k?k:b(l(d(k)),g,p,"$1<br>")}:b(l(d(a)),g,p,"$1<br>"))}})(jQuery);
