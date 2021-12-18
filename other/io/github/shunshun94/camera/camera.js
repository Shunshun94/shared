var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.camera = io.github.shunshun94.camera || {};

io.github.shunshun94.camera.getCameras = (isGettingUserMedia = false) => {
    if(isGettingUserMedia) {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
                navigator.mediaDevices.enumerateDevices().then((devices)=>{
                    resolve(devices.filter(device => device.kind === 'videoinput'));
                }, reject);
            }, reject);
        });
    } else {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.enumerateDevices().then((devices)=>{
                resolve(devices.filter(device => device.kind === 'videoinput'));
            }, reject);
        });
    }
};

