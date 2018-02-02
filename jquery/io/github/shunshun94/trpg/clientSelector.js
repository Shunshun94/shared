var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.characterSheetsMasashige = io.github.shunshun94.trpg.characterSheetsMasashige || {};
var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.VampireBlood = com.hiyoko.VampireBlood || {};

io.github.shunshun94.trpg.selectClient = (url) => {
	const target = url.trim();
	if(target.indexOf('character-sheets.appspot.com') > -1) {
		return io.github.shunshun94.trpg.characterSheetsMasashige;
	}
	if(target.indexOf('charasheet.vampire-blood.net') > -1) {
		if(/\/\d+$/.test(target)) {
			return com.hiyoko.VampireBlood;
		}
		throw `charasheet.vampire-blood.net の末尾は数字である必要があります`;
	}
	throw 'キャラクターシートのページを判別できませんでした';
};

