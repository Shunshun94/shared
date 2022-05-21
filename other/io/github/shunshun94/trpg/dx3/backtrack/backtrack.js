var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.dx3 = io.github.shunshun94.trpg.dx3 || {};
io.github.shunshun94.trpg.dx3.BackTrack = io.github.shunshun94.trpg.dx3.BackTrack || {};

io.github.shunshun94.trpg.dx3.BackTrack.calcBackTrackHistogram = (dice, opt_printFunction) => {
  var printFunction = opt_printFunction || io.github.shunshun94.trpg.dx3.BackTrack.dummy;
  if(dice < 2) {
	  printFunction(io.github.shunshun94.trpg.dx3.BackTrack.dummyArray);
	  return [[1], [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
  }
  
  var result_current_dice = [];
  var result = io.github.shunshun94.trpg.dx3.BackTrack.calcBackTrackHistogram(dice - 1, printFunction);
  
  var temp_len = 1 + dice*10;
  for(var i = 0; i < temp_len; i++) {
	  result_current_dice.push(0);
  }
  
  temp_len = result[dice - 1].length;
  for(var i = dice - 1; i < temp_len; i++) {
	  for(var j = 1; j < 11; j++) {
		  result_current_dice[i + j] += result[dice - 1][i];
	  }
  }
  printFunction(result_current_dice);
  result.push(result_current_dice);
  return result;
};

io.github.shunshun94.trpg.dx3.BackTrack.calcPercentage = (maxDice) => {
	var histgram = io.github.shunshun94.trpg.dx3.BackTrack.calcBackTrackHistogram(maxDice);
	var result = [];
	for(var i = 0; i < histgram.length; i++){
		result.push(io.github.shunshun94.trpg.dx3.BackTrack.calcPercentageSingle_(i, histgram[i]));
	}
	return result;
};

io.github.shunshun94.trpg.dx3.BackTrack.calcPercentageSingle_ = (dice, array) => {
	var all = Math.pow(10, dice);
	var result = [];
	var sum = all;
	for(var i = 0; i < array.length; i++){
		result.push((sum / all) * 100);
		sum -= array[i];
	}
	return result;
};

io.github.shunshun94.trpg.dx3.BackTrack.dummy = (r) => {};
io.github.shunshun94.trpg.dx3.BackTrack.dummyArray = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

io.github.shunshun94.trpg.dx3.BackTrack.rendTable = ($element, opt_dice, opt_length) => {
	var dice = opt_dice || 39;
	var rowLen = opt_length || 200;
	var resultHtmls = [];
	var pList = io.github.shunshun94.trpg.dx3.BackTrack.calcPercentage(dice);
	var header = "<tr>";
	for(var i = 0; i < pList.length; i++) {
		if(i % 10 === 0){
			header += "<th>侵蝕率</th>";
		}
		header += `<th class="d${i}">${i}D10</th>`;
	}
	header += "</tr>\n"

	for(var i = 0; i < rowLen; i++) {
		const erosion = `p${i + 99}`;
		resultHtmls.push("<tr>");
		if(i % 30 === 0){
			resultHtmls[i] = header + resultHtmls[i];
		}
		for (var j = 0; j < pList.length; j++) {
			if(j % 10 === 0){
				resultHtmls[i] += `<th class="${erosion}">${i + 99}%</th>`;
			}
			if(pList[j][i] | pList[j][i] >= 0) {
				resultHtmls[i] += `<td class="${erosion} d${j}">${Math.floor(pList[j][i])}%</td>`;
			} else {
				resultHtmls[i] += `<td class="${erosion} d${j}">0%</td>`;
			}
		}
		resultHtmls[i] += "</tr>\n";
		
	}
	$element.innerHTML = "<table border='1'>\n" + resultHtmls.join("") + "</table>";
	return $element.getElementsByTagName('table')[0];
};
