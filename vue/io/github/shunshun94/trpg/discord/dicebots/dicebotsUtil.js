const defaultDiceBotParam = {
		title: 'ダイスボットサンプル',
		command: 'SAMPLE',
		dice: '2d6',
		tableRaw: `2:「コマンド名」をチャットに入力することで、\n表のロールができるようになります。
3:この例では「SAMPLE」と入力すれば\n実行できるようになります。
4:表のフォーマットは\nまさにここに書いてある通り、
5:　（数値）:（メッセージ）
6:になります。
7:「コマンド」をチャットで発言すると\n「ダイス」に記載したダイスを元にランダム選択されます。
8:ダイス目に合致する値が表に無い場合は空文字になります。
9:悩むより一度追加してみるのが早いでしょう。
10:他の人も使える便利な表が出来たら\n皆で共有してあげてくださいね！
11:そろそろ\n書く事無くなってきましたね…
12:以上です。`
};

const dicebotGenerator = (params = defaultDiceBotParam) => {
	let table = {};
	let currentValue = 0;
	(params.tableRaw || params.table).split('\n').forEach((v)=>{
	  const reExecResult = /(\d+):(.+)/.exec(v);
	  if(reExecResult) {
	    currentValue = Number(reExecResult[1]);
	    table[Number(reExecResult[1])] = reExecResult[2];
	  } else {
	    if(table[currentValue]) {
	      table[currentValue] += `\n${v}`;
	    }
	  }
	});
	return {
		title: params.title,
		command: params.command,
		dice: params.dice,
		table: table,
		tableRaw: params.tableRaw
	};
};
