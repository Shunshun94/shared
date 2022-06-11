var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.avandner = io.github.shunshun94.trpg.avandner || {};
io.github.shunshun94.trpg.avandner.map = io.github.shunshun94.trpg.avandner.map || {};

io.github.shunshun94.trpg.avandner.map.generate = (option={}) => {
    const baseSVG = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${option.width || 600}" height="${option.height || 600}" viewBox="-200 -200 400 400" xml:space="preserve">`;

    return [
        baseSVG,
        io.github.shunshun94.trpg.avandner.map.generateCircles(option),
        io.github.shunshun94.trpg.avandner.map.generateLabels(option),
        io.github.shunshun94.trpg.avandner.map.generateMove(option),
        io.github.shunshun94.trpg.avandner.map.generateCharacterPositions(option),
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

io.github.shunshun94.trpg.avandner.map.calcCenterPositionByArea = (areaName) => {
    const mapBaseData = io.github.shunshun94.trpg.avandner.map.CONSTS.mapBaseData;
    const postionRegExpResults = [
        { re:/^(\d+)[iI]/.exec(areaName), length: (mapBaseData.center.length + mapBaseData.in.length ) / 2 },
        { re:/^(\d+)[oO]/.exec(areaName), length: (mapBaseData.in.length     + mapBaseData.out.length) / 2 },
        { re:/^[cC]/.exec(areaName),      length: 0}
    ].filter((d)=>{return d.re});
    if(postionRegExpResults.length === 0) {
        const errorMessage = `位置情報 "${areaName}" は無効な位置情報です。位置情報は 8i や 6o、ないし c といった記法である必要があります`;
        console.error(errorMessage);
        throw errorMessage;
    }
    const postionRegExpResult = postionRegExpResults[0];
    const baseLength = postionRegExpResult.length;
    return io.github.shunshun94.trpg.avandner.map.calcCenter(Number(postionRegExpResult.re[1] || '0') - 3, baseLength);
}

io.github.shunshun94.trpg.avandner.map.calcCenter = (position, distanceFromCenter) => {
    return {
        x: distanceFromCenter * Math.cos((Math.PI * (position*2))/12),
        y: distanceFromCenter * Math.sin((Math.PI * (position*2))/12)
    };
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
    return `<g class="io-github-shunshun94-trpg-avandner-map-positionLabel" font-size="${numberLabelFontSize}">\n` + io.github.shunshun94.trpg.avandner.map.CONSTS.NUMS_TEXTS.map((t, j) => {
        const baseLength = (mapBaseData.label.length + mapBaseData.out.length) / 2;
        const position = io.github.shunshun94.trpg.avandner.map.calcCenter(j - 2, baseLength);
        const x = position.x - (numberLabelFontSize / 2);
        const y = position.y + (numberLabelFontSize / 2);
        return `<text class="io-github-shunshun94-trpg-avandner-map-${j+1}" x="${x}" y="${y}" >${t}</text>`;
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
    const characterFontSize = option.characterFontSize || option.fontSize || io.github.shunshun94.trpg.avandner.map.CONSTS.CHAR_FONT_SIZE;
    const result = [];
    for(var pos in characterByPos) {
        const characters = characterByPos[pos].join(',');
        const position = io.github.shunshun94.trpg.avandner.map.calcCenterPositionByArea(pos);
        const baseX = position.x - ((characterFontSize / 2) * characters.length);
        const baseY = position.y + ( characterFontSize / 2);
        result.push(`<text class="io-github-shunshun94-trpg-avandner-map-characterLabel-${pos}" x="${baseX}" y="${baseY}" >${characters}</text>`);
    }
    return `<g class="io-github-shunshun94-trpg-avandner-map-characterLabel" font-size="${characterFontSize}">\n${result.join('\n')}\n</g>`;
};

io.github.shunshun94.trpg.avandner.map.calcTwoPointRelation = (start, end) => {
    const pointLength = {
        x: start.x - end.x,
        y: start.y - end.y
    };
    const length = Math.sqrt(Math.pow(pointLength.x, 2) + Math.pow(pointLength.y, 2));
    const angles  = {
        sin: Math.asin((pointLength.y) / length),
        cos: Math.acos((pointLength.x) / length)
    };
    const result = {
        start:  start,
        end:    end,
        length: length
    };
    if(       pointLength.y >= 0 && pointLength.x <= 0 ) {
        result.angle = angles.cos;
    }else if( pointLength.y <= 0 && pointLength.x <= 0) {
        result.angle = (angles.sin - Math.PI) * -1;
    }else if( pointLength.y <= 0 && pointLength.x >= 0) {
        result.angle = angles.cos * -1;
    } else {
        result.angle = angles.sin;
    }
    return result;
};

io.github.shunshun94.trpg.avandner.map.generateMove = (option={}) => {
    if(! option.move) {return '';}
    const result = [];
    const color = option.moveColor || option.strokeColor || option.color || '#D0D0D0';
    const width = option.moveWidth || '2px';
    for(var i = 0; i < option.move.length - 1; i++) {
        const startPosition = io.github.shunshun94.trpg.avandner.map.calcCenterPositionByArea(option.move[i]);
        const endPosition = io.github.shunshun94.trpg.avandner.map.calcCenterPositionByArea(option.move[i + 1]);
        result.push(`<line class="io-github-shunshun94-trpg-avandner-map-move" stroke-width="${width}" stroke-linecap="round" x1="${startPosition.x}" y1="${startPosition.y}" x2="${endPosition.x}" y2="${endPosition.y}" stroke="${color}" />`);
    }

    const lastMove = io.github.shunshun94.trpg.avandner.map.calcTwoPointRelation(
        io.github.shunshun94.trpg.avandner.map.calcCenterPositionByArea(option.move[option.move.length - 2]),
        io.github.shunshun94.trpg.avandner.map.calcCenterPositionByArea(option.move[option.move.length - 1])
    );

    result.push([
        `<line class="io-github-shunshun94-trpg-avandner-map-move-finishPoints"`,
        `x1="${lastMove.end.x}"`,
        `x2="${lastMove.end.x + (lastMove.length / 3) * Math.cos(lastMove.angle - Math.PI / 12)}"`,
        `y1="${lastMove.end.y}"`,
        `y2="${lastMove.end.y + (lastMove.length / 3) * Math.sin(lastMove.angle - Math.PI / 12)}"`,
        `stroke="${color}"`,
        `stroke-width="${width}" stroke-linecap="round" />`
    ].join(' '));
    result.push([
        `<line class="io-github-shunshun94-trpg-avandner-map-move-finishPoints"`,
        `x1="${lastMove.end.x}"`,
        `x2="${lastMove.end.x + (lastMove.length / 3) * Math.cos(lastMove.angle + Math.PI / 12)}"`,
        `y1="${lastMove.end.y}"`,
        `y2="${lastMove.end.y + (lastMove.length / 3) * Math.sin(lastMove.angle + Math.PI / 12)}"`,
        `stroke="${color}"`,
        `stroke-width="${width}" stroke-linecap="round" />`
    ].join(' '));


    return result.join('\n');
};