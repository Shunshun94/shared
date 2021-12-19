feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
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
          const updatedConstraints = {
              ...constraints,
              deviceId: {
                  exact: cameraOptions.value
              }
          };
          startStream(updatedConstraints);
      } else {
          alert('カメラが使えない状態だとこのページは見れないよ');
      }
};

play.onclick = startVideo;

const startStream = async (constraints) => {
    console.log(constraints);
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleStream(stream);
    } catch (e) {
        alert('カメラの利用を許可しないとこのページは見れないよ');
    }
};
  
const handleStream = (stream) => {
    console.log(stream);
    video.srcObject = stream;
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    screenshot.classList.remove('d-none');
    streamStarted = true;
};

getCameraSelection();

cameraOptions.onchange = () => {
    const updatedConstraints = {
        ...constraints
    };
    updatedConstraints.video.deviceId = {exact: cameraOptions.value};
    startStream(updatedConstraints);
};

const pauseStream = () => {
    video.pause();
    play.classList.remove('d-none');
    pause.classList.add('d-none');
};

const doScreenshot = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    screenshotImage.src = canvas.toDataURL('image/webp');
    screenshotImage.classList.remove('d-none');
};
  
pause.onclick = pauseStream;
screenshot.onclick = doScreenshot;