var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.discord = io.github.shunshun94.trpg.discord || {};
io.github.shunshun94.trpg.discord.LogPicker = io.github.shunshun94.trpg.discord.LogPicker || {};
var $ = $ || {};
var jQuery = jQuery || {};

io.github.shunshun94.trpg.discord.LogPicker.EVENTS = {
	ConsoleUpdate: 'io-github-shunshun94-trpg-discord-LogPicker-console'
};

io.github.shunshun94.trpg.discord.LogPicker.fireEvent = (element, eventObject) => {
	eventObject.level = eventObject.level || eventObject.LEVEL || eventObject.Level || 'INFO';
	const eventName = io.github.shunshun94.trpg.discord.LogPicker.EVENTS.ConsoleUpdate;
	if ( (element instanceof $) || (element instanceof jQuery) ) {
		eventObject.type = eventName;
		return element.trigger(eventObject);
	} else if (document.createEvent) {
		const event = new CustomEvent(eventName, {
			detail: eventObject
		});
		return element.dispatchEvent(event);
	} else {
		var event  = document.createEvent('CustomEvent');
		event.initCustomEvent('eventName', false, false, eventObject);
		return element.fireEvent(eventName, eventObject)
	}
};

io.github.shunshun94.trpg.discord.LogPicker.getLogRecursive = ($console, client, lastId=1, currentArray=[], retryCount=0, maxRetry=5)=>{
	const nextRetryCount = retryCount + 1;
	io.github.shunshun94.trpg.discord.LogPicker.fireEvent($console, {
		msg: `MSGID ${lastId} から100件のメッセージを取得中 (${nextRetryCount}回目の取得試行)`
	});

	return new Promise((resolve, reject)=>{
		client.getChat(lastId).then((result)=>{
			if(result.result === 'OK') {
				if(result.chatMessageDataLog.length) {
					const nextLastId = result.chatMessageDataLog.reverse()[0][1].uniqueId;
					io.github.shunshun94.trpg.discord.LogPicker.getLogRecursive($console, client, nextLastId, currentArray.concat(result.chatMessageDataLog.reverse()), 0, maxRetry).then((result)=>{
						resolve(result);
					}, (err)=>{
						reject(err);
					});
				} else {
					io.github.shunshun94.trpg.discord.LogPicker.fireEvent($console, {
						msg: `取得完了! (全${currentArray.length}件)`
					});
					resolve(currentArray);
				}
			} else {
				if(nextRetryCount >= maxRetry) {
					reject(err, client, lastId, currentArray, retryCount, maxRetry);
				}
				io.github.shunshun94.trpg.discord.LogPicker.getLogRecursive($console, client, lastId, currentArray, retryCount + 1, maxRetry).then((result)=>{
					resolve(result);
				}, (err)=>{
					reject(err);
				});
			}
		}, (err)=>{
			console.error(`FAILED getLogRecursive: lastId = ${lastId}, retryCount = ${retryCount}`, err);
			if(nextRetryCount >= maxRetry) {
				console.error(`FAILED getLogRecursive: もうむりぽ`);
				reject(err);
			} else {
				io.github.shunshun94.trpg.discord.LogPicker.fireEvent($console, {
					msg: `ログの取得に失敗しました。${(retryCount + 1)}秒後に再取得します`,
					level: 'WARN'
				});
				setTimeout(()=>{
					io.github.shunshun94.trpg.discord.LogPicker.getLogRecursive($console, client, lastId, currentArray, retryCount + 1, maxRetry).then((result)=>{
						resolve(result);
					}, (err)=>{
						reject(err);
					});
				}, (retryCount + 1) * 1000);
			}
		});
	});
};

io.github.shunshun94.trpg.discord.LogPicker.generateUrl = (data, type="text/plain;charset=utf-8;") => {
	const blob = new Blob([ data ], { "type" : type });
	const url = window.URL.createObjectURL(blob);
	return url;
};

io.github.shunshun94.trpg.discord.LogPicker.appendDLLink = ($console, url, donwloadText, filename) => {
	const downloadFileName = filename ? filename : donwloadText;
	const $a = $('<a></a>');
	const dummy = $('<div></div>')
	$a.text(donwloadText);
	$a.attr('href', url);
	$a.attr('target', '_blank');
	$a.attr('download', downloadFileName);
	dummy.append($a);
	io.github.shunshun94.trpg.discord.LogPicker.fireEvent($console, {
		msg: dummy.html()
	});
};

io.github.shunshun94.trpg.discord.LogPicker.convertMsgToCommonHtml = (msg, isColored)=>{
	const style = isColored ? `style="color:hsl(${Number(msg[1].metadata.senderId) % 360}, 100%, 25%);"` : '';
	const time = new Date(msg[0]);
	const attachements = msg[1].metadata.attachments.map((item)=>{
		const isPic = io.github.shunshun94.CONSTS.PIC_SUFFIX.filter((suffix)=>{
			return item.filename.endsWith(suffix);
		}).length;
		if(isPic) {
			if(item.width > 800) {
				item.height *= 800 / item.width;
				item.width = 800;
			}
			return `<img alt="${item.filename}" src="${item.url}" height="${item.height}" width="${item.width}" />`;
		} else {
			return `<a href="${item.url}" target="_blank">${item.filename}</a>`;
		}
	}).join('<br/>');
	return `<p class="tab0 _${msg[1].metadata.senderId}" ${style} id="msgId_${msg[1].uniqueId}">
	<span class="time"><span class="unixTime">${msg[0]}</span>
	<span class="readbleTime redableTime">${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}</span></span>
	<span class="name">${msg[1].senderName}</span>
	<span class="message">${msg[1].message.replace(/\n/gm, '<br/>\n')}</span>
	${attachements}</p>`
};

io.github.shunshun94.trpg.discord.LogPicker.htmlConverterHiyoAppRegExp = /^\*?\*?([^「:：\n\*]+)\*?\*?[:：]\s?/;
io.github.shunshun94.trpg.discord.LogPicker.htmlConverterParenthesisRegExp = /^([^「\n]+)「/;
io.github.shunshun94.trpg.discord.LogPicker.convertMsgToHiyoHtml = (msg, isColored)=>{
	const appRegExpResult = io.github.shunshun94.trpg.discord.LogPicker.htmlConverterHiyoAppRegExp.exec(msg[1].message);
	const preRegExpResult = io.github.shunshun94.trpg.discord.LogPicker.htmlConverterParenthesisRegExp.exec(msg[1].message);
	const time = new Date(msg[0]);
	const style = isColored ? `style="color:hsl(${Number(msg[1].metadata.senderId) % 360}, 100%, 25%);"` : '';

	const attachements = msg[1].metadata.attachments.map((item)=>{
		const isPic = io.github.shunshun94.CONSTS.PIC_SUFFIX.filter((suffix)=>{
			return item.filename.endsWith(suffix);
		}).length;
		if(isPic) {
			if(item.width > 800) {
				item.height *= 800 / item.width;
				item.width = 800;
			}
			return `<img alt="${item.filename}" src="${item.url}" height="${item.height}" width="${item.width}" />`;
		} else {
			return `<a href="${item.url}" target="_blank">${item.filename}</a>`;
		}
	}).join('<br/>');

	if(appRegExpResult && (! msg[1].message.startsWith('http'))) {
		const name = appRegExpResult[1];
		let clazz = '_';
		for(var i = 0; i < name.length; i++) {
			clazz += String(name.charCodeAt(i));
		}
		return `<p class="tab0 _${msg[1].metadata.senderId} ${clazz}" ${style} id="msgId_${msg[1].uniqueId}">
		<span class="time"><span class="unixTime">${msg[0]}</span>
		<span class="readbleTime redableTime">${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}</span></span>
		<span class="name">${name}<!-- ${msg[1].senderName} --></span>
		<span class="message">${msg[1].message.replace(appRegExpResult[0], '').replace(/\n/gm, '<br/>\n')}</span>
		${attachements}</p>`
	} else if(preRegExpResult && (! msg[1].message.startsWith('http'))) {
		const name = preRegExpResult[1];
		let clazz = '_';
		for(var i = 0; i < name.length; i++) {
			clazz += String(name.charCodeAt(i));
		}
		return `<p class="tab0 _${msg[1].metadata.senderId} ${clazz}" ${style} id="msgId_${msg[1].uniqueId}">
		<span class="time"><span class="unixTime">${msg[0]}</span>
		<span class="readbleTime redableTime">${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}</span></span>
		<span class="name">${name}<!-- ${msg[1].senderName} --></span>
		<span class="message">「${msg[1].message.replace(preRegExpResult[0], '').replace(/\n/gm, '<br/>\n')}</span>
		${attachements}</p>`
	} else {
		return `<p class="tab0 _${msg[1].metadata.senderId}" ${style} id="msgId_${msg[1].uniqueId}">
		<span class="time"><span class="unixTime">${msg[0]}</span>
		<span class="readbleTime redableTime">${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}</span></span>
		<span class="name">${msg[1].senderName}</span>
		<span class="message">${msg[1].message.replace(/\n/gm, '<br/>\n')}</span>
		${attachements}</p>`
	}
};