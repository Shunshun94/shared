var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.sw2 = io.github.shunshun94.trpg.sw2 || {};
io.github.shunshun94.trpg.sw2.magics = io.github.shunshun94.trpg.sw2.magics || {};

io.github.shunshun94.trpg.sw2.magics.CONSTS = io.github.shunshun94.trpg.sw2.magics.CONSTS || {};
io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS = 'io-github-shunshun94-trpg-sw2-magics';
io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASSES = {
    SORCERER:    `${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS}-sorcerer`,
    CONJURER:    `${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS}-conjurer`,
    WIZARD:      `${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS}-wizard`,
    PRIEST:      `${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS}-priest`,
    MAGITECH:    `${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS}-magitech`,
    FAIRY_TAMER: `${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS}-fairy_tamer`,
    DRUID:       `${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS}-druid`,
    DEMON_RULER: `${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS}-demon_ruler`,
    GRIMOIRE:    `${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS}-grimoire`,
};



io.github.shunshun94.trpg.sw2.magics.generateDom = ({tag, content='', classes=''}) => {
    const dom = document.createElement(tag);
    dom.textContent = content;
    dom.className = classes;
    return dom;
};

io.github.shunshun94.trpg.sw2.magics.generateHtmlFirstLine = ({
    level, name, cost, size
}) => {
    const $firstLine = io.github.shunshun94.trpg.sw2.magics.generateDom({tag: 'tr'});

    $firstLine.appendChild(io.github.shunshun94.trpg.sw2.magics.generateDom({
        tag: 'th', classes: `${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS}-level`, content: level
    }));

    const $name = io.github.shunshun94.trpg.sw2.magics.generateDom({
        tag: 'th', classes: `${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS}-name`, content: `【${name}】`
    });
    $name.colSpan = '5';
    if(size) {
        const $size = document.createElement('span');
        $size.className = `${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS}-magiShereSize`;
        $size.textContent = `マギスフィア：${size}`;
        $name.appendChild($size);
    }
    $firstLine.appendChild($name);

    $firstLine.appendChild(io.github.shunshun94.trpg.sw2.magics.generateDom({
        tag: 'th', classes: `${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS}-commonTh`, content: `消費`
    }));

    $firstLine.appendChild(io.github.shunshun94.trpg.sw2.magics.generateDom({
        tag: 'td', classes: `${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS}-cost`, content: (Number(cost) ? `MP${cost}` : cost)
    }));

    return $firstLine;
};

io.github.shunshun94.trpg.sw2.magics.generateHtmlSecondLine = ({
    target, range, time, regist
}) => {
    const $line = io.github.shunshun94.trpg.sw2.magics.generateDom({tag: 'tr'});
    const baseClass = io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS;
    [
        {name: 'target', value: target, column: '対象'},
        {name: 'range', value: range, column: '射程/形状'},
        {name: 'time', value: time, column: '時間'},
        {name: 'regist', value: regist, column: '抵抗'},
    ].forEach((d)=>{
        $line.appendChild(io.github.shunshun94.trpg.sw2.magics.generateDom({
            tag: 'th', classes: `${baseClass}-commonTh`, content: `${d.column}`
        }));
        $line.appendChild(io.github.shunshun94.trpg.sw2.magics.generateDom({
            tag: 'td', classes: `${baseClass}-${d.name}`, content: d.value
        }));
    });
    return $line;
};

io.github.shunshun94.trpg.sw2.magics.generateHtmlSimpleLine = ({column, content, contentName}) => {
    const baseClass = io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS;
    const $line = io.github.shunshun94.trpg.sw2.magics.generateDom({tag: 'tr'});
    $line.appendChild(io.github.shunshun94.trpg.sw2.magics.generateDom({
        tag: 'th', classes: `${baseClass}-commonTh`, content: column
    }));
    const $content = io.github.shunshun94.trpg.sw2.magics.generateDom({
        tag: 'td', classes: `${baseClass}-${contentName}`, content: content
    });
    $content.colSpan = '7';
    $line.appendChild($content);
    return $line;
};

io.github.shunshun94.trpg.sw2.magics.generateHtmlThirdLine = ({overview, attribute}) => {
    if(attribute) {
        const baseClass = io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS;
        const $line = io.github.shunshun94.trpg.sw2.magics.generateDom({tag: 'tr'});
        $line.appendChild(io.github.shunshun94.trpg.sw2.magics.generateDom({
            tag: 'th', classes: `${baseClass}-commonTh`, content: '概要'
        }));
        const $content = io.github.shunshun94.trpg.sw2.magics.generateDom({
            tag: 'td', classes: `${baseClass}-overview`, content: overview
        });
        $content.colSpan = '5';
        $line.appendChild($content);
        $line.appendChild(io.github.shunshun94.trpg.sw2.magics.generateDom({
            tag: 'th', classes: `${baseClass}-commonTh`, content: '属性'
        }));
        $line.appendChild(io.github.shunshun94.trpg.sw2.magics.generateDom({
            tag: 'td', classes: `${baseClass}-attribute`, content: attribute
        }));
        return $line;
    } else {
        return io.github.shunshun94.trpg.sw2.magics.generateHtmlSimpleLine({column:'概要', content:overview, contentName:'overview'});
    }
};

io.github.shunshun94.trpg.sw2.magics.generateHtml = ({
    category, level, name, cost, target, range, time, regist, overview, detail,
    attribute, chant, size
}) => {
    const $base = io.github.shunshun94.trpg.sw2.magics.generateDom({
        tag:'table', classes: `${category} ${io.github.shunshun94.trpg.sw2.magics.CONSTS.CLASS}`
    });
    $base.border='1';

    $base.appendChild(io.github.shunshun94.trpg.sw2.magics.generateHtmlFirstLine({level, name, cost, size}));
    $base.appendChild(io.github.shunshun94.trpg.sw2.magics.generateHtmlSecondLine({target, range, time, regist}));
    $base.appendChild(io.github.shunshun94.trpg.sw2.magics.generateHtmlThirdLine({overview, attribute}));
    $base.appendChild(io.github.shunshun94.trpg.sw2.magics.generateHtmlSimpleLine({column:'効果', content:detail, contenntName:'detail'}));
    if(chant) {
        $base.appendChild(io.github.shunshun94.trpg.sw2.magics.generateHtmlSimpleLine({column:'詠唱', content:chant, contenntName:'chant'}));
    }
    return $base;
};
