feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;

const [play, pause, screenshot] = buttons;

const constraints = {
  video: {
    width: {
      min: 320,
      ideal: 480,
      max: 640,
    },
    height: {
      min: 180,
      ideal: 270,
      max: 360
    },
  }
};

const getCameraSelection = async () => {
    const videoDevices = await io.github.shunshun94.camera.getCameras();
    const options = videoDevices.map(videoDevice => {
        return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });
    cameraOptions.innerHTML = options.join('');
};

const startVideo = () => {
    if (streamStarted) {
        video.play();
        play.classList.add('d-none');
        pause.classList.remove('d-none');
        return;
      }
      if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        io.github.shunshun94.camera.getVideoStream(cameraOptions.value).then(
            handleStream,
            (error)=>{
                console.error(error);
                alert('カメラが使えない状態だとこのページは見れないよ');
            }
        );
      }
};

const startStream = async (constraints) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleStream(stream);
    } catch (e) {
        alert('カメラの利用を許可しないとこのページは見れないよ');
    }
};
  
const handleStream = (stream) => {
    video.srcObject = stream;
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    screenshot.classList.remove('d-none');
    streamStarted = true;
};

cameraOptions.onchange = (e) => {
    io.github.shunshun94.camera.getVideoStream(cameraOptions.value).then(
        handleStream,
        (error)=>{
            console.error(error);
            alert('カメラが使えない状態だとこのページは見れないよ');
        }
    );
};

const pauseStream = () => {
    video.pause();
    play.classList.remove('d-none');
    pause.classList.add('d-none');
};

const doScreenshot = () => {
    io.github.shunshun94.camera.downloadScreenshot(video);
};

play.onclick = startVideo;
pause.onclick = pauseStream;
screenshot.onclick = doScreenshot;
getCameraSelection();
