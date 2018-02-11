var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.DodontoF = com.hiyoko.DodontoF || {};
com.hiyoko.DodontoF.V2 = com.hiyoko.DodontoF.V2 || {};
var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};

io.github.shunshun94.trpg.ServerClientFactory = (args) => {
	return io.github.shunshun94.trpg.SelectPlatform('Server', args);
};


io.github.shunshun94.trpg.RoomClientFactory = (args) => {
	return io.github.shunshun94.trpg.SelectPlatform('Room', args);
};

io.github.shunshun94.trpg.SelectPlatform = (type, args) => {
	var url = args.url || args.token;
	
	if(! Boolean(url)) {
		throw 'The 1st argument is empty!';
	}
	
	if((typeof url) === 'object') {
		url = $(url); 
		if(url.length === 1) {
			return io.github.shunshun94.trpg.generateClient(io.github.shunshun94.trpg.dummy, type, url, args);
		} else {
			console.error('No HTML Element is found even url is inputed as object. Object is', url);
			throw 'No HTML Element is found even url is inputed as object';
		}
	}
	
	if(/.{24}\..{6}\..{27}/.test(url)) {
		return io.github.shunshun94.trpg.generateClient(io.github.shunshun94.trpg.discord, type,
				url, args.room, args.dicebot ? new com.hiyoko.BCDiceAPIClient(args.dicebot, args.system) : false);
	}
	if(url.indexOf('DodontoF') > -1) {
		return io.github.shunshun94.trpg.generateClient(com.hiyoko.DodontoF.V2, type, url, args.room, args.pass);
	}

	return io.github.shunshun94.trpg.generateClient(com.hiyoko.DodontoF.V2, type, args);
};

io.github.shunshun94.trpg.generateClient = (base, type, ...args) => {
	// これダサイ。なんとかしたい。
	return new base[type](args[0], args[1], args[2], args[3], args[4], args[5]);
};

