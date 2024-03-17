var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};
io.github.shunshun94.trpg.logEditor.convertors.RawTextConvertor = io.github.shunshun94.trpg.logEditor.convertors.RawTextConvertor ||{};

io.github.shunshun94.trpg.logEditor.convertors.RawTextConvertor.CONSTS = {
	is2024Format: /^\s\[LINE\]\s/,
	postSpliter: { old: ' ', in2024: '\t' },
	LINE_Spliter: /^\d\d\d\d\.\d\d\.\d\d\s[日月火水木金土]曜日$|^\s*\[LINE\]\s*.*トーク履歴$|^\d\d\d\d\/\d\d?\/\d\d?\([日月火水木金土]\)$|^保存日時：\d\d\d\d\/\d?\d\/\d?\d\s+\d\d?:\d?\d$/gm
};

io.github.shunshun94.trpg.logEditor.convertors.RawTextConvertor.dropEventToJson = (file) => {
	return new Promise((resolve, reject)=>{
		io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.fileToText(file).then((rawText)=>{
			const version = io.github.shunshun94.trpg.logEditor.convertors.RawTextConvertor.CONSTS.is2024Format.test(rawText) ? 'in2024' : 'old';
			resolve(io.github.shunshun94.trpg.logEditor.convertors.RawTextConvertor.lineToJson(rawText, io.github.shunshun94.trpg.logEditor.convertors.RawTextConvertor.CONSTS.postSpliter[version]));
		});
	});
};

io.github.shunshun94.trpg.logEditor.convertors.RawTextConvertor.lineToJson = (text, spliter) => {
	const posts = [];
	const lineGetRegExp = new RegExp(`^\\d?\\d:\\d?\\d${spliter}`);
	text.split(io.github.shunshun94.trpg.logEditor.convertors.RawTextConvertor.CONSTS.LINE_Spliter).map((d)=>{
		return d.trim();
	}).filter((d)=>{
		return d;
	}).map((d)=>{
		const lines = d.split('\n');
		for(const line of lines) {
			if(lineGetRegExp.test(line)) {
				const result = {tag: 'p', id:'', class:'', style:''};
				const lineParts = line.split(spliter);
				result.name = lineParts[1];
				result.content = lineParts.slice(2).join(' ');
				result.tabName = '';
				posts.push(result);
			} else {
				try {
					posts[posts.length - 1].content += `<br/>${line}`;
				} catch (e) {
					console.error(line, posts);
					throw e;
				}
				
			}
		}
	});
	return {
		doms: posts,
		omitted: [],
		head: '',
		tabs: {}
	};
};
