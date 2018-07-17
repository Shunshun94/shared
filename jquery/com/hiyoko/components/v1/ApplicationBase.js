var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.component = com.hiyoko.component || {};
com.hiyoko.component.ApplicationBase = function($html){
	this.$html = $($html);
	this.id = this.$html.attr('id');
};

com.hiyoko.component.ApplicationBase.prototype.buildComponents = function(){};
com.hiyoko.component.ApplicationBase.prototype.bindEvents = function(){};

com.hiyoko.component.ApplicationBase.prototype.getElement = function(query){
	return this.$html.find(query);
};

com.hiyoko.component.ApplicationBase.prototype.getElementById = function(idName){
	return this.getElement('#' + this.id + '-' + idName);
};

com.hiyoko.component.ApplicationBase.prototype.getElementsByClass = function(className){
	return this.getElement('.' + this.id + '-' + className);
};

com.hiyoko.component.ApplicationBase.prototype.setEnable = function(isEnable, opt_time) {
	if(isEnable) {
		this.$html.show(opt_time || 0);
	} else {
		this.$html.hide(opt_time || 0);
	}
};

com.hiyoko.component.ApplicationBase.prototype.enable = function(opt_time) {
	this.setEnable(true, opt_time);
};

com.hiyoko.component.ApplicationBase.prototype.disable = function(opt_time) {
	this.setEnable(false, opt_time);
};

com.hiyoko.component.ApplicationBase.prototype.isEnabled = function() {
	return this.$html.css('display') !== 'none';
};

com.hiyoko.component.ApplicationBase.prototype.fireEvent = function(event) {
	this.$html.trigger(event);
};

com.hiyoko.component.ApplicationBase.prototype.setStorage = function(id, value) {
	this.$html.trigger({type: 'setStorage', id: this.id + '-' + id, value: value});
};

com.hiyoko.component.ApplicationBase.prototype.getStorage = function(id, opt_callback) {
	var event = new $.Event('getStorage', {key: this.id + '-' + id,
		callback: opt_callback || console.log });
	this.$html.trigger(event);
};

com.hiyoko.component.ApplicationBase.prototype.getAsyncEvent = function(eventType, opt_eventProperties){
	return new com.hiyoko.component.ApplicationBase.AsyncEvent(eventType, opt_eventProperties);
};

com.hiyoko.component.ApplicationBase.AsyncEvent = function(eventType, opt_eventProperties){
	this.type = eventType;
	
	this.resolve = function(result){
		alert(result.result);
		console.log(result);
	};
	this.reject = function(result){
		alert(result.result);
		console.warn(result);
	};
	
	for(var key in opt_eventProperties){
		this[key] = opt_eventProperties[key];
	}
};

com.hiyoko.component.ApplicationBase.AsyncEvent.prototype.done = function(func) {
	this.resolve = func;
	return this;
};

com.hiyoko.component.ApplicationBase.AsyncEvent.prototype.fail = function(func) {
	this.reject = func;
	return this;
};
