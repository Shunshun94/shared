var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.DodontoF = com.hiyoko.DodontoF || {};
com.hiyoko.DodontoF.V2 = com.hiyoko.DodontoF.V2 || {};

com.hiyoko.DodontoF.V2.ChatClient = function($html, opt_options) {
	this.options = opt_options || {};
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.buildComponents();
	
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.DodontoF.V2.ChatClient);

com.hiyoko.DodontoF.V2.ChatClient.DummyEvent = {
	resolve: function(value) {
		console.log(value);
	},
	reject: function(value) {
		alert(value.result);
		console.error(value);
	}
};

com.hiyoko.DodontoF.V2.ChatClient.prototype.bindEvents = function() {
	this.$html.on(this.display.id + '-getChatRequest', function(e) {
		this.fireEvent(this.getChatLogs(e.time).done(e.resolve).fail(e.reject));
	}.bind(this));
	this.$html.on(this.input.id + '-getChatRequest', function(e) {
		this.fireEvent(this.getChatLogs(e.time).done(e.resolve).fail(e.reject));
	}.bind(this));
	this.$html.on(this.display.id + '-sendChatRequest', function(e) {
		this.sendChat(e).done(e.resolve).fail(e.reject);
	}.bind(this));
	this.$html.on(this.input.id + '-sendChatRequest', function(e) {
		this.sendChat(e).done(e.resolve).fail(e.reject);
	}.bind(this));
	this.autoUpdateTimer = setInterval(function(e) {this.display.update();}.bind(this), this.options.timer || 3000);
};

com.hiyoko.DodontoF.V2.ChatClient.prototype.destract = function() {
	clearInterval(this.autoUpdateTimer);
};

com.hiyoko.DodontoF.V2.ChatClient.prototype.buildComponents = function() {
	this.display = this.options.display ?
			new this.option.display(this.getElementById('display'), this.options) :
			new com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay(this.getElementById('display'), this.options);
	this.input = this.options.input ?
			new this.options.input(this.getElementById('input'), this.options) :
			new com.hiyoko.DodontoF.V2.ChatClient.SimpleInput(this.getElementById('input'), this.options);
};

com.hiyoko.DodontoF.V2.ChatClient.prototype.getChatLogs = function(opt_time) {
	return this.getAsyncEvent('tofRoomRequest', {method: 'getChat', args: [opt_time || 0]});
};

com.hiyoko.DodontoF.V2.ChatClient.prototype.sendChat = function(e) {
	var promise = new $.Deferred;
	var args = e.args || {};
	
	if(! Boolean(args.name)) {
		var rejectObject = {result: '名前がありません', detail: 'args.name is required but, args.name is not found', args: args};
		promise.reject(rejectObject);
	} else if(! Boolean(args.message)) {
		var rejectObject = {result: '送信するメッセージがありません', detail: 'args.message is required but, args.message is not found', args: args};
		promise.reject(rejectObject);
	} else {
		args.color = args.color || '000000';
		args.channel = args.channel || 0;
		this.fireEvent(this.getAsyncEvent('tofRoomRequest', {method: 'sendChat', args: [args]}).done(function(result) {
			result.args = args;
			promise.resolve(result);
		}).fail(function(result) {
			result.args = args;
			promise.reject(result);
		}));
	}
	
	return promise;
};

com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay = function($html, opt_options) {
	this.options = opt_options || {};
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.$html.addClass(com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS);
	
	this.lastUpdate = 0;
	this.limit = this.options.displayLimit || 0;
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay);

com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.prototype.update = function() {
	var event = this.getAsyncEvent(this.id + '-getChatRequest', {time: this.lastUpdate}).done(this.receptData.bind(this)).fail(function(err) {
		console.warn(err);
		alert(err.result || err);
	});
	this.fireEvent(event);	
};

com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.prototype.receptData = function(data) {
	var list = data.chatMessageDataLog.map(function(log){return com.hiyoko.DodontoF.V2.fixChatMsg(log);});
	this.updateLogs(list);
	if(list.length) {
		var lastMsg = list[list.length - 1];
		this.updateLastUpdate(Number(list[list.length - 1].id) || list[list.length - 1].time);
	}
};

com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.prototype.updateLastUpdate = function(time) {
	this.lastUpdate = time;
};

com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.prototype.updateLogs = function(logs) {
	this.$html.append(logs.map(function(log) {
		var $log = $(com.hiyoko.util.format('<p style="color:#%s" class="%s-log %s-log"></p>',
				log.color, this.id, com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS));
		var $tab = $(com.hiyoko.util.format('<span class="%s-log-tab %s-log-tab"></span>',
				this.id, com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS));
		$tab.text('');
		var $name = $(com.hiyoko.util.format('<span class="%s-log-name %s-log-name"></span>',
				this.id, com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS));
		$name.text(log.name);
		var $msg = $(com.hiyoko.util.format('<span class="%s-log-message %s-log-message"></span>',
				this.id, com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS));
		$msg.textWithLF(log.msg);
		$log.append($tab);
		$log.append($name);
		$log.append($msg);
		return $log;
	}.bind(this)));
	
	if(this.limit) {
		var count = this.getElementsByClass(com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS + '-log').length;
		this.getElementsByClass('log:lt(' + (count - this.limit) + ')').remove();
	}
};

com.hiyoko.DodontoF.V2.ChatClient.SimpleDisplay.CLASS = 'com-hiyoko-dodontof-v2-chatclient-simpledisplay';

com.hiyoko.DodontoF.V2.ChatClient.SimpleInput = function($html, opt_options) {
	this.options = opt_options || {};
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.text = this.getElementById('text');
	this.exec = this.getElementById('exec');
	
	this.name = this.options.name || 'いおり';
	this.color = this.options.color || '000000';
	
	this.bindEvents();
};
com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.DodontoF.V2.ChatClient.SimpleInput);

com.hiyoko.DodontoF.V2.ChatClient.SimpleInput.prototype.bindEvents = function() {
	this.exec.click(function(e) {
		var event = this.getAsyncEvent(this.id + '-sendChatRequest', {
			args: {name: this.name, message: this.text.val(), color: this.color}
		}).done(function(result) {
			this.text.val('');
		}.bind(this)).fail(function(result) {
			alert(result.result);
		});
		this.fireEvent(event);	
	}.bind(this));
};


// From https://s8a.jp/jquery-text-with-lf
(function(r){function l(a){return b(a,c,t,function(a){return u[a]})}function m(a){return b(a,f,v,function(a){return w[a]})}function b(a,b,d,e){return a&&d.test(a)?a.replace(b,e):a}function d(a){if(null==a)return"";if("string"==typeof a)return a;if(Array.isArray(a))return a.map(d)+"";var b=a+"";return"0"==b&&1/a==-(1/0)?"-0":b}var u={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},c=/[&<>"']/g,t=new RegExp(c.source),w={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"},f=/&(?:amp|lt|gt|quot|#39);/g,
	v=new RegExp(f.source),e=/<(?:.|\n)*?>/mg,n=new RegExp(e.source),g=/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,p=new RegExp(g.source),h=/<br\s*\/?>/mg,q=new RegExp(h.source);r.fn.textWithLF=function(a){var c=typeof a;return"undefined"==c?m(b(b(this.html(),h,q,"\n"),e,n,"")):this.html("function"==c?function(c,f){var k=a.call(this,c,m(b(b(f,h,q,"\n"),e,n,"")));return"undefined"==typeof k?k:b(l(d(k)),g,p,"$1<br>")}:b(l(d(a)),g,p,"$1<br>"))}})(jQuery);

