var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.avandner = io.github.shunshun94.trpg.avandner || {};
io.github.shunshun94.trpg.avandner.map = io.github.shunshun94.trpg.avandner.map || {};

io.github.shunshun94.trpg.avandner.map.generate = (option={}) => {
    const baseSVG = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${option.width || 600}" height="${option.height || 600}" viewBox="-200 -200 400 400" xml:space="preserve">`;
    const paths = io.github.shunshun94.trpg.avandner.map.generateCircles();
    const nums = io.github.shunshun94.trpg.avandner.map.generateLabels(option);
    const chars = io.github.shunshun94.trpg.avandner.map.generateCharacterPositions(option);

    return [
        baseSVG,
        paths,
        nums,
        chars,
        '</svg>'
    ].join('\n');
};

io.github.shunshun94.trpg.avandner.map.CONSTS = io.github.shunshun94.trpg.avandner.map.CONSTS || {};
io.github.shunshun94.trpg.avandner.map.CONSTS.CHAR_FONT_SIZE =  8;
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

io.github.shunshun94.trpg.avandner.map.generateCircles = () => {
    const paths = [];
    const mapBaseData = io.github.shunshun94.trpg.avandner.map.CONSTS.mapBaseData;
    [mapBaseData.label, mapBaseData.out, mapBaseData.in].forEach((d)=>{
        for(var j = 0; j < 12; j++) {
            const i = j - 3;
            const baseLength = d.length;
            const x1 = baseLength * Math.cos((Math.PI * (i*2 - 1))/12);
            const x2 = baseLength * Math.cos((Math.PI * (i*2 + 1))/12);
            const y1 = baseLength * Math.sin((Math.PI * (i*2 - 1))/12);
            const y2 = baseLength * Math.sin((Math.PI * (i*2 + 1))/12);
            paths.push(`<path d="M 0,0 L ${x1},${y1} a ${baseLength} ${baseLength} ${(i*2 - 1) * 15} 0 1 ${x2 - x1}, ${y2 - y1} z" fill="hsl(${j * 30},100%,${d.lightness}%)" stroke="black" class="io-github-shunshun94-trpg-avandner-map-${d.name}-${i+1}"></path>`);
        }
    });
    paths.push(`<circle cx="0" cy="0" r="${mapBaseData.center.length}"  fill="hsl(0,100%,${mapBaseData.center.lightness}%)" stroke="black" class="io-github-shunshun94-trpg-avandner-map-${mapBaseData.center.name}" />`);
    return paths.join('\n');
};

io.github.shunshun94.trpg.avandner.map.generateLabels = (option={}) => {
    const numberLabelFontSize = option.numberLabelFontSize || option.fontSize || io.github.shunshun94.trpg.avandner.map.CONSTS.NUMS_FONT_SIZE;
    const mapBaseData = io.github.shunshun94.trpg.avandner.map.CONSTS.mapBaseData;
    return `<g font-size="${numberLabelFontSize}">\n` + io.github.shunshun94.trpg.avandner.map.CONSTS.NUMS_TEXTS.map((t, j) => {
        const i = j - 2;
        const baseLength = (mapBaseData.label.length + mapBaseData.out.length) / 2;
        const x = baseLength * Math.cos((Math.PI * (i*2))/12) - (numberLabelFontSize / 2);
        const y = baseLength * Math.sin((Math.PI * (i*2))/12) + (numberLabelFontSize / 2);
        return `<text x="${x}" y="${y}" >${t}</text>`;
    }).join('\n') + '\n</g>';    
};

io.github.shunshun94.trpg.avandner.map.generateCharactersByPositions = (characters={}) => {
    const result = {};
    for(var key in characters) {
        const pos = characters[key];
        if(! result[pos]) {
            result[pos] = [];
        }
        result[pos].push(key);
    }
    return result;
};

io.github.shunshun94.trpg.avandner.map.generateCharacterPositions = (option={}) => {
    const characterByPos = option.charactersByPositions || io.github.shunshun94.trpg.avandner.map.generateCharactersByPositions(option.characters);
    const mapBaseData = io.github.shunshun94.trpg.avandner.map.CONSTS.mapBaseData;
    const characterFontSize = option.characterFontSize || option.fontSize || io.github.shunshun94.trpg.avandner.map.CONSTS.CHAR_FONT_SIZE;
    const result = [];
    for(var pos in characterByPos) {
        const characters = characterByPos[pos].join(',');
        const postionRegExpResults = [
            { re:/^(\d+)[iI]/.exec(pos), length: (mapBaseData.center.length + mapBaseData.in.length ) / 2 },
            { re:/^(\d+)[oO]/.exec(pos), length: (mapBaseData.in.length     + mapBaseData.out.length) / 2 },
            { re:/^[cC]/.exec(pos),      length: 0}
        ].filter((d)=>{return d.re});
        if(postionRegExpResults.length === 0) {
            throw `位置情報 "${pos}" は無効な位置情報です。位置情報は 8i や 6o、ないし c といった記法である必要があります`;
        }
        const postionRegExpResult = postionRegExpResults[0];
        const baseLength = postionRegExpResult.length;
        const position   = Number(postionRegExpResult.re[1] || '0') - 3;

        const baseX = baseLength * Math.cos((Math.PI * (position*2))/12) - ((characterFontSize / 2) * characters.length);
        const baseY = baseLength * Math.sin((Math.PI * (position*2))/12) - ( characterFontSize / 2);
        result.push(`<text x="${baseX}" y="${baseY}" >${characters}</text>`);
    }
    return `<g font-size="${characterFontSize}">\n${result.join('\n')}\n</g>`;
};