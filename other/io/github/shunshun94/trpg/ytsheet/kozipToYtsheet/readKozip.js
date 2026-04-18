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
    console.log(e.dataTransfer);
    e.stopPropagation();
    e.preventDefault();
    const targetFile = e.dataTransfer.items[0];
    readKozip(targetFile).then((dom) => {
        console.log(dom);
    });
};
