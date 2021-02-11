var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};
io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory = io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory || {};
io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.getConvertor = (file) => {
	if(file.name.endsWith('.zip')) {
		return io.github.shunshun94.trpg.logEditor.convertors.UdonariumConvertor;
	} else {
		return io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor;
	}
};
