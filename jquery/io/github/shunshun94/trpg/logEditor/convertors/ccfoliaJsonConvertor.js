var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};
io.github.shunshun94.trpg.logEditor.convertors.CcfoliaJsonConvertor = io.github.shunshun94.trpg.logEditor.convertors.CcfoliaJsonConvertor ||{};

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaJsonConvertor.dropEventToJson = (file) => {
	return new Promise((resolve, _)=>{
		io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.fileToText(file).then((rawJson)=>{
			resolve(io.github.shunshun94.trpg.logEditor.convertors.CcfoliaJsonConvertor.convertJson(rawJson));
		});
	});
};

io.github.shunshun94.trpg.logEditor.convertors.CcfoliaJsonConvertor.convertJson = (rawJson) => {
    const data = JSON.parse(rawJson).messages;
    const tabs = {
        'main': 'main',
        'other': 'other',
        'info': 'info'
    };
    const resourceModifyRegExp = /^\[\s+(.+)\s+\]\s*/;
    const doms = data.map((msg) => {
        const result = {
            tag: 'p',
            title: '',
            style: `color:${msg.color};`,
            id: '',
            class: '',
            tabName: msg.channelName || 'main'
        };
        if(! tabs[result.tabName]) {
            tabs[result.tabName] = msg.channelName;
        }
        const isDiceRoll = msg?.extend?.roll?.result;
        const isSystemMessage = (msg.name === 'system') && (resourceModifyRegExp.test(msg.text));
        if( isDiceRoll ) {
            result.name = msg.name;
            result.content = msg.text.split('\n').join('<br/>') + '<br/>' + msg.extend.roll.result.split('\n').join('<br/>');
        } else if (isSystemMessage) {
            const text = msg.text;
            const regExpResult = resourceModifyRegExp.exec(text);
            result.name = regExpResult[1];
            result.content = text.replace(regExpResult[0], '').trim().split('\n').join('<br/>');
        } else {
            result.name = msg.name;
            result.content = msg.text.split('\n').join('<br/>');
        }
        return result;
    });

    return {
		doms: doms,
		omitted: [],
		head: '',
		tabs: tabs
	};
};
