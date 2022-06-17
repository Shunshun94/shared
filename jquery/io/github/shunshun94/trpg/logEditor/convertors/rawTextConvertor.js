var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};
io.github.shunshun94.trpg.logEditor.convertors.RawTextConvertor = io.github.shunshun94.trpg.logEditor.convertors.RawTextConvertor ||{};

io.github.shunshun94.trpg.logEditor.convertors.RawTextConvertor.dropEventToJson = (file) => {
	return new Promise((resolve, reject)=>{
		io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.fileToText(file).then((rawText)=>{
			resolve(io.github.shunshun94.trpg.logEditor.convertors.RawTextConvertor.lineToJson(rawText, file.title));
		});
	});
};

io.github.shunshun94.trpg.logEditor.convertors.RawTextConvertor.lineToJson = (text, title) => {
	const posts = [];
	text.split(/^\d\d\d\d\.\d\d\.\d\d\s[日月火水木金土]曜日/gm).filter((d)=>{
		return d;
	}).map((d)=>{
		return d.trim();
	}).map((d)=>{
		const lines = d.split('\n');
		for(const line of lines) {
			if(/^\d\d:\d\d/.test(line)) {
				const result = {tag: 'p', id:'', class:'', style:''};
				const lineParts = line.split(' ');
				result.name = lineParts[1];
				result.content = lineParts.slice(2).join(' ');
				posts.push(result);
			} else {
				posts[posts.length - 1].content += `<br/>${line}`;
			}
		}
	});
	return {
		title: title.split('.')[0],
		doms: posts,
		omitted: [],
		head: ''
	};
};
