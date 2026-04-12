var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.ytsheet = io.github.shunshun94.ytsheet || {};
io.github.shunshun94.ytsheet.addSkin = io.github.shunshun94.ytsheet.addSkin || {};
io.github.shunshun94.ytsheet.addSkin.exportPicture = {};
io.github.shunshun94.ytsheet.addSkin.exportPicture.waterMarkId = 'exportPictureWaterMark';
io.github.shunshun94.ytsheet.addSkin.exportPicture.isActive = (generateType === 'SwordWorld2Enemy') && io.github.shunshun94.ytsheet.addSkin.userId && html2canvas;

/**
 * 画像出力機能のために透かしを挿入します
 */
io.github.shunshun94.ytsheet.addSkin.exportPicture.initialize = () => {
	const waterMark = document.createElement('div');
    waterMark.setAttribute('id', io.github.shunshun94.ytsheet.addSkin.exportPicture.waterMarkId);
	waterMark.style = `opacity:0.1;position:absolute;top:3em;font-size:5em;transform: rotate(15deg);display:none;`;
	waterMark.innerHTML = io.github.shunshun94.ytsheet.addSkin.userId + '<br/>' + new Date().toLocaleString();
	document.getElementsByTagName('article')[0].append(waterMark);
};

io.github.shunshun94.ytsheet.addSkin.exportPicture.export = (_) => {
    if(! io.github.shunshun94.ytsheet.addSkin.exportPicture.isActive) {
        alert('この機能は利用できません。必要なライブラリがインポートされていないか、魔物データ以外のシートを参照しています。フォースリロードして解決しなければ管理者に問い合わせてください');
        return;
    }
    Array.from(document.getElementsByClassName('screen-shot-remove')).forEach((e)=>{ e.style.display = 'none'; });
    Array.from(document.getElementsByClassName('fragments')).forEach((e)=>{ e.style.display = 'none'; });
    document.getElementById('author').style.display = 'none';
    document.getElementById('tags').style.display = 'none';
    const waterMark = document.getElementById(io.github.shunshun94.ytsheet.addSkin.exportPicture.waterMarkId);
    waterMark.style.display = 'block';
    document.getElementsByTagName('article')[0].style.padding = '1em';
    html2canvas(document.getElementsByTagName('article')[0], {
        backgroundColor: null,
        scale: 2
    }).then((canvas) => {
        const link = document.createElement('a');
        link.download = `${document.getElementsByTagName('article')[0].getElementsByTagName('h1')[0].textContent}.png`;
        link.href = canvas.toDataURL();
        link.click();
        document.getElementsByTagName('article')[0].style.padding = '0';
        document.getElementById('author').style.display = 'block';
        document.getElementById('tags').style.display = 'block';
        const waterMark = document.getElementById(io.github.shunshun94.ytsheet.addSkin.exportPicture.waterMarkId);
        waterMark.style.display = 'none';
        Array.from(document.getElementsByClassName('fragments')).forEach((e)=>{ e.style.display = 'block'; });
    });
};

if(io.github.shunshun94.ytsheet.addSkin.exportPicture.isActive) {
    io.github.shunshun94.ytsheet.addSkin.exportPicture.initialize();
} else {

}
