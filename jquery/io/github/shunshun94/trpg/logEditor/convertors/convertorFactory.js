var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.convertors = io.github.shunshun94.trpg.logEditor.convertors || {};
io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory = io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory || {};
io.github.shunshun94.trpg.logEditor.convertors.ConvertorFactory.getConvertor = (file) => {
	if(file.name.endsWith('.zip')) {
		return io.github.shunshun94.trpg.logEditor.convertors.UdonariumConvertor;
	} else {
		return io.github.shunshun94.trpg.logEditor.convertors.CcfoliaConvertor;
	}
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
