var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.VampireBlood = com.hiyoko.VampireBlood || {};
com.hiyoko.VampireBlood.Client = function() {};

com.hiyoko.VampireBlood.Client.prototype.basicParse = function(json) {
	this.name = json.pc_name;
	this.title = json.data_title;
	this.id = json.data_id;
	this.memo = json.pc_making_memo;
};

com.hiyoko.VampireBlood.Client.prototype.sendRequest = function(id) {
	return $.ajax({
		type:'get',
		url:'http://charasheet.vampire-blood.net/' + id + '.js',
		async:true,
		dataType:'jsonp'
	});
};