var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.component = com.hiyoko.component || {};
com.hiyoko.component.TableBase = function($html){
	this.$html = $($html);
	this.id = this.$html.attr('id');
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.component.TableBase);

com.hiyoko.component.TableBase.prototype.renderTable = function(cols, opt_data){
	var headerClass = this.id + '-header';
	this.memberClass = this.id + '-member';
	this.cols = cols;
	
	this.$html.empty();
	var $body = $('<tbody></tbody>');
	$body.attr('id', this.id + '-body');
	
	this.$html.append($body);
	
	var $header = $('<tr></tr>')
	$header.addClass(headerClass);
	
	this.cols.forEach(function(col, i){
		var $col = $('<th></th>');
		$col.addClass(headerClass + '-' + i);
		$col.text(col.title);
		$header.append($col);
	}.bind(this));
	
	$body.append($header);
	
	if(! this.isSimpleTable) {
		var $util = $(com.hiyoko.util.format('<tr colspan="%s"></tr>', this.cols.length));
		$util.append(com.hiyoko.util.format(
				'<button style="display:inline-block" id="%s">ADD</button>' +
				'<button style="display:inline-block" id="%s">REMOVE</button>',
				this.id + '-add',
				this.id + '-remove'));
		$util.addClass(this.id + '-util');
		
		$body.append($util);
		this.addTotal();
	}

	

	this.getStorage('data', function(storage_data) {
		var data = opt_data || storage_data;
		if(data && data.length > 0) {
			data.forEach(function(line) {
				this.addMember();
				this.setLine(line);
			}.bind(this));
			if(this.calcTotal) {
				this.setTotal(this.calcTotal());
			}
		} else {
			this.addMember();			
		}
		this.bindSharedEvent();
	}.bind(this));
};

com.hiyoko.component.TableBase.prototype.addTotal = function() {
	var isTotalRequired = false;
	var totalId = this.id + '-total';
	var totalClass = 'com-hiyoko-component-table-base-total';
	
	if(this.calcTotal) {
		var $tr = $('<tr></tr>');
		$tr.attr('id', totalId);
		$tr.addClass(totalClass);
		
		this.cols.forEach(function(){
			$tr.append('<td></td>');
		});
		
		this.getElementsByClass('util').before($tr);
	}
};

com.hiyoko.component.TableBase.prototype.setTotal = function(result) {
	var trs = this.getElementById('total').children();
	result.forEach(function(v, i) {
		$(trs[i]).text(v);
	});
};

com.hiyoko.component.TableBase.prototype.addMember = function() {
	var $member = $('<tr></tr>')
	$member.addClass(this.memberClass);
	const trIndex = this.getElement(`.${this.memberClass}`).length;
	if(Boolean(this.unsortable)) {
		$member.addClass(`${this.memberClass}-tr-${trIndex}`);
	}
	
	this.cols.forEach(function(col, i){
		var $col = $('<td></td>');
		$col.addClass(this.memberClass + '-' + i);
		if(Boolean(this.unsortable)) {
			$col.addClass(`${this.memberClass}-${trIndex}-${i}`);
		}
		var $input = false;
		if(col.type === 'text') {
			$input = $('<input value="" type="text" name="' + i + '" class="com-hiyoko-component-table-base-member-text" />');
		} else if (col.type === 'number') {
			$input = $('<input value="0" type="number" name="' + i + '" class="com-hiyoko-component-table-base-member-number" />');
		} else if (col.type === 'check') {
			$input = $('<input type="checkbox" name="' + i + '" class="com-hiyoko-component-table-base-member-check" />');
		} else if (col.type === 'button') {
			$input = $('<input type="button" name="' + i + '" class="com-hiyoko-component-table-base-member-button" value="' + col.text + '" />');
		} else if (col.type === 'auto') {
			$col.css('background-color', '#E0E0E0');
		}
		
		if(col.autocomplete) {
			$input.attr({'autocomplete': 'on', 'list': col.autocomplete.attr('id')})
		}
		
		if($input) {
			$col.append($input);
		}
		$member.append($col);
	}.bind(this));
	if(this.getElementById('total').length){
		this.getElementById('total').before($member);
	} else if (this.getElementsByClass('util').length){
		this.getElementsByClass('util').before($member);
	} else {
		this.getElement('tbody').append($member);
	}
};

com.hiyoko.component.TableBase.prototype.clear = function() {
	this.getElementsByClass('member').remove();
	if(this.calcTotal) {
		this.setTotal(this.calcTotal());
	}
};

com.hiyoko.component.TableBase.prototype.bindSharedEvent = function() {
	this.getElementById('add').click(this.addMember.bind(this));
	this.getElementById('remove').click(function(e) {
		this.getElementsByClass('member:last').remove();
		this.setStorage('data', this.getTableValue());
		if(this.calcTotal) {
			this.setTotal(this.calcTotal());
		}
	}.bind(this));
	
	this.$html.change(function(e) {
		var $tr = $(e.target);
		var num = Number($tr.attr('name'));
		var inputValue = $tr.val();
		
		while(! $tr.hasClass(this.memberClass)) {
			$tr = $tr.parent();
		}
		
		var inputTrigger = (this[this.cols[num].inputTrigger] || this.defaultInputTrigger).bind(this);
		
		inputTrigger(inputValue, $tr, function(){
			var vals = this.getLine($tr);
			var $tds = $tr.children();
			this.cols.forEach(function(v, i){
				if(v.type === 'auto') {
					$($tds[i]).text(this[v.func](vals));
				}
			}.bind(this));
			
			if(this.calcTotal) {
				this.setTotal(this.calcTotal(e));
			}
			this.setStorage('data', this.getTableValue());
		}.bind(this));
	}.bind(this));
	
	if(! Boolean(this.unsortable)) {
		this.getElementById('body').sortable();
	}
};

com.hiyoko.component.TableBase.prototype.defaultInputTrigger = function(val, $tr, callback) {callback();};

com.hiyoko.component.TableBase.prototype.getLine = function($tr) {
	var vals = $tr.children();
	var result = [];
	this.cols.forEach(function(v, i){
		if(v.type === 'text') {
			result.push($($(vals[i]).find('input')[0]).val());
		} else if (v.type === 'number') {
			result.push($($(vals[i]).find('input')[0]).val());
		} else if (v.type === 'check') {
			result.push($($(vals[i]).find('input')[0]).prop('checked'));
		} else if (v.type === 'button') {
			result.push('');
		} else if (v.type === 'auto') {
			result.push($(vals[i]).text());
		}
	});
	return result;
};

com.hiyoko.component.TableBase.prototype.setLine = function(line, opt_$tr) {
	var vals = (opt_$tr || this.getElementsByClass('member:last')).children();
	this.cols.forEach(function(v, i){
		if(line[i] !== null && line[i] !== undefined) {
			if(v.type === 'text') {
				$($(vals[i]).find('input')[0]).val(line[i]);
			} else if (v.type === 'number') {
				$($(vals[i]).find('input')[0]).val(line[i]);
			} else if (v.type === 'check') {
			} else if (v.type === 'button') {
			} else if (v.type === 'auto') {
				$(vals[i]).text(line[i]);
			}
		}
	});
};

com.hiyoko.component.TableBase.prototype.getTableValue = function() {
	var result = [];
	$.each(this.getElementsByClass('member'), function(i, v) {
		result.push(this.getLine($(v)));
	}.bind(this));
	return result;
};

com.hiyoko.component.TableBase.prototype.calcTotal = undefined;

