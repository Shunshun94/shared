const readKozip = (file) => {
	var jszip = new JSZip();
	return new Promise((resolve, reject)=>{
		jszip.loadAsync(file).then((zip)=>{
			zip.file('data.xml').async("string").then((rawContent)=>{
				resolve((new DOMParser()).parseFromString(rawContent, 'text/xml'));
            });
        });
    });
};

const fileLoad = (e) => {
    console.log(e.dataTransfer, [...e.dataTransfer.items]);
    e.stopPropagation();
    e.preventDefault();
    const targetFile = e.dataTransfer.items[0];
    readKozip(targetFile).then((dom) => {
        console.log(dom);
    });
};

const download = (text, title, fileType = 'application/json') => {
	const url = window.URL.createObjectURL(new Blob([ text ], { "type" : `${fileType}};charset=utf-8;` }));
	const dlLink = document.createElement("a");
	document.body.appendChild(dlLink);
	dlLink.download = title;
	dlLink.href = url;
	dlLink.click();
	dlLink.remove();
	URL.revokeObjectURL(url);
}
