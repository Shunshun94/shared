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
			zip.file('chat.xml').async("string").then((rawContent)=>{
				const dom = (new DOMParser()).parseFromString(rawContent, 'text/xml');
				const tabs = dom.getElementsByTagName('chat-tab');
				const list = [];
				for(var i = 0; i < tabs.length; i++) {
					const targetTab = tabs[i];
					const tabClass = `${(targetTab.getAttribute('name') === io.github.shunshun94.trpg.logEditor.convertors.UdonariumConvertor.MAIN) ? '' : 'tab1 '}${targetTab.getAttribute('name')}`; 
					const posts = targetTab.getElementsByTagName('chat');
					for(var j = 0; j < posts.length; j++) {
						const targetPost = posts[j];
						const rawName = targetPost.getAttribute('name');
						const tmpName = /<BCDice：(.+)>/.exec(rawName);
						list.push({
							title: '',
							style: '',
							id: '',
							class: tabClass,
							tag: 'p',
							name: tmpName ? tmpName[1] : rawName,
							content: targetPost.innerHTML,
							ts: Number(targetPost.getAttribute('timestamp'))
						});
					}
				}
				resolve({
					doms: list.sort((a,b)=>{return a.ts - b.ts}),
					omitted: [],
					head: ''
				});
			});
		});
	});
};