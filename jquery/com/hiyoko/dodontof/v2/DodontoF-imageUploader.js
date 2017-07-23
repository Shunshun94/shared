var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.DodontoF = com.hiyoko.DodontoF || {};
com.hiyoko.DodontoF.V2 = com.hiyoko.DodontoF.V2 || {};

// http://www.dodontof.com/DodontoF/README.html#webIf_uploadImageData
com.hiyoko.DodontoF.V2.ImageUploader = function($html, opt_defaultTags) {
	var defaultTags = opt_defaultTags || '';
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	this.$selector = this.getElementById('selectpic');
	this.$tags = this.getElementById('tags');
	this.$execute = this.getElementById('upload');
	
	this.canvas = document.querySelector('#' + this.id + '-canvas');
	
	this.$tags.val(defaultTags)
	this.canvas.width = 100;
	this.canvas.height = 100;
	this.canvas.getContext('2d').clearRect(0, 0, 100, 100);
	
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.DodontoF.V2.ImageUploader);

com.hiyoko.DodontoF.V2.ImageUploader.prototype.bindEvents = function() {
	this.$selector.change(function(e) {
		this.previewPic(this.$selector.prop('files')[0]);
	}.bind(this));
	
	this.$execute.click(function(e) {
		var formData = new FormData();
		var smallImage = this.canvas.toDataURL('image/png').replace('data:image/png;base64,', '');
		var data = {
			fileData: this.$selector.prop('files')[0],
			tags: this.$tags.val(),
			smallImageData: smallImage
		};
		
		var event = this.getAsyncEvent('tofRoomRequest', {method: 'uploadPicture', args: data}).done(function(result) {
			var object = {};
			object.message = result.result;
			object.sentData = result.sentData || {};
			if(result.result === 'OK') {
				object.fileName = result.fileName;
				this.fireEvent(new $.Event(com.hiyoko.DodontoF.V2.ImageUploader.Event.DONE, object));
			} else {
				this.fireEvent(new $.Event(com.hiyoko.DodontoF.V2.ImageUploader.Event.FAIL, object));
			}			
		}.bind(this)).fail(function(result) {
			var object = {};
			object.message = result.result;
			object.sentData = result.sentData || {};
			if(result.result === 'OK') {
				this.fireEvent(new $.Event(com.hiyoko.DodontoF.V2.ImageUploader.Event.NO_PATH, object));
			} else {
				this.fireEvent(new $.Event(com.hiyoko.DodontoF.V2.ImageUploader.Event.FAIL, object));
			}			
		}.bind(this));
		this.fireEvent(event);
	}.bind(this));
};

com.hiyoko.DodontoF.V2.ImageUploader.prototype.previewPic = function(file) {
	var fileRdr = new FileReader();
	if(! Boolean(file)){
		return;
	}
	fileRdr.onloadend = function() {
		var size = 100;
		var image = new Image();
		image.onload = function() {
			var width = size;
			var height = image.height * (size/image.width);
			if( height > width ) {
			    width = image.width * (size/image.height);
			    height = size;
			}
			
			this.canvas.width = width;
			this.canvas.height = height;
			this.canvas.getContext('2d').drawImage(image, 0, 0, width, height);
		}.bind(this);
		image.src = fileRdr.result;
	}.bind(this);
	fileRdr.readAsDataURL(file);
};

com.hiyoko.DodontoF.V2.ImageUploader.Event = {
	DONE: 'com-hiyoko-dodontof-v2-imageuploader-event-done',
	NO_PATH: 'com-hiyoko-dodontof-v2-imageuploader-event-no-path',
	FAIL: 'com-hiyoko-dodontof-v2-imageuploader-event-fail'
};

com.hiyoko.DodontoF.V2.ImageUploader.getBaseDom = function(opt_id, opt_class) {
	var id = opt_id || 'dodontof-imageUploader';
	var clazz = opt_class || 'dodontof-imageUploader';
	return com.hiyoko.util.format('<div id="%s" class="%s">' +
			'<input type="file" id="%s-selectpic" class="%s-selectpic" name="fileData" accept="image/*"><br/>' +
			'タグ：<input id="%s-tags" class="%s-tags" value="キャラクター画像" /><br/>' +
			'<canvas id="%s-canvas" class="%s-canvas"></canvas><br/>' +
			'<button id="%s-upload" class="%s-upload">アップロードする</button></div>"',
			id, clazz, id, clazz, id, clazz, id, clazz, id, clazz);
};


