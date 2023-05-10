var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};

io.github.shunshun94.trpg.logEditor.hashFunc = (text)=>{
	const hash = new jsSHA("SHA-256", 'TEXT');
	hash.update(text);
	return hash.getHash("HEX");
};

io.github.shunshun94.trpg.logEditor.LogEditorObject = null;

io.github.shunshun94.trpg.logEditor.DOMS.BODY.on(io.github.shunshun94.trpg.logEditor.EVENTS.FILE_LOADED, (e, domList)=>{
	console.log(domList);
	if(io.github.shunshun94.trpg.logEditor.LogEditorObject)	 {
		// 追加読み込み
		io.github.shunshun94.trpg.logEditor.LogEditorObject.additionalLoad({
			doms: domList.doms,
			head: domList.head,
			omitted: domList.omitted
		});
	} else {
		// 初回読み込み
		io.github.shunshun94.trpg.logEditor.FileLoader.filtLongFile(domList.doms).then((filteredList)=>{
			io.github.shunshun94.trpg.logEditor.LogEditorObject = new io.github.shunshun94.trpg.logEditor.Editor({
				doms: filteredList,
				head: domList.head,
				omitted: domList.omitted
			});
		});
	}
});

if(io.github.shunshun94.trpg.logEditor.hashFunc(location.search) === io.github.shunshun94.trpg.logEditor.EXPERIMENTAL_FUNC_PASSWORD) {
	io.github.shunshun94.trpg.logEditor.DOMS.BODY.addClass(io.github.shunshun94.trpg.logEditor.CLASSES.EXPERIMENTAL);
	console.log('experimental mode');
} else {
	console.log('not experimental mode');
}
