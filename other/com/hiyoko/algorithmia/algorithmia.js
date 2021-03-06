var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.Algorithmia = function(apiKey) {
	this.key = apiKey;
};

com.hiyoko.Algorithmia.prototype.request = function(url, params) {
	var paramStr = (typeof params === 'object' ? JSON.stringify(params) : params);
	
	return new Promise(function(resolve, reject) {
		Algorithmia.client(this.key).algo(url)
	    	.pipe(paramStr)
	    	.then(function(output) {
	    		if(output.error) {
	    			reject(output.error);
	    		} else {
	    			resolve(output.result);
	    		}
	    	});
	}.bind(this));
};

