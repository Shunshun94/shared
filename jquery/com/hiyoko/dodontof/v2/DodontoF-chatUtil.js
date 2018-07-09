var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.DodontoF = com.hiyoko.DodontoF || {};
com.hiyoko.DodontoF.V2 = com.hiyoko.DodontoF.V2 || {};

com.hiyoko.DodontoF.V2.VOTES_ANSWERS = ["",
                                        "賛成",
                                        "反対",
                                        "",
                                        "READY"];

com.hiyoko.DodontoF.V2.parseVoteAnswer = function(msg) {
	var value = JSON.parse(msg.replace("\n", "").replace("###vote_replay_readyOK###", "").replace(/}.* : /, "}"));
	return com.hiyoko.DodontoF.V2.VOTES_ANSWERS[value.voteReplay];
};

com.hiyoko.DodontoF.V2.parseVoteRequest = function(msg) {
	try{
		var value = JSON.parse(msg.replace("\n", "").replace("###vote###", "").replace(/}.* : /, "}"));
	}catch(e){
		return {message:"無効な質問", ready:true};
	}
	var text = value.question;
	if(value.isCallTheRoll){
		text = "準備できたらクリック";		
	}
	return {message:text, ready:value.isCallTheRoll};
};

com.hiyoko.DodontoF.V2.parseCommand = function(msg, header) {
	return JSON.parse(msg.replace("\n", "").replace(header, "").replace(/}.* : /, "}"));
};

com.hiyoko.DodontoF.V2.fixChatMsg = function(chatMsg, opt_store){
	var message;
	var store = opt_store || false;
	var vote = false;
	var ask = false;
	var ready = false;
	var cutin = false;
	var name;
	var status = '通常';
	var tab = chatMsg[1].channel;

	if(chatMsg[1].message.indexOf("###CutInCommand:rollVisualDice###") !== -1){
		message = JSON.parse(chatMsg[1].message.replace("###CutInCommand:rollVisualDice###", "")).chatMessage;
	}else{
		message = chatMsg[1].message;
	}
	
	if(message.startsWith('###Language:secretDice###')) {
		message = 'シークレットダイスを振りました';
	}
	
	if(message.startsWith('###CutInCommand:getDiceBotInfos###{}')) {
		message = 'ダイスボットを編集しました';
	}
	
	if(message.startsWith("###vote_replay_readyOK###")){
		message = com.hiyoko.DodontoF.V2.parseVoteAnswer(message);
		vote = true;
		tab = 0;
	}
	if(message.startsWith("###vote###")){
		var parsedMsg = com.hiyoko.DodontoF.V2.parseVoteRequest(message);
		vote = true;
		ask = true;
		message = parsedMsg.message;
		ready = parsedMsg.ready;
		tab = 0;
	}
	if(message.startsWith('###CutInMovie###')) {
		var parsedMsg = com.hiyoko.DodontoF.V2.parseCommand(message, '###CutInMovie###');
		
		message = parsedMsg.message;
		cutin = {
			bgm: parsedMsg.soundSource,
			loop: parsedMsg.isSoundLoop,
			pic: parsedMsg.source,
			volume: parsedMsg.volume
		};
	} else if(store) {
		cutin = store.getTailCutIn(message);
	}
	
	var TAIL_NAME_REGEXP_1 = /@([^ \f\n\r\t\v​\u00a0\u1680​\u180e\u2000-\u200a​\u2028\u2029​\u202f\u205f​\u3000\ufeff@]*)$/;
	
	var tailNameMatch_1 = TAIL_NAME_REGEXP_1.exec(message);
	if(tailNameMatch_1){
		try{
			var swapedName = chatMsg[1].senderName.split('\t');
			var swapedMsg = message;
			
			var TAIL_NAME_REGEXP_2 = new RegExp('@([^ \f\n\r\t\v​\u00a0\u1680​\u180e\u2000-\u200a​\u2028\u2029​\u202f\u205f​\u3000\ufeff@]*)@' + tailNameMatch_1[1] + '$');
			var tailNameMatch_2 = TAIL_NAME_REGEXP_2.exec(message);
			if(tailNameMatch_2){
				name = tailNameMatch_2[1].replace('@' + tailNameMatch_1[1], '');
				status = tailNameMatch_1[1];
				message = message.replace(tailNameMatch_2[0], '');
			} else {
				name = tailNameMatch_1[1];
				message = message.replace(tailNameMatch_1[0], '');
			}
			
			if(! Boolean(store.get(name))) {
				throw('Not name');
			}
			
		} catch(e) {
			var name_status = chatMsg[1].senderName.split('\t');
			name = name_status[0];
			status = name_status[1] ? name_status[1] : '通常';
			message = swapedMsg;
		}
	} else {
		var name_status = chatMsg[1].senderName.split('\t');
		name = name_status[0];
		status = name_status[1] ? name_status[1] : '通常';
	}
	
	return ({
		time:chatMsg[0],
		id: chatMsg[1].uniqueId,
		msg:message,
		color:chatMsg[1].color,
		name:name,
		status:status,
		tab:tab,
		vote: vote ? {ask: ask,ready: ready} : false,
		cutIn: cutin,
		fixed: true
	});
};

com.hiyoko.DodontoF.V2.getNameColorPairs = (rawMsgs = []) => {
	let msgs;
	if(rawMsgs.chatMessageDataLog) {
		msgs = rawMsgs.chatMessageDataLog.map((msg) => {return com.hiyoko.DodontoF.V2.fixChatMsg(msg)});
	} else if(! Array.isArray(rawMsgs)) {
		return {};
	} else if(rawMsgs.length === 0){
		return {};
	} else {
		if(! rawMsgs[0].fixed) {
			msgs = rawMsgs.map((msg) => {return com.hiyoko.DodontoF.V2.fixChatMsg(msg)}); 
		} else {
			msgs = rawMsgs;
		}
	}
	let result = {};
	msgs.forEach((m) => {
		if(result[m.name] === undefined) {
			result[m.name] = {};
		}
		if(result[m.name][m.color] === undefined) {
			result[m.name][m.color] = true;
		}
	});
	return result;
};

