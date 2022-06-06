var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.avandner = io.github.shunshun94.trpg.avandner || {};
io.github.shunshun94.trpg.avandner.map = io.github.shunshun94.trpg.avandner.map || {};

io.github.shunshun94.trpg.avandner.map.generate = (option={}) => {
    const baseSVG = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${option.width || 600}" height="${option.height || 600}" viewBox="-200 -200 400 400" xml:space="preserve">`;
    const paths = [];
    const mapBaseData = io.github.shunshun94.trpg.avandner.map.CONSTS.mapBaseData;
    [mapBaseData.label, mapBaseData.out, mapBaseData.in].forEach((d)=>{
        for(var i = 0; i < 12; i++) {
            const baseLength = d.length;
            const x1 = baseLength * Math.cos((Math.PI * (i*2 - 1))/12);
            const x2 = baseLength * Math.cos((Math.PI * (i*2 + 1))/12);
            const y1 = baseLength * Math.sin((Math.PI * (i*2 - 1))/12);
            const y2 = baseLength * Math.sin((Math.PI * (i*2 + 1))/12);
            paths.push(`<path d="M 0,0 L ${x1},${y1} a ${baseLength} ${baseLength} ${(i*2 - 1) * 15} 0 1 ${x2 - x1}, ${y2 - y1} z" fill="hsl(${i * 30},100%,${d.lightness}%)" stroke="black" class="io-github-shunshun94-trpg-avandner-map-${d.name}-${i+1}"></path>`);
        }
    });
    return `${baseSVG}\n${paths.join('\n')}\n</svg>`;
};

io.github.shunshun94.trpg.avandner.map.CONSTS = io.github.shunshun94.trpg.avandner.map.CONSTS || {};
io.github.shunshun94.trpg.avandner.map.CONSTS.mapBaseData = {
    label: {
        name:     'label',
        length:   180,
        lightness:90
    },
    out: {
        name:     'out',
        length:   160,
        lightness:60
    },
    in: {
        name:     'in',
        length:   110,
        lightness:30
    }
};