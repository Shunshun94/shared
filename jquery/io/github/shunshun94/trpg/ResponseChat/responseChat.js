var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};

io.github.shunshun94.trpg.ResponseChat = class extends com.hiyoko.DodontoF.V2.ChatClient {
	constructor($html, opt_options) {
		super($html, opt_options);
	}
	bindEvents() {
		this.$html.on(this.display.id + '-getChatRequest', (e) => {
			this.fireEvent(this.getChatLogs(e.time).done(e.resolve).fail(e.reject));
		});
		this.$html.on(this.input.id + '-sendChatRequest', (e) => {
			this.sendChat(e).done(e.resolve).fail(e.reject);
		});
		this.$html.on(io.github.shunshun94.trpg.ResponseChat.Display.Events.REPLY, (e) => {
			this.input.insertReply(e);
		});
		this.autoUpdateTimer = setInterval(function(e) {this.display.update();}.bind(this), this.options.timer || 3000);
	}
	buildComponents() {
		this.display = new io.github.shunshun94.trpg.ResponseChat.Display(this.getElementById('display'), this.options);
		this.input = new io.github.shunshun94.trpg.ResponseChat.Input(this.getElementById('input'), this.options);
	};
};

io.github.shunshun94.trpg.ResponseChat.generateDom = (id) => {
	let dom = 	`<div id="${id}" class="${io.github.shunshun94.trpg.ResponseChat.CLASS}">
					<div id="${id}-namelist" class="${io.github.shunshun94.trpg.ResponseChat.CLASS}-child ${io.github.shunshun94.trpg.ResponseChat.CLASS}-namelist"></div>
					<div class="${io.github.shunshun94.trpg.ResponseChat.CLASS}-child">
						${io.github.shunshun94.trpg.ResponseChat.Input.generateDom(id)}
						<div id="${id}-display" class="${io.github.shunshun94.trpg.ResponseChat.CLASS}-display"></div>
					</div>
				</div>`;
	return $(dom);
};

io.github.shunshun94.trpg.ResponseChat.CLASS = 'io-github-shunshun94-trpg-ResponseChat';

io.github.shunshun94.trpg.ResponseChat.Display = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, opt_options) {
		super($html, opt_options);
		this.options = opt_options || {};
		this.$html.addClass(io.github.shunshun94.trpg.ResponseChat.Display.CLASS);
		this.isSuspended = false;
		this.lastUpdate = 0;
		this.limit = this.options.displayLimit || 0;
		this.bindEvents();
	}
	
	buildComponents() {}
	bindEvents() {
		this.$html.click((e) => {
			const $dom = $(e.target);
			if($dom.hasClass(`${io.github.shunshun94.trpg.ResponseChat.Display.CLASS}-log-reply`)) {
				const name = $dom.parent().find(`.${io.github.shunshun94.trpg.ResponseChat.Display.CLASS}-log-name`).text();
				const message = $dom.parent().find(`.${io.github.shunshun94.trpg.ResponseChat.Display.CLASS}-log-message`).textWithLF();
				this.fireEvent({
					type: io.github.shunshun94.trpg.ResponseChat.Display.Events.REPLY,
					name: name, message: message
				});
				$dom.addClass(`${io.github.shunshun94.trpg.ResponseChat.Display.CLASS}-log-reply-clicked ${this.id}-log-reply-clicked`);
			}
		});
		
	}
	update() {
		if(this.isSuspended) {
			console.log('Chat update is suspended.');
			return;
		}
		this.isSuspended = true;
		var event = this.getAsyncEvent(this.id + '-getChatRequest', {time: this.lastUpdate}).done((result) => {
			this.isSuspended = false;
			this.receptData(result);
		}).fail((err) => {
			this.isSuspended = false;
			console.warn(err);
			alert(`チャットログの更新に失敗しました\n${err.result || err}`);
		});
		this.fireEvent(event);
	}
	receptData(data) {
		if(data.chatMessageDataLog.length) {
			const list = data.chatMessageDataLog.map(function(log){return com.hiyoko.DodontoF.V2.fixChatMsg(log);});
			this.updateLogs(list);
			const lastMsg = list[list.length - 1];
			this.lastUpdate = ((lastMsg.id === '0') ? lastMsg.time : lastMsg.id);
		}
	}
	updateLogs(logs) {
		this.$html.prepend(logs.map((log) => {
			let $log = $(`<div style="color:#${log.color}" class="${this.id}-log ${io.github.shunshun94.trpg.ResponseChat.Display.CLASS}-log"></div>`);
			if(log.tab) {
				$log.addClass(`${this.id}-log-notMain`);
				$log.addClass(`${io.github.shunshun94.trpg.ResponseChat.Display.CLASS}-log-notMain`);
			}
			
			let $name = $(`<span class="${this.id}-log-name ${io.github.shunshun94.trpg.ResponseChat.Display.CLASS}-log-name"></span>`);
			$name.text(log.name);
			
			var $msg = $(`<span class="${this.id}-log-message ${io.github.shunshun94.trpg.ResponseChat.Display.CLASS}-log-message"></span>`);
			$msg.textWithLF(log.msg);
			$log.append($name);
			$log.append($msg);
			$log.append(`<span class="${this.id}-log-reply ${io.github.shunshun94.trpg.ResponseChat.Display.CLASS}-log-reply">💬</span>`)
			return $log;
		}).reverse());
		
		if(this.limit) {
			var count = this.getElementsByClass(com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS + '-log').length;
			this.getElementsByClass(`log:gt(${this.limit + 1})`).remove();
		}
	}
};
io.github.shunshun94.trpg.ResponseChat.Display.CLASS = 'io-github-shunshun94-trpg-ResponseChat-display';
io.github.shunshun94.trpg.ResponseChat.Display.Events = {
	REPLY: 'io-github-shunshun94-trpg-ResponseChat-Display-Events-REPLY'
};

io.github.shunshun94.trpg.ResponseChat.Input = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, options = {}) {
		super($html, options);
		this.$name = this.getElementById('name');
		this.$text = this.getElementById('text');

		this.bindEvents();
		this.defaultName = options.defaultName || 'GM';
		this.GMColor = this.GMColor || this.defaultColor || this.color || '000000';
		this.NPCColor = this.NPCColor || this.defaultColor || this.color || '222222';
		this.$name.val(this.defaultName);

		
	}
	bindEvents() {
		this.$text.keypress((event) => {
			const e = event.originalEvent;
			if(e.key === 'Enter' && (! e.shiftKey)) {
				const name = this.$name.val();
				const msg = this.getAsyncEvent(`${this.id}-sendChatRequest`, {
					args: {	name: name,
							message: this.$text.textWithLF(),
							color: (name === this.defaultName) ? this.GMColor : this.NPCColor}
				}).done(function(result) {
					this.$text.text('');
				}.bind(this)).fail(function(result) {
					alert(result.result);
				});
				this.fireEvent(msg);
			}
			event.stopPropagation();
		});
	}
	insertReply(target) {
		let text = this.$text.textWithLF();
		this.$text.textWithLF(`@${target.name}\n> ${target.message.replace(/\n/gm, '\n> ')}\n\n${text}`);
	}
};

io.github.shunshun94.trpg.ResponseChat.Input.generateDom = (id) => {
	return `<div id="${id}-input" class="${io.github.shunshun94.trpg.ResponseChat.Input.CLASS}">
				<div>${io.github.shunshun94.trpg.ResponseChat.Input.TEXT.NAME}<input id="${id}-input-name" class="${io.github.shunshun94.trpg.ResponseChat.Input.CLASS}-name" type="text"/></div>
				<div id="${id}-input-text" class="${io.github.shunshun94.trpg.ResponseChat.Input.CLASS}-text" contenteditable></div>
				<p class="${io.github.shunshun94.trpg.ResponseChat.Input.CLASS}-borderText">${io.github.shunshun94.trpg.ResponseChat.Input.TEXT.ABOUT_RETURN}</p>
			</div>`;
};

io.github.shunshun94.trpg.ResponseChat.Input.TEXT = {
	ABOUT_RETURN: 'Shift+Enter で改行。Enter で送信',
	NAME: '名前'
};
io.github.shunshun94.trpg.ResponseChat.Input.CLASS = 'io-github-shunshun94-trpg-ResponseChat-input'
io.github.shunshun94.trpg.ResponseChat.Input.Events = {
	
};
