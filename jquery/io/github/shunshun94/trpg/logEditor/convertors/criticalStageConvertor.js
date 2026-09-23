var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};
io.github.shunshun94.trpg.logEditor.convertors.CriticalStageConvertor = io.github.shunshun94.trpg.logEditor.convertors.CriticalStageConvertor ||{};

io.github.shunshun94.trpg.logEditor.convertors.CriticalStageConvertor.doms = {
    '[メイン]': ' ',
	'[雑談]': ' ',
    '[情報]': ' '
};

io.github.shunshun94.trpg.logEditor.convertors.CriticalStageConvertor.dropEventToJson = (file) => {
	return new Promise((resolve, _)=>{
		io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.fileToText(file).then((rawHtml)=>{
			resolve(io.github.shunshun94.trpg.logEditor.convertors.CriticalStageConvertor.htmlToJson(rawHtml));
		});
	});
};

io.github.shunshun94.trpg.logEditor.convertors.CriticalStageConvertor.convertDomToJson = (dom, idx) => {
    try {
        if(dom.tagName !== 'ARTICLE') {
            return null;
        }
        const name = dom.children[0].textContent.trim();
        const tabName = dom.getElementsByClassName('chat-channel')[0]?.textContent.trim() || '[メイン]';
        if(! io.github.shunshun94.trpg.logEditor.convertors.CriticalStageConvertor.doms[tabName]) {
            io.github.shunshun94.trpg.logEditor.convertors.CriticalStageConvertor.doms[tabName] = ' ';
        }
        const content = (dom.getElementsByClassName('chat-character-value-result')[0] || dom.getElementsByClassName('chat-text')[0]).innerHTML.trim().split('\n').join('<br/>');
        const styleRegExp = /chat-name-light:(#[a-z0-9]{6})/.exec(dom.getElementsByClassName('chat-name-plain chat-export-name')[0]?.getAttribute('style') || '');
        const style = styleRegExp ? `color: ${styleRegExp[1]};` : '';
        return {
            tag: 'p',
            title: '',
            style: style,
            id: '',
            class: '',
            tabName: tabName,
            name: name,
            content: content
        };
    } catch (e) {
        console.error('Error converting dom to json:', e, dom, idx);
        throw e;
    } 

};

io.github.shunshun94.trpg.logEditor.convertors.CriticalStageConvertor.htmlToJson = (rawHtml) => {
    const dom = (new DOMParser()).parseFromString(rawHtml, 'text/html');
    const omits = [];
	const doms = Array.from(dom.body.getElementsByTagName('article')).map((elem, idx) => {
        const result = io.github.shunshun94.trpg.logEditor.convertors.CriticalStageConvertor.convertDomToJson(elem, idx);
        if(result) {
            return result;
        } else {
            return null;
        }
    }).filter((d)=>{return d;});
    return {
		doms: doms,
		omitted: omits,
		head: '',
		tabs: io.github.shunshun94.trpg.logEditor.convertors.CriticalStageConvertor.doms
	};
};
