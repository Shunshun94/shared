var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.Ccfolia2Udonarium = io.github.shunshun94.trpg.Ccfolia2Udonarium || {};
io.github.shunshun94.trpg.Ccfolia2Udonarium.builder = io.github.shunshun94.trpg.Ccfolia2Udonarium.builder || {};

io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildImage = () => {
    const base = io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData('image');
    base.append(io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData({type: 'image', name: 'imageIdentifier', textContent: 'dummy'}));
    return base;
};

io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildCommon = (json) => {
    const base = io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData('common');
    base.append(io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData({name: 'name', textContent: json.name || 'おなまえ'}));
    base.append(io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData({name: 'size', textContent: '1'}));
    return base;
};

io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildDetail = (json) => {
    const base = io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData('detail');

    if(json.status && json.status.length) {
        const resources = io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData('リソース');
        json.status.forEach((status)=>{
            resources.append(io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData({
                type: 'numberResource', 'currentValue': status.value, textContent: status.max, name: status.label
            }));
        });
        base.append(resources);
    }

    if(json.params && json.params.length || json.initiative) {
        const static = io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData('パラメータ');
        (json.params || []).forEach((param)=>{
            static.append(io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData({
                'name': param.label, textContent: param.value
            }));
        });
        if(json.initiative) {
            static.append(io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData({
                'name': 'initiative', textContent: json.initiative
            }));
        }
        base.append(static);
    }

    if(json.externalUrl) {
        base.append(io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData({
            type: 'note', 'name': 'URL', textContent: json.externalUrl
        }));
    }

    if(json.memo) {
        const info = io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData('情報');
        info.append(io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData({
            type: 'note', 'name': '説明', textContent: json.memo
        }));
        base.append(info);
    }

    return base;
};

io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildPalette = (json) => {
    const base = document.createElement('chat-palette');
    base.textContent = json.commands || '';
    return base;
};

io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildPackage = () => {
    const package = document.createElement('character');
    package.setAttribute('location.name', 'table');
    package.setAttribute('location.x', '0');
    package.setAttribute('location.y', '0');
    package.setAttribute('posZ', '0');
    package.setAttribute('rotate', '0');
    package.setAttribute('roll', '0');
    return package;
}

io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData = (info) => {
    const base = document.createElement('data');
    if(typeof info === 'string') {
        base.setAttribute('name', info);
        return base;
    }
    for(const key in info) {
        if(key === 'textContent') {
            base.textContent = info.textContent;
        } else {
            base.setAttribute(key, info[key]);
        }
    }
    return base;
};

io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.build = (json) => {
    const package = io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildPackage();
    const base = io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildData('character');
    base.append(io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildImage(json));
    base.append(io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildCommon(json));
    base.append(io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildDetail(json));
    package.append(base);
    package.append(io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildPalette(json));
    return package;
};

io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.download = (text, opt_name) => {
	const url = window.URL.createObjectURL(new Blob([ text ], { "type" : 'text/xml;charset=utf-8;' }));
	const dlLink = document.createElement("a");
	document.body.appendChild(dlLink);
	dlLink.download = opt_name ? `${opt_name}.xml` : `saved_${Number(new Date())}.xml`;
	dlLink.href = url;
	dlLink.click();
	dlLink.remove();
	URL.revokeObjectURL(url);
};

io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.buildAsText = (json) => {
    return io.github.shunshun94.trpg.Ccfolia2Udonarium.builder.build(json).outerHTML.replaceAll('currentvalue', 'currentValue').replaceAll('posz', 'posZ');
};