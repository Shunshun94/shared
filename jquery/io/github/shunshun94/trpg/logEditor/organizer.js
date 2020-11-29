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
	HANDLE: 'io-github-shunshun94-trpg-logEditor-Post-handle'
};

io.github.shunshun94.trpg.logEditor.DOMS.BODY.on(io.github.shunshun94.trpg.logEditor.EVENTS.FILE_LOADED, (e, domList)=>{
	console.log(domList);
	new io.github.shunshun94.trpg.logEditor.Editor(domList.doms);
});
Sortable.mount(new MultiDrag());