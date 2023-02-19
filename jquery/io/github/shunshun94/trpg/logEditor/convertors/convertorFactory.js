var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};
io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory = io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory || {};
io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.getConvertor = (file) => {
	return new Promise((resolve, reject)=>{
		if(file.name.endsWith('.zip')) {
			resolve(io.github.shunshun94.trpg.logEditor.convertors.UdonariumConvertor);
		}
		if(file.name.endsWith('.txt') || file.name.endsWith('.text')) {
			resolve(io.github.shunshun94.trpg.logEditor.convertors.RawTextConvertor);
		}
		if(file.name.endsWith('.dat')) {
			resolve(io.github.shunshun94.trpg.logEditor.convertors.ytchatConvertor);
		}
		io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.htmlHub(file).then(resolve);
	});
};

io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.isFloconSimpleLogs = (rawHtml, dom) => {
	const bodyChildren = Array.from(dom.body.children);
	if(bodyChildren.length === 1) {
		const bodyDivInternalElements = Array.from(bodyChildren[0].children);
		for(const element of bodyDivInternalElements) {
			if( (element.localName !== 'div') || (element.getAttribute('class') !== 'message') ) {
				return false;
			}
		}
		return true;
	}
	return false;
};

io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.isTekeyV1 = (rawHtml, dom) => {
	return /<body>\n\[[^\]]+\]<font\scolor=/.test(rawHtml);
};

io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.isTekeyV2 = (rawHtml, dom) => {
	return rawHtml.includes('<!--Tekeyチャットログv2-->');
};

io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.htmlHub = (file)=>{
	// Flocon base Web: 0.7.7 / Api:0.7.1
	return new Promise((resolve, reject)=>{
		io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.fileToText(file).then((rawHtml)=>{
			const dom = (new DOMParser()).parseFromString(rawHtml, 'text/html');
			if(io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.isTekeyV1(rawHtml, dom)) {
				// Tekey Chat Log V1
			}
			if(io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.isTekeyV2(rawHtml, dom)) {
				resolve(io.github.shunshun94.trpg.logEditor.convertors.TekeyV2Converter);
				return;
			}
			if(io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.isFloconSimpleLogs(rawHtml, dom)) {
				resolve(io.github.shunshun94.trpg.logEditor.convertors.FloconSimpleConvertor);
			}
			resolve(io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor);
		});
	});
};

io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.fileToText = (file)=>{
	return new Promise((resolve, reject)=>{
		file.arrayBuffer().then((result)=>{
			const codes = new Uint8Array(result);
			const rawHtml = Encoding.convert(codes, {
				to: 'unicode',
				from: Encoding.detect(codes),
				type: 'string'
			});
			resolve(rawHtml);
		});
	});
};

// https://gist.github.com/hanayashiki/8dac237671343e7f0b15de617b0051bd
(function () {
	File.prototype.arrayBuffer = File.prototype.arrayBuffer || myArrayBuffer;
	Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || myArrayBuffer;
  
	function myArrayBuffer() {
	  // this: File or Blob
	  return new Promise((resolve) => {
		let fr = new FileReader();
		fr.onload = () => {
		  resolve(fr.result);
		};
		fr.readAsArrayBuffer(this);
	  })
	}
  })();
