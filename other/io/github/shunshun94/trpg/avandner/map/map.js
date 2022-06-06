var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.avandner = io.github.shunshun94.trpg.avandner || {};
io.github.shunshun94.trpg.avandner.map = io.github.shunshun94.trpg.avandner.map || {};

io.github.shunshun94.trpg.avandner.map.generate = (option={}) => {
    const baseSVG = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${option.width || 600}" height="${option.height || 600}" viewBox="-200 -200 400 400" xml:space="preserve">`;
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
    paths.push(`<circle cx="0" cy="0" r="${mapBaseData.center.length}"  fill="hsl(0,100%,${mapBaseData.center.lightness}%)" stroke="black" class="io-github-shunshun94-trpg-avandner-map-${mapBaseData.center.name}" />`);

    const numberLabelFontSize = option.numberLabelFontSize || option.fontSize || io.github.shunshun94.trpg.avandner.map.CONSTS.NUMS_FONT_SIZE;
    const nums = `<g font-size="${numberLabelFontSize}">` + io.github.shunshun94.trpg.avandner.map.CONSTS.NUMS_TEXTS.map((t, i) => {
        const baseLength = (mapBaseData.label.length + mapBaseData.out.length) / 2;
        const x = baseLength * Math.cos((Math.PI * (i*2))/12) - (numberLabelFontSize / 2);
        const y = baseLength * Math.sin((Math.PI * (i*2))/12) + (numberLabelFontSize / 2);
        return `<text x="${x}" y="${y}" >${t}</text>`;
    }) + '</g>';

    return `${baseSVG}\n${paths.join('\n')}\n${nums}\n</svg>`;
};

io.github.shunshun94.trpg.avandner.map.CONSTS = io.github.shunshun94.trpg.avandner.map.CONSTS || {};
io.github.shunshun94.trpg.avandner.map.CONSTS.NUMS_FONT_SIZE = 14;
io.github.shunshun94.trpg.avandner.map.CONSTS.NUMS_TEXTS = ['１', '２', '３', '４', '５', '６', '７', '８', '９', '10', '11', '12'];
io.github.shunshun94.trpg.avandner.map.CONSTS.mapBaseData = {
    label: {
        name:     'label',
        length:   195,
        lightness:90
    },
    out: {
        name:     'out',
        length:   170,
        lightness:60
    },
    in: {
        name:     'in',
        length:   125,
        lightness:30
    },
    center: {
        name:     'center',
        length:   60,
        lightness:100
    }
};