var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.camera = io.github.shunshun94.camera || {};

io.github.shunshun94.camera.CONSTS = {
    DEFAULT_VIDEO_SIZE: {
        width: {
            min: 1280,
            ideal: 1920,
            max: 2560,
        },
        height: {
            min: 720,
            ideal: 1080,
            max: 1440
        }
    }
};

/**
 * Getting camera device list as Promise
 * @returns Promise
 */
io.github.shunshun94.camera.getCameras = () => {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.enumerateDevices().then((devices)=>{
            resolve(devices.filter(device => device.kind === 'videoinput'));
        }, reject);
    });
};

/**
 * Getting video stream as Promise
 * @param {String} deviceId 
 * @param {Object} sizeRequriement 
 * @returns Promise
 */
io.github.shunshun94.camera.getVideoStream = (deviceId = false, sizeRequriement=io.github.shunshun94.camera.CONSTS.DEFAULT_VIDEO_SIZE) => {
    const param = {
        video: sizeRequriement
    };
    if(deviceId) {
        param.video.deviceId = {
            exact: deviceId
        };
    }
    return new Promise((resolve, reject)=>{
        try {
            navigator.mediaDevices.getUserMedia(param).then(resolve, reject);
        } catch(e) {
            reject(e);
        }
    });
};

/**
 * 
 * @param {Element} videoDom 
 * @returns URL of the picture
 */
io.github.shunshun94.camera.getScreenshotUrl = (videoDom) => {
    const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
    canvas.width = videoDom.videoWidth;
    canvas.height = videoDom.videoHeight;
    canvas.getContext('2d').drawImage(videoDom, 0, 0);
    const url = canvas.toDataURL('image/webp');
    canvas.remove();
    return url;
};

/**
 * 
 * @param {Element} videoDom 
 * @param {string} title current date as ISO format is the current value
 */
io.github.shunshun94.camera.downloadScreenshot = (videoDom, title=`${(new Date()).toISOString()}.webp`) => {
	const url = io.github.shunshun94.camera.getScreenshotUrl(videoDom);
	const a = document.createElement("a");
	document.body.appendChild(a);
	a.download = title;
	a.href = url;
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
};