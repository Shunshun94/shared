const addFactorsToLogs = (flags = {}) => {
    if(flags.links !== false) {
        handleLinks(flags)
    }
    if(flags.download || false) {
        $('footer').append(`<p><a href="${location.protocol}//${location.host}${location.pathname}" download="${location.pathname.split('/').pop()}">ログをダウンロードする</a>(<a href="https://shunshun94.github.io/shared/jquery/io/github/shunshun94/trpg/logEditor/LogEditor.html" target="_blnak">ログエディタ</a>で加工する用)</p>`);
    }

    if(flags.characterDisplay || false) {
        characterDisplayHandle(flags.characterDisplay);
    }

    if(document.getElementById('lastUpdateDisplay')) {
        document.getElementById('lastUpdateDisplay').textContent = new Date(document.lastModified).toLocaleDateString();
    }
};

const generateDisplayCharacterDom = (key, characterInfo, parentId) => {
    const id = `${parentId}-${key}`;
    const base = document.createElement('div');
    base.id = id;   
    const className =  `${parentId}-character`;
    base.className = className;

    if(characterInfo.html) {
        base.innerHTML = characterInfo.html;
        return base;
    }

    if(characterInfo.name) {
        const box = document.createElement('span');
        box.textContent = characterInfo.name;
        box.className = `${className}-name`;
        base.appendChild(box);
    }

    if(characterInfo.pic) {
        const box = document.createElement('div');
        box.className = `${className}-pic`;

        const img = document.createElement('img');
        ['src', 'height', 'width', 'alt'].forEach((attr)=>{
            if(characterInfo.pic[attr]) {
                img[attr] = characterInfo.pic[attr];
            }
        });
        img.className = `${className}-pic-img`;
        if(characterInfo.pic.grayscale) {
            img.style.filter = 'grayscale(100%)';
        }
        if(characterInfo.pic.opacity) {
            img.style.opacity = characterInfo.pic.opacity;
        }
        box.appendChild(img);

        const explanation = document.createElement('span');
        explanation.className = 'whereOriginIs';
        if(characterInfo.pic.explanationHtml) {
            explanation.innerHTML = characterInfo.pic.explanationHtml;
        } else {
            if(characterInfo.pic.origin) {
                if(! characterInfo.pic.origin.name) {
                    throw `${key} の pic.origin に name のパラメータがありません`;
                }
                if(characterInfo.pic.origin.url || characterInfo.pic.origin.link) {
                    const text1 = document.createElement('span');
                    text1.textContent = '画像出典：';
                    explanation.appendChild(text1);
                    const a = document.createElement('a');
                    a.href = characterInfo.pic.origin.url || characterInfo.pic.origin.link;
                    a.target = '_blank';
                    a.textContent = characterInfo.pic.origin.name;
                    explanation.appendChild(a);
                    if(characterInfo.pic.creator) {
                        const text2 = document.createElement('span');
                        text2.textContent = '。';
                        explanation.appendChild(text2);
                    }
                } else {
                    const text = document.createElement('span');
                    text.textContent = `画像出典：${characterInfo.pic.origin.text}`;
                    if(characterInfo.pic.creator) {
                        text.textContent += '。';
                    }
                    explanation.appendChild(text);
                }
            }
            if(characterInfo.pic.creator) {
                if(! characterInfo.pic.creator.name) {
                    throw `${key} の pic.creator に name のパラメータがありません`;
                }
                if(characterInfo.pic.creator.url || characterInfo.pic.creator.link) {
                    const text = document.createElement('span');
                    text.textContent = '作者は';
                    explanation.appendChild(text);
                    const a = document.createElement('a');
                    a.href = characterInfo.pic.creator.url || characterInfo.pic.creator.link;
                    a.target = '_blank';
                    a.textContent = characterInfo.pic.creator.name;
                    explanation.appendChild(a);
                } else {
                    const text = document.createElement('span');
                    text.textContent = `作者は${characterInfo.pic.creator.name}`;
                    explanation.appendChild(text);
                }
            }
        }
        box.appendChild(explanation);
        base.appendChild(box);
    }

    if(characterInfo.explanation) {
        const box = document.createElement('p');
        box.className = `${className}-explanation`;
        if(characterInfo.explanation.id) {
            box.innerHTML = document.getElementById(characterInfo.explanation.id).innerHTML;
        } else if(characterInfo.explanation.html) {
            box.innerHTML = characterInfo.explanation.html;
        } else if(characterInfo.explanation.text) {
            box.textContent = characterInfo.explanation.text;
        }
        base.appendChild(box);
    }
    return base;
};

const generateToggleButton = (targetGetFunction, text='≡', id) => {
    const base = document.createElement('button');
    if(id) {base.id = id;}
    base.textContent = text;
    base.onclick = (e) => {
        targetGetFunction(e).toggle(500);
    };
    return base;
};

const redrawCharacterDisplayBox = (data, box) => {
    box.innerHTML = '';
    data.order.map((characterId)=>{
        return generateDisplayCharacterDom(characterId, data.characters[characterId], box.id);
    }).forEach((dom)=>{box.appendChild(dom);});
};

const generateDisplayDom = (cd, idx = 0) => {
    const id = cd.id || 'character-display';
    const base = document.createElement('div');
    base.id = id;
    if(cd.togglable) {
        base.appendChild(generateToggleButton(()=>{
            return $(`#${id}-box`);
        }, cd.togglable.text || '≡', cd.togglable.id || `${id}-toggle`));
    }
    const box = document.createElement('div');
    box.id = `${id}-box`;
    redrawCharacterDisplayBox(cd.timeline[idx], box);
    base.appendChild(box);
    base.title = idx;
    return base;
};

const getScrollPosition = () => {
    return window.pageYOffset;
};

const getElementPosition = (element) => {
    return getScrollPosition() + element.getBoundingClientRect().top;
};

const cloneObjectMap = (object) => {
    return JSON.parse(JSON.stringify(object));
};

const overrideObject = (base, tmpAdditional) => {
    const result = cloneObjectMap(base);
    const additional = cloneObjectMap(tmpAdditional);
    for(var key in additional) {
        if(result[key] && (typeof additional[key]) === 'object') {
            result[key] = overrideObject(result[key], additional[key]);
        } else {
            result[key] = additional[key];
        }
    }
    return result;
};

const formatCharacterDisplayTimeline = (timeline) => {
    let lastCharacterData = cloneObjectMap(timeline[0].characters);
    if(! lastCharacterData) {
        throw 'characterDisplay.timeline[0] は characters プロパティを持つ必要があります';
    }
    let lastOrderData = cloneObjectMap(timeline[0].order);
    if(! lastOrderData) {
        throw 'characterDisplay.timeline[0] は order プロパティを持つ必要があります';
    }
    const result = timeline.map((d, idx)=>{
        try {
            d.scrollPosition = d.id ? getElementPosition(document.getElementById(d.id)) : 0;
            return d;
        } catch(e) {
            console.error(e, d, idx);
            throw `${idx}番目のデータを formatCharacterDisplayTimeline で処理中に失敗しました`;
        }
    }).sort((a,b)=>{return a.scrollPosition - b.scrollPosition;}).map((d, idx)=>{
        try{
            if(d.characters && idx) {
                d.characters = overrideObject(lastCharacterData, d.characters);
                lastCharacterData = d.characters;
            } else {
                d.characters = cloneObjectMap(lastCharacterData);
            }
            if(d.order && idx) {
                lastOrderData = cloneObjectMap(d.order);
            } else {
                d.order = cloneObjectMap(lastOrderData);
            }
        } catch (e) {
            console.error(e, d, idx, lastCharacterData);
            throw `${idx}番目のデータを formatCharacterDisplayTimeline で処理中に失敗しました`;
        }
        return d;
    });
    result.push({
        scrollPosition: document.getElementsByTagName('html')[0].scrollHeight
    })
    return result;
};

const bindCharacterDisplayScrollEvent = (timeline, id) => {
    let idx = 0;
    const box = document.getElementById(`${id}-box`);
    document.getElementsByTagName('body')[0].onscroll = (e) => {
        const pos = getScrollPosition();
        for(var i = 0; i < timeline.length; i++) {
            if(timeline[i].scrollPosition > pos) {
                const target = i - 1;
                if(idx !== target) {
                    idx = target;
                    redrawCharacterDisplayBox(timeline[target], box);
                }
                i = timeline.length;
            }
        }
    };
};

const generateZoomedPictureDom = (id, src) => {
    const dom = document.createElement('div');
    dom.style.backgroundImage = `url("${src}")`;
    dom.className = `${id}-zoomedPicture`;
    return dom;
};

const bindCharacterFaceZoomView = (id) => {
    document.getElementById(id).onclick = (e) => {
        const target = e.target;
        console.log(target, target.className);
        if(target.className.includes(`${id}-box-character-pic-img`)) {
            const box = generateZoomedPictureDom(id, target.src);
            document.getElementById(id).append(box);
        } else if (target.className.includes(`${id}-zoomedPicture`)) {
            target.remove();
        }
    };
};

const characterDisplayHandle = (cd) => {
    const characterDisplay = generateDisplayDom(cd);
    document.getElementsByTagName('body')[0].appendChild(characterDisplay);
    const remappedTimeline = formatCharacterDisplayTimeline(cd.timeline);
    bindCharacterDisplayScrollEvent(remappedTimeline, characterDisplay.id);
    bindCharacterFaceZoomView(characterDisplay.id);
};

const handleLinks = (flags) => {
    const anker = flags.ankerHtml || flags.ankerHTML || flags.ankerText || flags.ankerCharacter || flags.ankerChar || flags.anker || '⚓';
    const insertAnker = (flags.ankerHtml || flags.ankerHTML) ? ((targetDom, ankerText)=>{
        const jqd = $(targetDom);
        jqd.html(`${jqd.html()} ${ankerText}`);
    }) : ((targetDom, ankerText)=>{
        const jqd = $(targetDom);
        jqd.text(`${jqd.text()} ${ankerText}`);
    });
    
    $('h2, h3, h4').each((i,v)=>{
        insertAnker(v, anker);
    });
    $('h2, h3, h4').click((e)=>{
        const dom = $(e.target);
        const id = dom.attr('id');
        navigator.clipboard.writeText(`${location.protocol}//${location.host}${location.pathname}#${id}`);
        alert('この節へのリンクをコピーしました');
    });
    
    if(location.hash && $(location.hash).length) {
        $(location.hash).css('background-color', 'yellow');
        setTimeout(()=>{$(location.hash).css('background-color', '');},       250);
        setTimeout(()=>{$(location.hash).css('background-color', 'yellow');}, 500);
        setTimeout(()=>{$(location.hash).css('background-color', '');},      1000);
        setTimeout(()=>{$(location.hash).css('background-color', 'yellow');},1500);
        setTimeout(()=>{$(location.hash).css('background-color', '');},      2500);
        setTimeout(()=>{$(location.hash).css('background-color', 'yellow');},3500);
        setTimeout(()=>{$(location.hash).css('background-color', '');},      5000);
        setTimeout(()=>{$(location.hash).css('background-color', 'yellow');},6500);
        setTimeout(()=>{$(location.hash).css('background-color', '');},      8500);
    }
};