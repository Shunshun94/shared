var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.ReplayV3 = class {
	constructor ($dom = $('body'), opt = {}) {
		const $notes = $dom.find('.note');
		const button = opt.button || '※';
		const clazz = opt.class || '';
		$notes.each((i, v) => {
			const $tag = $(v);
			$tag.prop('id', `note-${i}`);
			$tag.before(`<sup class="note-sup ${clazz}" title="${i}">${button}</sup>`);
		});
		$dom.click((e) => {
			const $tag = $(e.target);
			if($tag.hasClass('note-sup')) {
				const id = `#note-${$tag.prop('title')}`;
				$(id).show(100);
			} else {
				$notes.hide(100);
			}
		});
		if(opt.tab1Remove) {
			$('.tab1:first').append(`<span class="io-github-shunshun94-trpg-ReplayV3-removetab1">×</span>`);
			$('.io-github-shunshun94-trpg-ReplayV3-removetab1').click((e)=>{
				if(confirm('雑談をすべて消しますか？')) {
					$('.tab1').remove();
				}
			});
		}
	}
};

io.github.shunshun94.trpg.ReplayV3.calcDeme = (name, expectWord='') => {
  var list = [];
  $('p.tab0').filter((i, v)=>{
    return ($(v).find('.name').text().indexOf(name) > -1) && (((! expectWord) && ($(v).find('.message').text().indexOf('2D6') > -1)) || ($(v).find('.message').text().indexOf(expectWord) > -1))
  }).each((i, v)=>{
    const text = $(v).find('.message').text();
    const execResult = /\[(\d,\d.*)\]/.exec(text);
    if(execResult){
      execResult[1].split(' ').map((v)=>{
        const nums = v.split(',');
        list.push(Number(nums[0])+Number(nums[1]));
      });
    }
  });
  console.log((list.reduce((a,b)=>{return a+b}, 0) / list.length), list.length);
};

io.github.shunshun94.trpg.ReplayV3.getNameList = () => {
	let names = {};
	$('.name').each((i,v)=>{
		const name = $(v).text();
		if(names[name]) {
			names[name]++;
		} else {
			names[name] = 1;  
		}
	});
	return names;
};

io.github.shunshun94.trpg.ReplayV3.readTextWithVoice = (elem, pitchMap={}) => {
	const ssu = new SpeechSynthesisUtterance();
	ssu.lang = 'ja-JP';

	const $elem = $(elem);
	$elem.find('.note').remove();
	$elem.find('sup').remove();
	const $name = $elem.find('.name');
	const talker = $name.length ? $name.text() : '';
	if(talker && pitchMap[talker]) {
		ssu.pitch = pitchMap[talker];
	}
	const message = talker ? $elem.find('.message').text() : $elem.text();
	ssu.text = message;
	speechSynthesis.speak(ssu);
};

io.github.shunshun94.trpg.ReplayV3.readTextsWithVoice = (elems, pitchMap={}) => {
	elems.each((i,v)=>{
		io.github.shunshun94.trpg.ReplayV3.readTextWithVoice(v, pitchMap);
	});
};