var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.discord = io.github.shunshun94.trpg.discord || {};
io.github.shunshun94.trpg.discord.Entrance = class extends com.hiyoko.component.InputFlow {
	constructor($html, opt_options) {
		super($html, opt_options);
		const components = [
			io.github.shunshun94.trpg.discord.Entrance.Token,
			io.github.shunshun94.trpg.discord.Entrance.Room,
			io.github.shunshun94.trpg.discord.Entrance.BCDice
		];
		this.buildDom();
		this.buildComponents(components, opt_options);
		this.bindEvents();
		this.$html.on(com.hiyoko.component.InputFlow.Events.Finish, (e) => {
			let tokens = JSON.parse(localStorage.getItem(io.github.shunshun94.trpg.discord.Entrance.Token.TokenList) || '[]');
			if(! tokens.includes(e.value.url)) {
				tokens.push(e.value.url);
				localStorage.setItem(io.github.shunshun94.trpg.discord.Entrance.Token.TokenList, JSON.stringify(tokens));
			}
			let dices = JSON.parse(localStorage.getItem(io.github.shunshun94.trpg.discord.Entrance.BCDice.UrlList) || '[]');
			if(! dices.includes(e.value.dicebot)) {
				dices.push(e.value.dicebot);
				localStorage.setItem(io.github.shunshun94.trpg.discord.Entrance.BCDice.UrlList, JSON.stringify(dices));
			}
		});
	}

	buildDom() {
		this.$html.append(	`<div id="${this.id}-url"><p>Discord Bot のトークン：<input list="${this.id}-url-list" id="${this.id}-url-token" type="text" />` +
							`<button id="${this.id}-url-next">チャンネル選択へ進む</button></p><datalist id="${this.id}-url-list"></datalist></div>`);
		this.$html.append(	`<div id="${this.id}-room"><button id="${this.id}-room-back">Discord Bot のトークンに戻る</button><p id="${this.id}-room-loading">⌛部屋情報読み込み中……</p></div>`);
		this.$html.append(	`<div id="${this.id}-bcdice"><button id="${this.id}-bcdice-back">チャンネルの選択に戻る</button><p>BCDiceAPI の URL：` +
							`<input list="${this.id}-bcdice-list" placeholder="https://www.example.com/bcdice-api" id="${this.id}-bcdice-url" type="text" />` +
							`<button id="${this.id}-bcdice-next">入力完了</button></p><datalist id="${this.id}-bcdice-list"></datalist></div>`);
	}
};

io.github.shunshun94.trpg.discord.Entrance.Token = class extends com.hiyoko.component.InputFlow.Child {
	constructor($html, opt_options) {
		super($html, opt_options);
		this.bindEvents();
		const list = JSON.parse(localStorage.getItem(io.github.shunshun94.trpg.discord.Entrance.Token.TokenList) || '[]');
		this.getElementById('list').append(list.map((token) => {
			return `<option value="${token}"></option>`;
		}).join(''));
	}
	bindEvents() {
		this.getElementById('next').click((e) => {this.fireEvent(new $.Event(com.hiyoko.component.InputFlow.Child.Events.GoNext));});
	}
	setComponent(param) {}
	getValue() {
		return {key: 'url', value: this.getElementById('token').val()};
	}
};

io.github.shunshun94.trpg.discord.Entrance.Token.TokenList = 'io-github-shunshun94-trpg-discord-Entrance-Token-TokenList';

io.github.shunshun94.trpg.discord.Entrance.Room = class extends com.hiyoko.component.InputFlow.Child {
	constructor($html, opt_options) {
		super($html, opt_options);
		this.bindEvents();
		this.room = 0;
	}
	bindEvents() {
		this.getElementById('back').click((e) => {this.$html.trigger(new $.Event(com.hiyoko.component.InputFlow.Child.Events.GoBack));});
		this.$html.click((e) => {
			const $target = $(e.target);
			if($target.hasClass(`${this.id}-room-next`)) {
				this.room = $target.parent().find(`.${this.id}-room-index`).text();
				this.fireEvent(new $.Event(com.hiyoko.component.InputFlow.Child.Events.GoNext));
			}
		});
	}
	setComponent(param) {
		this.getElementById('back').hide();
		this.getElementById('loading').show();
		this.getElementsByClass('room').remove();
		const client = new io.github.shunshun94.trpg.discord.Server(param.url);
		setTimeout(()=>{
			client.getRoomList().then((rooms) => {
				if(rooms.playRoomStates.length) {
					this.getElementById('back').show();
					this.getElementById('loading').hide();
					this.$html.append(this.generateRoomList(rooms.playRoomStates));
				} else {
					alert('チャンネルが見つかりませんでした。トークンが正しいが確認してみてください');
					this.fireEvent(new $.Event(com.hiyoko.component.InputFlow.Child.Events.GoBack));
				}
			});			
		}, 1500);
	}
	generateRoomList(rooms) {
		var $roomList = '';
		return rooms.map((room, i) => {
			return	`<div class="${this.id}-room">` +
					`Channel ID: <span class="${this.id}-room-index">${room.index}</span> - ` +
					`<span class="${this.id}-room-name">${room.playRoomName}</span><br/>` +
					`人数 <span class="${this.id}-room-count">${room.loginUsers.length}</span><br/>` +
					`<button class="${this.id}-room-next">このチャンネルに入る</button></div>`;
		}).join('');
	}
	getValue() {
		return {key: 'room', value: this.room};
	}
};

io.github.shunshun94.trpg.discord.Entrance.BCDice = class extends com.hiyoko.component.InputFlow.Child {
	constructor($html, opt_options) {
		super($html, opt_options);
		this.bindEvents();
		const list = JSON.parse(localStorage.getItem(io.github.shunshun94.trpg.discord.Entrance.BCDice.UrlList) || '[]');
		this.getElementById('list').append(list.map((url) => {
			return `<option value="${url}"></option>`;
		}).join(''))
	}
	bindEvents() {
		this.getElementById('next').click((e) => {this.$html.trigger(new $.Event(com.hiyoko.component.InputFlow.Child.Events.GoNext));});
		this.getElementById('back').click((e) => {this.$html.trigger(new $.Event(com.hiyoko.component.InputFlow.Child.Events.GoBack));});
	}
	getValue() {
		return {key: 'dicebot', value: this.getElementById('url').val()};
	}
};
io.github.shunshun94.trpg.discord.Entrance.BCDice.UrlList = 'io-github-shunshun94-trpg-discord-Entrance-BCDice-UrlList';

