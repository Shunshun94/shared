$('body').append(`<input id="tmp" type="text" style="position:absolute;top:-180px;" />`)
$('h2, h3, h4').each((i,v)=>{
	$(v).text(`${$(v).text()} ⚓`);
});
$('h2, h3, h4').click((e)=>{
	const dom = $(e.target);
	const id = dom.attr('id');
	$('#tmp').val(`${location.protocol}//${location.host}${location.pathname}#${id}`);
	$('#tmp').select();
	document.getElementById('tmp').setSelectionRange(0, $('#tmp').val().length);
	document.execCommand('copy');
	alert('この節へのリンクをコピーしました');
});

if(location.hash && $(location.hash).length) {
    $(location.hash).css('background-color', 'yellow');
    setTimeout(()=>{$(location.hash).css('background-color', '');},       250);
    setTimeout(()=>{$(location.hash).css('background-color', 'yellow');}, 500);
    setTimeout(()=>{$(location.hash).css('background-color', '');},      1000);
    setTimeout(()=>{$(location.hash).css('background-color', 'yellow');},1500);
    setTimeout(()=>{$(location.hash).css('background-color', '');},      2500);
    setTimeout(()=>{$(location.hash).css('background-color', 'yellow');},3500);
    setTimeout(()=>{$(location.hash).css('background-color', '');},      5000);
    setTimeout(()=>{$(location.hash).css('background-color', 'yellow');},6500);
    setTimeout(()=>{$(location.hash).css('background-color', '');},      8500);
}
