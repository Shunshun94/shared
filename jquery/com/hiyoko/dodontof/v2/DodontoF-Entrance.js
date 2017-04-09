var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.DodontoF = com.hiyoko.DodontoF || {};
com.hiyoko.DodontoF.V2 = com.hiyoko.DodontoF.V2 || {};

com.hiyoko.DodontoF.V2.Entrance = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');

	var base = com.hiyoko.DodontoF.V2.Entrance;
	this.buildComponents([base.Url, base.Room, base.Password, base.Option]);
	this.bindEvents();
};
com.hiyoko.util.extend(com.hiyoko.component.InputFlow, com.hiyoko.DodontoF.V2.Entrance);

com.hiyoko.DodontoF.V2.Entrance.Url = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.bindEvents();
	this.buildComponents();
}
com.hiyoko.util.extend(com.hiyoko.component.InputFlow.Child, com.hiyoko.DodontoF.V2.Entrance.Url);

com.hiyoko.DodontoF.V2.Entrance.Url.prototype.bindEvents = function() {
	var self = this;

	this.getElementById('Next').click(this.goNext.bind(this));

	this.getElementById('StaticInput-Hide').click(function(e) {
		self.getElementById('StaticInput').hide(com.hiyoko.component.InputFlow.Child.SPEED);
		self.getElementById('FreeInput').show(com.hiyoko.component.InputFlow.Child.SPEED);
	});

	this.getElementById('FreeInput-Hide').click(function(e) {
		self.getElementById('FreeInput').hide(com.hiyoko.component.InputFlow.Child.SPEED);
		self.getElementById('StaticInput').show(com.hiyoko.component.InputFlow.Child.SPEED);
	});
};

com.hiyoko.DodontoF.V2.Entrance.Url.prototype.buildComponents = function() {
	com.hiyoko.util.forEachMap(com.hiyoko.DodontoF.PUBLIC_SERVER_LIST, function(v, k) {
		this.getElementById('StaticInput-List').append(com.hiyoko.util.format('<option value="%s">%s (%s)</option>', v, k, v));
	}.bind(this));
};

com.hiyoko.DodontoF.V2.Entrance.Url.prototype.getValue = function() {
	if(this.getElementById('StaticInput').css('display') === 'none') {
		return {key: 'url', value: this.getElementById('FreeInput-Url').val()};
	} else {
		return {key: 'url', value: this.getElementById('StaticInput-List').val()};
	}
};


com.hiyoko.DodontoF.V2.Entrance.Room = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.bindEvents();
	this.roomStatus = {
		no: 0,
		isLocked: false
	};
}
com.hiyoko.util.extend(com.hiyoko.component.InputFlow.Child, com.hiyoko.DodontoF.V2.Entrance.Room);

com.hiyoko.DodontoF.V2.Entrance.Room.prototype.bindEvents = function() {
	this.getElementById('next').click(this.goNext.bind(this));
	this.getElementById('back').click(this.goBack.bind(this));
	this.getElementById('list').click(function(e) {
		var $target = $(e.target)[0];
		
		if($target.tagName === 'INPUT') {
			$target = $($target);
			this.roomStatus.isLocked = $target.attr('class').endsWith('locked');
			this.roomStatus.no = Number($target.parent().find('.' + this.id + '-rooms-room-index').text());
			this.goNext();
		}
	}.bind(this));
};

com.hiyoko.DodontoF.V2.Entrance.Room.prototype.setComponent = function(params) {
	this.getElementById('list').empty();
	(new com.hiyoko.DodontoF.V2.Server(params .url)).getRoomList().done(function(r){
		if(r.result !== 'OK') {
			alert('どどんとふに接続はできましたが部屋一覧を取得できませんでした。\n理由：' + r.result);
			this.goBack();
			return;
		}
		
		this.getElementById('list').append(this.generateRoomList(r.playRoomStates));
	}.bind(this)).fail(function(e){
		alert('どどんとふの URL が間違っています。\n\n【よくある間違い】短縮アドレスだと受け付けません');
		this.goBack();
	}.bind(this));
};

com.hiyoko.DodontoF.V2.Entrance.Room.prototype.generateRoomList = function(rooms) {
	var $roomList = '';
	rooms.forEach(function(room, i) {
		if(room.lastUpdateTime) {
			$roomList += com.hiyoko.util.format(
				com.hiyoko.DodontoF.V2.Entrance.Room.ROOM_TEMPLATE,
				this.id,
				this.id, room.index, this.id, room.playRoomName,
				this.id, room.gameType, this.id, room.loginUsers.length,
				room.passwordLockState ?
					com.hiyoko.util.format(com.hiyoko.DodontoF.V2.Entrance.Room.BUTTON_TEMPLATE, this.id, 'locked', '🔒パスワードを入力して入室する') :
					com.hiyoko.util.format(com.hiyoko.DodontoF.V2.Entrance.Room.BUTTON_TEMPLATE, this.id, 'entry', '入室する'),
				room.canVisit && room.passwordLockState ?
					' ' + com.hiyoko.util.format(com.hiyoko.DodontoF.V2.Entrance.Room.BUTTON_TEMPLATE, this.id, 'visitor', '📺見学者として入室する') :
					''
			);
		}
	}.bind(this));
	return $roomList;
};

com.hiyoko.DodontoF.V2.Entrance.Room.prototype.getValue = function() {
	return {
		key: 'room',
		value: this.roomStatus
	};
}

com.hiyoko.DodontoF.V2.Entrance.Room.ROOM_TEMPLATE = '<div class="%s-rooms-room">' +
	'No. <span class="%s-rooms-room-index">%s</span> - <span class="%s-rooms-room-name">%s</span><br/>' +
	'System <span class="%s-rooms-room-system">%s</span>　人数 <span class="%s-rooms-room-count">%s</span><br/>' +
	'%s' +
	'%s</div>';
com.hiyoko.DodontoF.V2.Entrance.Room.BUTTON_TEMPLATE = '<input type="button" class="%s-rooms-room-%s" value="%s" />';

com.hiyoko.DodontoF.V2.Entrance.Password = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.bindEvents();
}
com.hiyoko.util.extend(com.hiyoko.component.InputFlow.Child, com.hiyoko.DodontoF.V2.Entrance.Password);

com.hiyoko.DodontoF.V2.Entrance.Password.prototype.bindEvents = function() {
	this.getElementById('next').click(this.goNext.bind(this));
	this.getElementById('back').click(this.goBack.bind(this));
};

com.hiyoko.DodontoF.V2.Entrance.Password.prototype.open = function(params, isBack) {
	if(! params.room.isLocked) {
		if(isBack) {
			this.goBack();
		} else {
			this.goNext();
		}
		return;
	}
	this.$html.show(com.hiyoko.component.InputFlow.Child.SPEED);
}

com.hiyoko.DodontoF.V2.Entrance.Option = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.bindEvents();
}
com.hiyoko.util.extend(com.hiyoko.component.InputFlow.Child, com.hiyoko.DodontoF.V2.Entrance.Option);

com.hiyoko.DodontoF.V2.Entrance.Option.prototype.bindEvents = function() {
	this.getElementById('next').click(this.goNext.bind(this));
	this.getElementById('back').click(this.goBack.bind(this));
};

