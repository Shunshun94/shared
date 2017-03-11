var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.component = com.hiyoko.component || {};
com.hiyoko.component.UlList = function($html){};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.component.UlList);

com.hiyoko.component.UlList.prototype.renderDefaultLi = function($li, item) {
	if(item.type !== 'node') {
		var $text = $('<span></span>')
		$text.text(item.text);
		$text.addClass('com-hiyoko-component-ul-list-li-text');
		$li.append($text);
	}
	$li.attr('title', item.value);
	return $li;
}

com.hiyoko.component.UlList.prototype.buildList = function(list, opt_option) {
	this.$html.empty();
	var $ul = $('<ul></ul>');
	var option = opt_option || {renderer: this.renderDefaultLi.bind(this)};
	
	list.forEach(function(item){
		var $li = $('<li></li>');
		
		$li = option.renderer($li, item, option);
		if(item.type !== 'leaf') {
			var tmpOption = opt_option || {renderer: this.renderDefaultLi.bind(this)};
			tmpOption.child = true;
			$li.append(this.buildList(item.list, tmpOption)); 
		}
		if(option.child) {
			$li.addClass('com-hiyoko-component-ul-list-li-child');
		} else {
			$li.addClass('com-hiyoko-component-ul-list-li');
		}
		
		$ul.append($li);
	}.bind(this));
	this.$html.append($ul);
	return $ul;
};

com.hiyoko.component.UlList.prototype.getValueLi = function($li) {
	var result = {};
	
	var text = $li.children('.com-hiyoko-component-ul-list-li-text').text();
	result.text = text;
	
	var $ul = $li.children('ul');
	if($ul.length) {
		result.list = this.getValue($ul);
	}
	
	if(result.text && result.list) {
		result.type = 'namednode';
	} else if(result.list) {
		result.type = 'node';
	} else {
		result.type = 'leaf';
	}
	
	return result;
};

com.hiyoko.component.UlList.prototype.getValue = function(opt_$html) {
	if(opt_$html) {
		var $html = $(opt_$html);
		var result = [];
		$.each($html.children('li'), function(i, v){
			result.push(this.getValueLi($(v)));
		}.bind(this));
		return result;
	} else {
		return this.getValue(this.$html.children('ul'));
	}
};
