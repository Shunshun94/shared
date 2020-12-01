var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.DOMS = {
	BODY: $('body')
};
io.github.shunshun94.trpg.logEditor.EVENTS = {
	FILE_LOADED: 'io-github-shunshun94-trpg-logEditor-file-loaded'
};
io.github.shunshun94.trpg.logEditor.CLASSES = {
	HANDLE: 'io-github-shunshun94-trpg-logEditor-Post-handle',
	MERGE: 'io-github-shunshun94-trpg-logEditor-Post-merge',
	DELETE: 'io-github-shunshun94-trpg-logEditor-Post-delete',
	CAND_TAGS: 'io-github-shunshun94-trpg-logEditor-candidates-tags',
	CAND_CLASSES: 'io-github-shunshun94-trpg-logEditor-candidates-tags',
};

io.github.shunshun94.trpg.logEditor.DOMS.BODY.on(io.github.shunshun94.trpg.logEditor.EVENTS.FILE_LOADED, (e, domList)=>{
	console.log(domList);
	new io.github.shunshun94.trpg.logEditor.Editor(domList.doms);
});
