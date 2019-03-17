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
		$dom.find('sup').click((e) => {
			
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
	}
};
