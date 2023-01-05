var rgb2hsl = (rgb)=>{
    const r = 0;
    const g = 1;
    const b = 2;


    const exec = /rgb\((\d+)\s*,\s(\d+)\s*,\s(\d+)\s*\)/.exec(rgb);
    const rgbArray = [Number(exec[1]), Number(exec[2]), Number(exec[3])];
    const rgbMax = Math.max.apply(this, rgbArray);
    const rgbMin = Math.min.apply(this, rgbArray);

    var h = 0;
    if(rgbArray[r] === rgbArray[g] && rgbArray[r] === rgbArray[b]) {

    } else if ( rgbArray[r] >= rgbArray[g] && rgbArray[r] >= rgbArray[b] ) {
        h = 60 * ( (rgbArray[g] - rgbArray[b] ) / (rgbMax - rgbMin) );
    } else if ( rgbArray[g] >= rgbArray[r] && rgbArray[g] >= rgbArray[b] ) {
        h = 60 * ( (rgbArray[b] - rgbArray[r] ) / (rgbMax - rgbMin) ) + 120;
    } else if ( rgbArray[b] >= rgbArray[r] && rgbArray[b] >= rgbArray[g] ) {
        h = 60 * ( (rgbArray[r] - rgbArray[g] ) / (rgbMax - rgbMin) ) + 240;
    }
    h = (h < 0) ? h + 360 : h;

    var l = (rgbMax + rgbMin) / 2;

    var s = 50;
    if( l > 128 ) {
        s = (rgbMax - rgbMin) / (510 - (rgbMax + rgbMin));
    } else {
        s = (rgbMax - rgbMin) / (rgbMax + rgbMin);
    }

    console.log(rgb, rgbArray, rgbMax, rgbMin, h, s*100, l*(100/255));

    return {h: h, s: s * 100, l: l * 100 / 255};
};
var colorMap = {};
document.getElementsByTagName('head')[0].innerHTML += '<link rel="stylesheet" href="https://shunshun94.github.io/shared/jquery/io/github/shunshun94/trpg/logEditor/resources/default.css" type="text/css">';
Array.from(document.getElementsByTagName('p')).forEach((elem)=>{
    const rgb = elem.style.color;
    if(! colorMap[rgb]) {
        try {
            var tmpColor = rgb2hsl(rgb);
            if( tmpColor.l > 70 ) {
                tmpColor.l -= 40;
            }
            colorMap[rgb] = `hsl(${Math.floor(tmpColor.h)}, ${Math.floor(tmpColor.s)}%, ${Math.floor(tmpColor.l)}%)`;
        } catch(e) {
            console.error(e, elem, rgb);
            colorMap[rgb] = rgb;
        }

    }
    var color = colorMap[rgb];
    elem.style.color = color;

    const elems = elem.getElementsByTagName('span');
    const dummy = document.createElement('span');
    const name  = document.createElement('span');
    name.textContent = elems[1].innerText;
    const post  = document.createElement('span');
    post.innerHTML = elems[2].innerHTML;
    if(! ['[メイン]', '[情報]'].includes(elems[0].textContent.trim())) {
        elem.className = 'tab1';
    }
    elem.innerHTML = '';
    elem.append(dummy);
    elem.append(name);
    elem.append(post);
});

