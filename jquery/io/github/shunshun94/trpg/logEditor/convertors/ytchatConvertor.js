var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};

io.github.shunshun94.trpg.logEditor.convertors.ytchatConvertor = io.github.shunshun94.trpg.logEditor.convertors.ytchatConvertor || {};

io.github.shunshun94.trpg.logEditor.convertors.ytchatConvertor.dropEventToJson = (file) => {
    return new Promise((resolve, reject)=>{
        file.arrayBuffer().then((result)=>{
            const codes = new Uint8Array(result);
			const rawText = Encoding.convert(codes, {
				to: 'unicode',
				from: Encoding.detect(codes),
				type: 'string'
			});
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
    const posts = rawText.split('\n').filter((d)=>{return d;}).map((line)=>{
        const splitedPost = line.split('<>');

        return {
            tag: 'p',
            name: (splitedPost[3] === '!SYSTEM') ? 'YTCHAT_SYSTEM' : splitedPost[3],
            content: io.github.shunshun94.trpg.logEditor.convertors.ytchatConvertor.toTextFromSplitedPost(splitedPost),
            class: `tab${Number(splitedPost[2])-1}`,
            title: '',
            style: splitedPost[4] ? `color:${splitedPost[4]}` : '',
            id: ''
        };
    });
	return {
		doms: posts,
		omitted: [],
		head: ''
	};
};
