var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.tof = com.hiyoko.tof || {};

com.hiyoko.tof.ImageUploader = function($baseHtml, opt_options) {
	var $html = $baseHtml;
	var id = $html.attr('id');
	var options = opt_options || {};
	
	var $selector = $('#' + id + '-selectpic');
	var $tags = $('#' + id + '-tags');
	var $upload  = $('#' + id + '-upload');
	var canvas = document.querySelector('#' + id + '-canvas');

	$tags.val(options.tags || 'キャラクター画像')
	canvas.width = 100;
	canvas.height = 100;
	canvas.getContext('2d').clearRect(0, 0, 100, 100);
	
	this.previewPic = function(file) {
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
				
				canvas.width = width;
				canvas.height = height;
				canvas.getContext('2d').drawImage(image, 0, 0, width, height);
			}.bind(this);
			image.src = fileRdr.result;
		}.bind(this);
		fileRdr.readAsDataURL(file);
	};
	
	this.uploadDone = function(result, args) {
		var sendObject = {};
		sendObject.message = result.result;
		sendObject.params = args;
		if(result.result === 'OK') {
			sendObject.fileName = result.fileName;
			$html.trigger(new $.Event(com.hiyoko.tof.ImageUploader.Events.DONE, sendObject));
		} else {
			$html.trigger(new $.Event(com.hiyoko.tof.ImageUploader.Events.FAIL, sendObject));
		}
	};

	this.uploadFail = function(result, args) {
		var sendObject = {};
		sendObject.message = result.result || '';
		sendObject.params = args;
		
		if(sendObject.message.startsWith('[ERROR]')) {
			$html.trigger(new $.Event(com.hiyoko.tof.ImageUploader.Events.FAIL, sendObject));
		} else {
			$html.trigger(new $.Event(com.hiyoko.tof.ImageUploader.Events.NO_PATH, sendObject));
		}
	};

	this.bindEvents = function() {
		$selector.change(function(e) {
			this.previewPic($selector.prop('files')[0]);
		}.bind(this));

		$upload.click(function(e) {
			var formData = new FormData();
			var smallImage = canvas.toDataURL('image/png').replace('data:image/png;base64,', '');
			var data = {
				fileData: $selector.prop('files')[0],
				tags: $tags.val(),
				smallImageData: smallImage
			};

			var event = new $.Event(com.hiyoko.tof.ImageUploader.Events.REQUEST, data);
			$html.trigger(event);
		}.bind(this));
	};
	
	this.bindEvents();
};

com.hiyoko.tof.ImageUploader.Events = {
	REQUEST: 'com-hiyoko-tof-imageuploader-event-request',
	DONE: 'com-hiyoko-tof-imageuploader-event-done',
	NO_PATH: 'com-hiyoko-tof-imageuploader-event-no-path',
	FAIL: 'com-hiyoko-dodontof-v2-imageuploader-event-fail'	
};

com.hiyoko.tof.ImageUploader.getBaseDom = function(opt_id, opt_class) {
	var id = opt_id || 'dodontof-imageUploader';
	var clazz = opt_class || 'dodontof-imageUploader';
	return '<div id="' + id + '" class="' + clazz + '">' +
	'<input type="file" id="' + id + '-selectpic" class="' + clazz + '-selectpic" name="fileData" accept="image/*"><br/>' +
	'タグ：<input id="' + id + '-tags" class="' + clazz + '-tags" value="" /><br/>' +
	'<canvas id="' + id + '-canvas" class="' + clazz + '-canvas"></canvas><br/>' +
	'<button id="' + id + '-upload" class="' + clazz + '-upload">アップロードする</button></div>';
};
