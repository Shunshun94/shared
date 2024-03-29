var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};
io.github.shunshun94.trpg.logEditor.convertors.UdonariumConvertor = io.github.shunshun94.trpg.logEditor.convertors.UdonariumConvertor ||{};

io.github.shunshun94.trpg.logEditor.convertors.UdonariumConvertor.MAIN = 'メインタブ';

io.github.shunshun94.trpg.logEditor.convertors.UdonariumConvertor.dropEventToJson = (file) => {
	var jszip = new JSZip();
	return new Promise((resolve, reject)=>{
		jszip.loadAsync(file).then((zip)=>{
			const tabsName = {};
			let tabCounts = 0;
			zip.file('chat.xml').async("string").then((rawContent)=>{
				const dom = (new DOMParser()).parseFromString(rawContent, 'text/xml');
				const parseError = dom.getElementsByTagName('parsererror');
				if(parseError.length) {
					const message = parseError[0].getElementsByTagName('div')[0].innerHTML;
					alert(`ログにエラーが含まれるため上手く解析できません。解析できる限界までログを取得します。\nログに含まれるエラーメッセージ：${message}`);
				}
				const tabs = dom.getElementsByTagName('chat-tab');
				const list = [];
				for(var i = 0; i < tabs.length; i++) {
					const targetTab = tabs[i];
					const tabName = targetTab.getAttribute('name');
					if(! tabsName[tabName]) {
						tabsName[tabName] = `tab${tabCounts}`;
						tabCounts++;
					}
					const tabClass = `${tabsName[tabName]} ${targetTab.getAttribute('name')}`; 
					const posts = targetTab.getElementsByTagName('chat');
					for(var j = 0; j < posts.length; j++) {
						const targetPost = posts[j];
						const rawName = targetPost.getAttribute('name');
						const color = targetPost.getAttribute('messColor');
						const tmpName = /<BCDice：(.+)>/.exec(rawName);
						list.push({
							title: '',
							style: color ? `color:${color};` : '',
							id: '',
							class: tabClass,
							tag: 'p',
							name: tmpName ? tmpName[1] : rawName,
							content: targetPost.innerHTML.replace(/\n/gm, '<br/>'),
							ts: Number(targetPost.getAttribute('timestamp')),
							tabName: tabName
						});
					}
				}
				resolve({
					doms: io.github.shunshun94.trpg.logEditor.convertors.UdonariumConvertor.modifyResrouceToOriginalFormat(
						list.sort((a,b)=>{return a.ts - b.ts})
					),
					omitted: [],
					head: '',
					tabs: tabsName
				});
			});
		});
	});
};

io.github.shunshun94.trpg.logEditor.convertors.UdonariumConvertor.modifyResrouceToOriginalFormat = (posts) => {
	const regexp = /([^:]*):(\d+)[\+\-=](\d+)＞(\d+)/;
	return posts.map((post)=>{
		const content = post.content || '';
		const regexpResult = regexp.exec(content);
		if(regexpResult) {
			post.content = `${regexpResult[1]} : ${regexpResult[2]} → ${regexpResult[4]}`;
		}
		return post;
	});
};


