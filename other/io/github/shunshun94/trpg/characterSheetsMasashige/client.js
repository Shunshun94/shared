var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.characterSheetsMasashige = io.github.shunshun94.trpg.characterSheetsMasashige || {};
io.github.shunshun94.trpg.characterSheetsMasashige.client = class  {
	constructor (domain = 'character-sheets.appspot.com') {
		this.domain = domain;
	}
	sendRequest(system, id) {
		return new Promise((resolve, reject)=>{
			const key = io.github.shunshun94.trpg.characterSheetsMasashige.client.rndString();
			io.github.shunshun94.trpg.characterSheetsMasashige.client.Resolver.resolve[key] = resolve;
			io.github.shunshun94.trpg.characterSheetsMasashige.client.Resolver.reject[key] = reject;
			const callback = this.createNewFunction(key);
			let sc = document.createElement("script");
			sc.type = 'text/javascript';
			sc.src = `https://${this.domain}/${system}/display?ajax=1&key=${id}&callback=${callback}`;
			let parent = document.getElementsByTagName("script")[0];
			parent.parentNode.insertBefore(sc,parent);
		});
	}

	createNewFunction(key) {
		const name = `io_github_shunshun94_trpg_characterSheetsMasashige_client_Resolve_${key}`;
		const execution = `
			var ${name} = (result)=>{
					if(result.base) {
					io.github.shunshun94.trpg.characterSheetsMasashige.client.Resolver.resolve["${key}"](result);
				} else {
					io.github.shunshun94.trpg.characterSheetsMasashige.client.Resolver.reject["${key}"](result);
				}
			};`;
		const geval = eval;
		geval(execution);
		return name;
	}
};

io.github.shunshun94.trpg.characterSheetsMasashige.client.rndString = () => {
	var randomString = '';
	var baseString ='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for(var i=0; i<8; i++) {
		randomString += baseString.charAt( Math.floor( Math.random() * baseString.length));
	}
	return randomString;
};

io.github.shunshun94.trpg.characterSheetsMasashige.client.Resolver = {resolve: {}, reject: {}};
