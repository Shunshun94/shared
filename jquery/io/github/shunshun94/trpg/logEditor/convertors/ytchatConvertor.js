var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};

io.github.shunshun94.trpg.logEditor.convertors.ytchatConvertor = io.github.shunshun94.trpg.logEditor.convertors.ytchatConvertor || {};

io.github.shunshun94.trpg.logEditor.convertors.ytchatConvertor.dropEventToJson = (file) => {
    return new Promise((resolve, reject)=>{
        io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.fileToText(file).then((rawText)=>{
            resolve(io.github.shunshun94.trpg.logEditor.convertors.ytchatConvertor.rawTextToJson(rawText));
        });
    });
};

io.github.shunshun94.trpg.logEditor.convertors.ytchatConvertor.toTextFromSplitedPost = (splitedPost) => {    
    if(splitedPost[6]) {
        if(splitedPost[7].startsWith('bg:') || splitedPost[7].startsWith('bgm:')) {
            return [splitedPost[7], splitedPost[5], splitedPost[6]].filter((d)=>{return d;}).join('<br/>');
        } else {
            const splitedDiceResult = splitedPost[6].split('<<');
            return [splitedPost[5], splitedDiceResult[1], splitedDiceResult[0]].filter((d)=>{return d;}).join('<br/>');
        }
    } else {
        return splitedPost[5] || '';
    }
};

io.github.shunshun94.trpg.logEditor.convertors.ytchatConvertor.rawTextToJson = (rawText) => {
    const tabs = {};
    const posts = rawText.split('\n').filter((d)=>{return d;}).map((line)=>{
        const splitedPost = line.split('<>');
        const tabClass = `tab${Number(splitedPost[2])-1}`;
        if(! tabs[tabClass]) { tabs[tabClass] = tabClass; }

        return {
            tag: 'p',
            name: (splitedPost[3] === '!SYSTEM') ? 'YTCHAT_SYSTEM' : splitedPost[3],
            content: io.github.shunshun94.trpg.logEditor.convertors.ytchatConvertor.toTextFromSplitedPost(splitedPost),
            class: tabClass,
            title: '',
            style: splitedPost[4] ? `color:${splitedPost[4]}` : '',
            id: '',
            tabName: tabClass
        };
    });
	return {
		doms: posts,
		omitted: [],
		head: '',
        tabs: tabs
	};
};
