var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.DodontoF = com.hiyoko.DodontoF || {};
com.hiyoko.DodontoF.V2 = com.hiyoko.DodontoF.V2 || {};

com.hiyoko.DodontoF.V2.Entrance = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');

	var base = com.hiyoko.DodontoF.V2.Entrance;
	this.buildComponents([base.Url, base.Room, base.Password]);
	this.bindEvents();
};
com.hiyoko.util.extend(com.hiyoko.component.InputFlow, com.hiyoko.DodontoF.V2.Entrance);

com.hiyoko.DodontoF.V2.Entrance.Url = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.$html.click(function(e){
		this.goNext();
	}.bind(this));
}
com.hiyoko.util.extend(com.hiyoko.component.InputFlow.Child, com.hiyoko.DodontoF.V2.Entrance.Url);

com.hiyoko.DodontoF.V2.Entrance.Room = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.$html.click(function(e){
		this.goNext();
	}.bind(this));
}
com.hiyoko.util.extend(com.hiyoko.component.InputFlow.Child, com.hiyoko.DodontoF.V2.Entrance.Room);


com.hiyoko.DodontoF.V2.Entrance.Password = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.$html.click(function(e){
		this.goNext();
	}.bind(this));
}
com.hiyoko.util.extend(com.hiyoko.component.InputFlow.Child, com.hiyoko.DodontoF.V2.Entrance.Password);


