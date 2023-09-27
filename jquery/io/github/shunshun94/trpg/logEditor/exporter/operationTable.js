var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.export = io.github.shunshun94.trpg.logEditor.export || {};
io.github.shunshun94.trpg.logEditor.export.OperationTableExporter = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter || {};
io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS || {};
io.github.shunshun94.trpg.logEditor.export.OperationJsonExporter = io.github.shunshun94.trpg.logEditor.export.OperationJsonExporter || {};
io.github.shunshun94.trpg.logEditor.export.UniCoeExporter = io.github.shunshun94.trpg.logEditor.export.UniCoeExporter || {};
io.github.shunshun94.trpg.logEditor.export.YukkuriMovieMakerExporter = io.github.shunshun94.trpg.logEditor.export.YukkuriMovieMakerExporter|| {};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.getSessionElement = (post, handlers) => {
    const filteredElement = handlers.map((element)=>{
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

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.domsToPlainJson = (doms) => {
    return doms.filter((dom)=>{
        return $(dom).find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.INPUTS}-tag`).val().trim() === 'p';
    }).map((dom)=>{
        const d = $(dom);
        return {
            name:    d.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.NAME}`   ).html().trim(),
            content: d.find(`.${io.github.shunshun94.trpg.logEditor.CLASSES.CONTENT}`).text().trim().replaceAll('\t', '')
        };
    });
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.jQueryDomsToPlainJson = (doms) => {
    return io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.domsToPlainJson(Array.from(doms.children()));
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.getHandlers = (opt_system) => {
    const getHandlerFromName = (name) => {
        if(name) {
            return io.github.shunshun94.trpg.logEditor.export.OperationTableExporter[
                io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS.SYSTEM_MAP[name].name
            ].SESSION_ELEMENT_HANDLERS;
        } else {
            return io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.CONSTS.SESSION_ELEMENT_HANDLERS;
        }
    };
    if(opt_system) {
        return getHandlerFromName(opt_system).concat(getHandlerFromName());
    } else {
        return getHandlerFromName().concat(io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.getAllSystemMapNames().map(getHandlerFromName)).flat();
    }
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.plainJsonToOperationTableJson = (doms, opt_system) => {
    const result = [];
    const handlers = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.getHandlers(opt_system);
    doms.forEach((tmp_post)=>{
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
            const postParsed = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.getSessionElement(tmp, handlers);
            if(postParsed) {
                post = postParsed.element.getTableData(tmp, postParsed.matchResult);
            } else {
                if(tmp.content) {
                    result.push(tmp);
                }
                post = false;
            }
        }
    });
    return result;
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.fileLoaderResultToPlainJson = (flResult) => {
    const tmp = $('<div></div>');
    return flResult.doms.filter((d)=>{return d.tag === 'p'}).map((d)=>{
        tmp.html(d.content);
        return {
            name: d.name,
            content: tmp.text().trim().replaceAll('\t', '')
        };
    });
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.fileLoaderResultToJson = (flResult) => {
    return io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.plainJsonToOperationTableJson(
        io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.fileLoaderResultToPlainJson(flResult)
    );
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.domsToJson = (doms, opt_system) => {
    return io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.plainJsonToOperationTableJson(
        io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.jQueryDomsToPlainJson(doms), opt_system
    );
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.generateHeaderTr = () => {
    const tr = document.createElement('tr');
    [
        'ID',
        '名前',
        '発言内容',
        'ダイスコマンド',
        'ダイス出目',
        'ダイス結果',
        '変更されたステータス',
        '変更前のステータス',
        '変更後のステータス',
        'ステータスの増減量'
    ].map((d)=>{
        const th = document.createElement('th');
        th.textContent = d;
        tr.appendChild(th);
    });
    return tr;
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.postToTr = (post, number) => {
    const tr = document.createElement('tr');
    [
        number,
        post.name,
        post.content,
        (post.dice        ? post.dice.command              : ''),
        (post.dice        ? JSON.stringify(post.dice.dice) : ''),
        (post.dice        ? post.dice.result               : ''),
        (post.paramUpdate ? post.paramUpdate.column        : ''),
        (post.paramUpdate ? post.paramUpdate.before        : ''),
        (post.paramUpdate ? post.paramUpdate.after         : ''),
        (post.paramUpdate ? post.paramUpdate.diff          : '')
    ].map((d)=>{
        const pre = document.createElement('pre');
        pre.textContent = d;

        const td = document.createElement('td');
        td.appendChild(pre);
        tr.appendChild(td);
    });
    return tr;
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.jsonToHtml = (array) => {
    const table = document.createElement('table');
    table.border=1;
    table.appendChild(io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.generateHeaderTr());
    array.forEach((post, i)=>{
        table.appendChild(io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.postToTr(post, i));
    });
    const body = document.createElement('body');
    body.appendChild(table);

    const head = document.createElement('head');
    const utf8 = document.createElement('meta');
    utf8.charset = 'UTF-8';
    head.appendChild(utf8);

    const css  = document.createElement('link');
    css.rel  = 'stylesheet';
    css.href = 'https://shunshun94.github.io/shared/jquery/io/github/shunshun94/trpg/logEditor/resources/operationTable/operationTable.css';
    css.type = 'text/css';
    head.appendChild(css);

    const html = document.createElement('html');
    html.appendChild(head);
    html.appendChild(body);
    return html.outerHTML;
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.htmlToText = (dom) => {
    dom.content = dom.content.replaceAll(/<([^>]+)>/g,'').replaceAll(/&[a-z]+;/g, ' ');
    return dom;
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.exec = (doms, head, omit, mode, title) => {
    const json = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.domsToJson(doms);
    const html = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.jsonToHtml(json);
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.download(html, title);
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.download = (text, title) => {
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.sharedDownload(text, `table_${title}_${Number(new Date())}.html`, 'text/html;charset=utf-8;');
};

io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.sharedDownload = (text, title, type) => {
	const url = window.URL.createObjectURL(new Blob([ text ], { "type" : type }));
	const dlLink = document.createElement("a");
	document.body.appendChild(dlLink);
	dlLink.download = title;
	dlLink.href = url;
	dlLink.click();
	dlLink.remove();
	URL.revokeObjectURL(url);
};

io.github.shunshun94.trpg.logEditor.export.OperationJsonExporter.exec = (doms, head, omit, mode, title) => {
    const json = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.domsToJson(doms);
    io.github.shunshun94.trpg.logEditor.export.OperationJsonExporter.download(JSON.stringify(json), title);
};

io.github.shunshun94.trpg.logEditor.export.OperationJsonExporter.download = (text, title) => {
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.sharedDownload(text, `table_${title}_${Number(new Date())}.json`, 'text/json;charset=utf-8;');
};

io.github.shunshun94.trpg.logEditor.export.UniCoeExporter.simpleObjectToText = (d)=>{
    if(d.paramUpdate) {
        return '';
    }else if(d.dice) {
        return `${d.name}＞【ダイスロール】`;
    } else {
        return d.content.replaceAll('＞', '>').split(/[!?！？。\n]/).filter((d)=>{return d;}).map((l)=>{return `${d.name}＞${l}`}).join('\n');
    }
};

io.github.shunshun94.trpg.logEditor.export.UniCoeExporter.exec = (doms, head, omit, mode, title) => {
    const resultText = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.domsToJson(doms).map(io.github.shunshun94.trpg.logEditor.export.UniCoeExporter.simpleObjectToText).filter((d)=>{return d;}).join('\n');
    io.github.shunshun94.trpg.logEditor.export.UniCoeExporter.download(resultText, title);
};

io.github.shunshun94.trpg.logEditor.export.UniCoeExporter.download = (text, title) => {
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.sharedDownload(text, `unicoe_${title}_${Number(new Date())}.txt`, 'text/plain;charset=utf-8;');
};

io.github.shunshun94.trpg.logEditor.export.UniCoeExporter.domListToOutput = (doms) => {
    return io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.plainJsonToOperationTableJson(doms.doms).map(io.github.shunshun94.trpg.logEditor.export.UniCoeExporter.simpleObjectToText).filter((d)=>{return d;}).join('\n');
};

io.github.shunshun94.trpg.logEditor.export.YukkuriMovieMakerExporter.SimpleObjectToText = (d)=>{
    if(d.paramUpdate) {
        return '';
    }else if(d.dice) {
        return `${d.name}「【ダイスロール】」`;
    } else {
        return d.content.replaceAll('「', '\\「').replaceAll('」', '\\」').split(/[!?！？。\n]/).filter((d)=>{
            return (d) && (d !== '\\」');
        }).filter((d)=>{return d;}).map((l)=>{return `${d.name}「${l}」`}).join('\n');
    }
};

io.github.shunshun94.trpg.logEditor.export.YukkuriMovieMakerExporter.exec = (doms, head, omit, mode, title) => {
    const resultText = io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.domsToJson(doms).map(io.github.shunshun94.trpg.logEditor.export.YukkuriMovieMakerExporter.SimpleObjectToText).filter((d)=>{return d;}).join('\n');
    io.github.shunshun94.trpg.logEditor.export.YukkuriMovieMakerExporter.download(resultText, title);
};

io.github.shunshun94.trpg.logEditor.export.YukkuriMovieMakerExporter.download = (text, title) => {
    io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.sharedDownload(text, `ymm_${title}_${Number(new Date())}.txt`, 'text/plain;charset=utf-8;');
};

io.github.shunshun94.trpg.logEditor.export.YukkuriMovieMakerExporter.domListToOutput = (doms) => {
    const list = doms.doms.map(io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.htmlToText);
    return io.github.shunshun94.trpg.logEditor.export.OperationTableExporter.plainJsonToOperationTableJson(list).map(io.github.shunshun94.trpg.logEditor.export.YukkuriMovieMakerExporter.SimpleObjectToText).filter((d)=>{return d;}).join('\n');
};

(function(r){function l(a){return b(a,c,t,function(a){return u[a]})}function m(a){return b(a,f,v,function(a){return w[a]})}function b(a,b,d,e){return a&&d.test(a)?a.replace(b,e):a}function d(a){if(null==a)return"";if("string"==typeof a)return a;if(Array.isArray(a))return a.map(d)+"";var b=a+"";return"0"==b&&1/a==-(1/0)?"-0":b}var u={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},c=/[&<>"']/g,t=new RegExp(c.source),w={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"},f=/&(?:amp|lt|gt|quot|#39);/g,
v=new RegExp(f.source),e=/<(?:.|\n)*?>/mg,n=new RegExp(e.source),g=/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,p=new RegExp(g.source),h=/<br\s*\/?>/mg,q=new RegExp(h.source);r.fn.textWithLF=function(a){var c=typeof a;return"undefined"==c?m(b(b(this.html(),h,q,"\n"),e,n,"")):this.html("function"==c?function(c,f){var k=a.call(this,c,m(b(b(f,h,q,"\n"),e,n,"")));return"undefined"==typeof k?k:b(l(d(k)),g,p,"$1<br>")}:b(l(d(a)),g,p,"$1<br>"))}})(jQuery);
