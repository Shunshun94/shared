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
}
com.hiyoko.util.extend(com.hiyoko.component.InputFlow.Child, com.hiyoko.DodontoF.V2.Entrance.Url);

com.hiyoko.DodontoF.V2.Entrance.Url.prototype.bindEvents = function() {
	this.getElementById('next').click(this.goNext.bind(this));
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

