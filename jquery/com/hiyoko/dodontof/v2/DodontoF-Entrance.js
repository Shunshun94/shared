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
	if(this.getElementById('StaticInput-Hide').css('display') === 'none') {
		return {key: 'url', value: this.getElementById('FreeInput-Url').val()};
	} else {
		return {key: 'url', value: this.getElementById('StaticInput-List').val()};
	}
};




com.hiyoko.DodontoF.V2.Entrance.Room = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.bindEvents();
}
com.hiyoko.util.extend(com.hiyoko.component.InputFlow.Child, com.hiyoko.DodontoF.V2.Entrance.Room);

com.hiyoko.DodontoF.V2.Entrance.Room.prototype.bindEvents = function() {
	this.getElementById('next').click(this.goNext.bind(this));
	this.getElementById('back').click(this.goBack.bind(this));
};


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

