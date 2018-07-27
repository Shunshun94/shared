var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.DodontoF = com.hiyoko.DodontoF || {};
com.hiyoko.DodontoF.V2 = com.hiyoko.DodontoF.V2 || {};

com.hiyoko.DodontoF.V2.ChatClient = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, opt_options) {
		super($html, opt_options);
		this.options = opt_options || {};
		this.defaultColor = this.options.color || '000000';
		this.system = opt_options.system || '';
		this.generateDom();
		this.buildComponents();
		this.bindEvents();
		this.setChannelList();
	}
	
	bindEvents(){
		this.$html.on(this.display.id + '-getChatRequest', (e) => {
			this.fireEvent(this.getChatLogs(e.time).done(e.resolve).fail(e.reject));
		});
		this.$html.on(this.input.id + '-getChatRequest', (e) => {
			this.fireEvent(this.getChatLogs(e.time).done(e.resolve).fail(e.reject));
		});
		this.$html.on(this.display.id + '-sendChatRequest', (e) => {
			this.sendChat(e).done(e.resolve).fail(e.reject);
		});
		this.$html.on(this.input.id + '-sendChatRequest', (e) => {
			this.sendChat(e).done(e.resolve).fail(e.reject);
		});
		this.autoUpdateTimer = setInterval(function(e) {this.display.update();}.bind(this), this.options.timer || 3000);
	}
	destract() {
		clearInterval(this.autoUpdateTimer);
	}
	setChannelList() {
		const event = this.getAsyncEvent('tofRoomRequest',
				{method: 'getRoomInfo', args: []}).done((result) => {
			this.display.setChannelList(result.chatTab);
			this.input.setChannelList(result.chatTab);
		}).fail((result) => {
			console.warn(result);
			alert(`チャットタブ一覧の取得に失敗しました\n${err.result || err}`);
		});
		setTimeout(()=>{this.fireEvent(event)},50);
	}
	generateDom() {
		this.$html.addClass(com.hiyoko.DodontoF.V2.ChatClient.CLASS);
		if(this.getElementById('display').length && this.getElementById('input').length) {
			return;
		}
		this.$html.empty();
		this.$html.append(`<div id="${this.id}-input"></div>`);
		this.$html.append(`<div id="${this.id}-display"></div>`);
	}
	buildComponents() {
		this.display = this.options.display ?
				new this.options.display(this.getElementById('display'), this.options) :
				new com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay(this.getElementById('display'), this.options);
		this.input = this.options.input ?
				new this.options.input(this.getElementById('input'), this.options) :
				new com.hiyoko.DodontoF.V2.ChatClient.SimpleInput(this.getElementById('input'), this.options);
	}
	getChatLogs (opt_time) {
		return this.getAsyncEvent('tofRoomRequest', {method: 'getChat', args: [opt_time || 0]});
	}
	sendChat (e) {
		var promise = new $.Deferred;
		var args = e.args || {};

		if(! Boolean(args.name)) {
			var rejectObject = {result: '名前がありません', detail: 'args.name is required but, args.name is not found', args: args};
			promise.reject(rejectObject);
		} else if(! Boolean(args.message)) {
			var rejectObject = {result: '送信するメッセージがありません', detail: 'args.message is required but, args.message is not found', args: args};
			promise.reject(rejectObject);
		} else {
			args.color = args.color || this.defaultColor || '000000';
			args.channel = args.channel || 0;
			args.bot = this.system;
			this.fireEvent(this.getAsyncEvent('tofRoomRequest', {method: 'sendChat', args: [args]}).done(function(result) {
				result.args = args;
				promise.resolve(result);
			}).fail(function(result) {
				result.args = args;
				promise.reject(result);
			}));
		}

		return promise;
	}
};
com.hiyoko.DodontoF.V2.ChatClient.CLASS = 'com-hiyoko-dodontof-v2-chatclient';

com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, opt_options) {
		super($html, opt_options);
		this.options = opt_options || {};
		this.generateDom();
		this.$html.addClass(com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS);
		this.isSuspended = false;
		this.lastUpdate = 0;
		this.channels = ['メイン'];
		this.limit = this.options.displayLimit || 0;
	}
	generateDom() {
		// empty method
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
		const list = data.chatMessageDataLog.map((log) => {return com.hiyoko.DodontoF.V2.fixChatMsg(log);});
		this.updateLogs(list);
		if(list.length) {
			const lastMsg = list[list.length - 1];
			this.updateLastUpdate((lastMsg.id === '0') ? lastMsg.time : lastMsg.id);
		}
	}
	updateLastUpdate(time) {
		this.lastUpdate = time;
	}
	updateLogs(logs) {
		this.$html.prepend(logs.map((log) => {
			var $log = $(com.hiyoko.util.format('<p style="color:%s" class="%s-log %s-log"></p>',
					log.color.startsWith('rgb') ? log.color : `#${log.color}` , this.id, com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS));
			var $name = $(com.hiyoko.util.format('<span class="%s-log-name %s-log-name"></span>',
					this.id, com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS));
			$name.text(log.name);
			var $tab = $(com.hiyoko.util.format('<span class="%s-log-tab %s-log-tab"></span>',
					this.id, com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS));
			$tab.text(this.channels[log.tab]);
			var $msg = $(com.hiyoko.util.format('<span class="%s-log-message %s-log-message"></span>',
					this.id, com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS));
			$msg.textWithLF(log.msg);
			$log.append($name);
			$log.append($tab);
			$log.append($msg);
			return $log;
		}).reverse());
		
		if(this.limit) {
			var count = this.getElementsByClass(com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS + '-log').length;
			this.getElementsByClass(`log:gt(${this.limit + 1})`).remove();
		}
	}
	setChannelList(list) {
		this.channels = list;
	}
}
com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS = 'com-hiyoko-dodontof-v2-chatclient-simpledisplay';

com.hiyoko.DodontoF.V2.ChatClient.SimpleInput = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, opt_options) {
		super($html, opt_options);
		this.options = opt_options || {};
		this.generateDom();
		this.text = this.getElementById('text');
		
		this.name = this.options.name || 'うめか';
		this.color = this.options.color || false;
		
		this.bindEvents();
	}
	setChannelList(list) {
		list.forEach((name, i) => {
			this.getElementById('channel').append(`<option value="${i}">${name}</option>`);
		});
		if(list.length <= 1) {
			this.getElementById('channel').hide();
		}
	}
	getChannel() {
		if(this.getElementById('channel').length === 0) {
			return 0;
		}
		return this.getElementById('channel').val();
	}
	generateDom() {
		this.$html.addClass(com.hiyoko.DodontoF.V2.ChatClient.SimpleInput.CLASS);
		if(this.getElementById('channel').length === 0) {
			this.$html.append(`<select id="${this.id}-channel" class="${com.hiyoko.DodontoF.V2.ChatClient.SimpleInput.CLASS}-channel"></select>`);
		}
		if(this.getElementById('text').length === 0) {
			this.$html.append(`<textarea placeholder="送信したい内容をここに入力" class="${com.hiyoko.DodontoF.V2.ChatClient.SimpleInput.CLASS}-text" id="${this.id}-text"></textarea><br/>Shift+Enter で改行。Enter で送信`)
		}
	}
	whenPushKey(event) {
		const e = event.originalEvent;
		if(e.key === 'Enter' && (! e.shiftKey)) {
			const msg = this.getAsyncEvent(`${this.id}-sendChatRequest`, {
				args: {	name: this.name,
						message: this.text.val(),
						color: this.color,
						channel: this.getChannel()
				}
			}).done(function(result) {
				this.text.val('');
			}.bind(this)).fail(function(result) {
				alert(result.result);
			});
			this.fireEvent(msg);
			event.preventDefault();
		}
	}
	bindEvents() {
		if(this.getElementById('exec').length) {
			this.getElementById('exec').click((e) => {
				var event = this.getAsyncEvent(`${this.id}-sendChatRequest`, {
					args: {name: this.name, message: this.text.val()}
				}).done(function(result) {
					this.text.val('');
				}.bind(this)).fail(function(result) {
					alert(result.result);
				});
				this.fireEvent(event);	
			});
		} else {
			this.text.keypress((e) => {
				this.whenPushKey(e);
			});
		}
		

	}
};
com.hiyoko.DodontoF.V2.ChatClient.SimpleInput.CLASS = 'com-hiyoko-dodontof-v2-chatclient-simpleinput';

// From https://s8a.jp/jquery-text-with-lf
(function(r){function l(a){return b(a,c,t,function(a){return u[a]})}function m(a){return b(a,f,v,function(a){return w[a]})}function b(a,b,d,e){return a&&d.test(a)?a.replace(b,e):a}function d(a){if(null==a)return"";if("string"==typeof a)return a;if(Array.isArray(a))return a.map(d)+"";var b=a+"";return"0"==b&&1/a==-(1/0)?"-0":b}var u={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},c=/[&<>"']/g,t=new RegExp(c.source),w={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"},f=/&(?:amp|lt|gt|quot|#39);/g,
	v=new RegExp(f.source),e=/<(?:.|\n)*?>/mg,n=new RegExp(e.source),g=/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,p=new RegExp(g.source),h=/<br\s*\/?>/mg,q=new RegExp(h.source);r.fn.textWithLF=function(a){var c=typeof a;return"undefined"==c?m(b(b(this.html(),h,q,"\n"),e,n,"")):this.html("function"==c?function(c,f){var k=a.call(this,c,m(b(b(f,h,q,"\n"),e,n,"")));return"undefined"==typeof k?k:b(l(d(k)),g,p,"$1<br>")}:b(l(d(a)),g,p,"$1<br>"))}})(jQuery);

