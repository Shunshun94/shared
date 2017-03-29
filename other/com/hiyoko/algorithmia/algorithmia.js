var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.Algorithmia = function(apiKey) {
	Algorithmia.client(apiKey);
};

com.hiyoko.Algorithmia.prototype.request(url, params) {
	var paramStr = (typeof params === 'object' ? JSON.stringify(params) : params);
	
	return new Promise(function(resolve, reject) {
		client.algo(url)
	    	.pipe(paramStr)
	    	.then(function(output) {
	    		if(output.error) {
	    			reject(output.error);
	    		} else {
	    			resolve(output.result);
	    		}
	    	});
	});
};

