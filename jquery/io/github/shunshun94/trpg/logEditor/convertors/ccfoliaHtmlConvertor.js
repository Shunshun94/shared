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
	return new Promise((resolve, reject)=>{
		io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.fileToText(file).then((rawHtml)=>{
			resolve(io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.htmlToJson(rawHtml));
		});
	});
};

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.convertDomToJson = (dom, idx) => {
    try {
        const isSystemMessage = dom.classList.value.includes('system');
        if(isSystemMessage) {
            const message = dom.children[1].textContent.trim();
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
            const tabName = msgHeader.children[2].textContent.trim();
            if(! io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.doms[tabName]) {
                io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.doms[tabName] = `tab${Object.keys(io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.doms).length}`;
            }
            const avatarClassRegExpResult = /avatar-image-\d+/.exec(dom.children[0].classList.value);
            const avatarClass = avatarClassRegExpResult ? avatarClassRegExpResult[0] : '';
            console.log(dom.children[0].classList.value, avatarClassRegExpResult, avatarClass);
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
                class: avatarClass + ' ' + io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.doms[tabName],
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
	const doms = Array.from(dom.body.children[0].children).slice(1, -1).map(io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.convertDomToJson)
    console.log(doms);
    return {
		doms: doms,
		omitted: '',
		head: '',
		tabs: io.github.shunshun94.trpg.logEditor.convertors.CcfoliaHtmlConvertor.doms
	};
};
