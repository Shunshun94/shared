var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ResponseChat = io.github.shunshun94.trpg.ResponseChat || {};
io.github.shunshun94.trpg.ResponseChat.generateDom = (id) => {
	let dom = `<div id="${id}"><div id="${id}-display"></div>` +
		`<div id="${id}-input"><textarea id="${id}-input-text" type="text"></textarea><button id="${id}-input-exec">送信</button></div></div>`;
	return $(dom);
};


io.github.shunshun94.trpg.ResponseChat.Display = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, opt_options) {
		super($html, opt_options);
		this.options = opt_options || {};
		this.$html.addClass(io.github.shunshun94.trpg.ResponseChat.Display.CLASS);
		this.isSuspended = false;
		this.lastUpdate = 0;
		this.limit = this.options.displayLimit || 0;
	}
	
	buildComponents() {}
	bindEvents() {}
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
		this.$html.append(logs.map(function(log) {
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
		}.bind(this)));
		
		if(this.limit) {
			var count = this.getElementsByClass(com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS + '-log').length;
			this.getElementsByClass('log:lt(' + (count - this.limit) + ')').remove();
		}
	}
};
io.github.shunshun94.trpg.ResponseChat.Display.CLASS = 'io-github-shunshun94-trpg-ResponseChat-Display-CLASS';
