var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};
io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor = io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor ||{};

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.doms = {
    '[メイン]': ' ',
	'[雑談]': 'tab1 ',
    '[情報]': 'tab2 '
};

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.dropEventToJson = (file) => {
	return new Promise((resolve, _)=>{
		io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.fileToText(file).then((rawHtml)=>{
			resolve(io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.htmlToJson(rawHtml));
		});
	});
};

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.convertDomToJson = (dom, idx) => {
    try {
        if(dom.tagName !== 'ARTICLE') {
            return null;
        }
        const isSystemMessage = dom.classList.value.includes('system');
        if(isSystemMessage) {
            const message = (dom.children[1] || dom.children[0]).textContent.trim();
			const nameExecResult = /^\[\s+(.+)\s+\]\s*/.exec(message);
			if(nameExecResult) {
                return {
                    tag: 'p',
                    title: '',
                    style: '',
                    id: '',
                    class: '',
                    tabName: '[メイン]',
                    name: nameExecResult[1],    
					content: message.replace(nameExecResult[0], '').trim()
                };
			}
        } else {
            const msgHeader = dom.children[1].children[0];
            const tempTabName = msgHeader.children[2]?.textContent.trim();
            const tabName = (tempTabName === '[編集済]') ? '[メイン]' : tempTabName || '[メイン]';
            if(! io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.doms[tabName]) {
                io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.doms[tabName] = `tab${Object.keys(io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.doms).length}`;
            }
            const avatarClassRegExpResult = /avatar-image-\d+/.exec(dom.children[0].classList.value);
            const avatarClass = avatarClassRegExpResult ? avatarClassRegExpResult[0] : '';
            const name = msgHeader.children[0].textContent.trim();
            const hasDiceResult = dom.children[1].children.length >= 3;
            const baseContent = dom.children[1].children[1].textContent.trim().split('\n').join('<br/>');
            const content = hasDiceResult ?
                baseContent + '<br/>' + dom.children[1].children[2].textContent.trim() : baseContent;
            return {
                tag: 'p',
                title: '',
                style: '',
                id: '',
                class: avatarClass,
                tabName: tabName,
                name: name,
                content: content
            };
        }

    } catch (e) {
        console.error('Error converting dom to json:', e, dom, idx);
        throw e;
    } 

};

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.htmlToJson = (rawHtml) => {
    const dom = (new DOMParser()).parseFromString(rawHtml, 'text/html');
    const omits = [];
	const doms = Array.from(dom.body.children[0].children).slice(1, -1).map((elem, idx) => {
        const result = io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.convertDomToJson(elem, idx);
        if(result) {
            return result;
        } else {
            omits.push(elem.outerHTML);
            return null;
        }
    }).filter((d)=>{return d;});
    console.log(doms);
    return {
		doms: doms,
		omitted: omits,
		head: '', // もしかしたら画像付き出力に寄せたほうがいいかも
		tabs: io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.doms
	};
};
