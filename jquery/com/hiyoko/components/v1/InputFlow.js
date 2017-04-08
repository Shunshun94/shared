var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.component = com.hiyoko.component || {};
com.hiyoko.component.InputFlow = function(){};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.component.InputFlow);
com.hiyoko.component.InputFlow.Events = {
	Finish: 'com-hiyoko-component-InputFlow-Finish'
};

com.hiyoko.component.InputFlow.prototype.buildComponents = function(components) {
	var $flows = this.$html.children();
	
	this.currentInput = 0;
	this.inputFlows = com.hiyoko.util.mergeArray(
			components, $flows, 
			function(app, dom){return new app(dom);});
	for(var i = 1; i < $flows.length; i++) {
		$($flows[i]).hide();
	}
};

com.hiyoko.component.InputFlow.prototype.bindEvents = function() {
	this.$html.on(com.hiyoko.component.InputFlow.Child.Events.GoBack, function(e){
		this.currentInput--;
		this.inputFlows[this.currentInput + 1].disable(com.hiyoko.component.InputFlow.Child.SPEED);
		this.inputFlows[this.currentInput].open(this.collectValues());
		e.stopPropagation()
	}.bind(this));
	
	this.$html.on(com.hiyoko.component.InputFlow.Child.Events.GoNext, function(e){
		this.currentInput++;
		var params = this.collectValues();
		if(this.currentInput === this.$html.children().length) {
			this.$html.trigger(new $.Event(com.hiyoko.component.InputFlow.Events.Finish, {value: params}));
		} else {
			this.inputFlows[this.currentInput - 1].disable(com.hiyoko.component.InputFlow.Child.SPEED);
			this.inputFlows[this.currentInput].open(params);
		}
		e.stopPropagation()
	}.bind(this));
};

com.hiyoko.component.InputFlow.prototype.collectValues = function() {
	var params = {};
	var tmp;
	for(var i = 0; i < this.currentInput; i++) {
		tmp = this.inputFlows[i].getValue();
		params[tmp.key] = tmp.value;
	}
	return params;
};

com.hiyoko.component.InputFlow.Child = function(){};
com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.component.InputFlow.Child);
com.hiyoko.component.InputFlow.Child.Events = {
	GoNext: 'com-hiyoko-component-InputFlow-Child-GoNext',
	GoBack: 'com-hiyoko-component-InputFlow-Child-GoBack'
};
com.hiyoko.component.InputFlow.Child.SPEED = 500;

com.hiyoko.component.InputFlow.Child.prototype.open = function(params){
	this.$html.show(com.hiyoko.component.InputFlow.Child.SPEED);
	this.setComponent(params);
};

com.hiyoko.component.InputFlow.Child.prototype.setComponent = function(params) {
	console.log(params);
}

com.hiyoko.component.InputFlow.Child.prototype.getValue = function() {
	var value = {};
	var id = this.id + '-';
	this.$html.find('input').each(function(index) {
		var key = $(this).attr('id').replace(id, '');
		var val = $(this).val();
		value[key] = val;
	});
	this.$html.find('textarea').each(function(index) {
		var key = $(this).attr('id').replace(id, '');
		var val = $(this).val();
		value[key] = val;
	});
	
	return {
		key: this.id.split('-').pop(),
		value: value
	}
}

com.hiyoko.component.InputFlow.Child.prototype.goNext = function(params){
	this.$html.trigger(new $.Event(com.hiyoko.component.InputFlow.Child.Events.GoNext));
};

com.hiyoko.component.InputFlow.Child.prototype.goBack = function(params){
	this.$html.trigger(new $.Event(com.hiyoko.component.InputFlow.Child.Events.GoBack));
};

