var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.util = com.hiyoko.util || {};

com.hiyoko.util.test = com.hiyoko.util.test || {};

/** 
 * @param {Object} target
 * @param {string} opt_desc
 */
com.hiyoko.util.rejectEmpty = function(target, opt_desc){
	var desc = opt_desc ? opt_desc : 'Inputed variable is ';
	if(typeof target === 'undefined'){
		throw new Error(desc + ' (undefined)');
	}
	if(target === null){
		throw new Error(desc + ' (null)');
	}
};

/**
 * URL の Query 部分を取得する関数 
 * @param {string} opt_query Query。
 * @return {Object.<string, string>}  Query の連想配列
 */
com.hiyoko.util.getQueries = function(opt_query) {
	var query = opt_query ? '?' + opt_query : location.search;
	var params = (query.slice(1)).split('&');
	var paramLength = params.length;
	var result = {};
	for(var i = 0; i < paramLength; i++) {
		var pair = params[i].split('=');
		result[pair[0]] = pair[1];
	}
	return result;
};

/** 
  * ランダムな文字列を作成する関数です。
  * @param {number} opt_length 生成される文字列の長さです。接頭語・接尾語の長さは含まれません
  * @param {string} opt_prefix 返り値の先頭に付く接頭語です
  * @param {string} opt_suffix 返り値の先頭に付く接尾語です
  * @return {String}
  */
com.hiyoko.util.rndString = function(opt_length, opt_prefix, opt_suffix){
	var length = opt_length || 8;
	var prefix = opt_prefix || '';
	var suffix = opt_suffix || '';
	
	var randomString = '';
	var baseString ='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for(var i=0; i<length; i++) {
		randomString += baseString.charAt( Math.floor( Math.random() * baseString.length));
	}
	return prefix + randomString + suffix;
};

/**
 * 
 * @param {string} formatString
 * @param {...string} var_args
 * @return {string} Formatted string.
 */
com.hiyoko.util.format = function(formatString, var_args) {
	var doubleBackSlash = com.hiyoko.util.rndString(12, '#', '#');
	var escapedParcentS = com.hiyoko.util.rndString(12, '#', '#');
	formatString = formatString.replace('\\\\', doubleBackSlash).replace('\\%s', escapedParcentS);
	var formatString_splited = formatString.split(/%s/);
	var len = arguments.length < formatString_splited.length ? arguments.length : formatString_splited.length;
	for(var i = 1; i < len; i++) {
		formatString_splited[i - 1] += arguments[i];
	}
	if(arguments.length < formatString_splited.length) {
		for(var i = arguments.length; i < formatString_splited.length; i++) {
			formatString_splited[i - 1] += '%s';
		}
	}
	return formatString_splited.join('').replace(doubleBackSlash, '\\').replace(escapedParcentS, '%s');
};

/**
 * 
 * @param {string} str
 * @param {number} time
 * @return {string}
 */
com.hiyoko.util.stringTimes = function(str, time){
	var text = '';
	for(var i = 0; i < time; i++){
		text += str;
	}
	return text;
}

/**
 * @param {Array} arrayA
 * @param {Array} arrayB
 * @param {Function} func
 * @return {Array} 
 */
com.hiyoko.util.mergeArray = function(arrayA, arrayB, func) {
	if(arrayA.length !== arrayB.length){
		throw new Error('arguments of margeArray are not same length.');
	}
	var result = [];
	var length = arrayA.length;
	for(var i = 0; i < length; i++){
		result.push(func(arrayA[i], arrayB[i]));
	}
	return result;
};

com.hiyoko.util.groupArray = function(array, groupBy) {
	var result = {};
	var length = array.length;
	for(var i = 0; i < length; i++) {
		groupId = groupBy(array[i], i, array);
		if(! result[groupId]) {
			result[groupId] = [];
		}
		result[groupId].push(array[i]);
	}
	return result;
}

com.hiyoko.util.forEachMap = function(map, func) {
	for(var key in map) {
		func(map[key], key, map);
	}
};

com.hiyoko.util.extend = function(superClass, subClass) {
	var list = superClass.prototype;
	for(var key in list) {
		subClass.prototype[key] = list[key];
	}
};

