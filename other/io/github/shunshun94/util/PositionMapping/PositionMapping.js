var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.PositionMapping = io.github.shunshun94.util.PositionMapping || {};

io.github.shunshun94.util.PositionMapping.consts = {
    className: 'io-github-shunshun94-util-PositionMapping'
};

io.github.shunshun94.util.PositionMapping.Viewer = class {
    constructor(element, config = {
        title: 'ポジションマッピング',
        top: 'row軸 上',
        bottom: 'row軸 下',
        left: 'column軸 左',
        right: 'column軸 右'
    }, items = []) {
        this.dom = element;
        this.items = [];
        this.graph = null;
        this.render(config);
        items.forEach((item) => { this.add(item); });
    }
    getItems() { return this.items; }
    add(item) {
        const itemElement = document.createElement('div');
        itemElement.className = `${io.github.shunshun94.util.PositionMapping.consts.className}-viewer-item`;
        if(item.name) {
            const nameElement = document.createElement('div');
            nameElement.textContent = item.name;
            itemElement.appendChild(nameElement);
        }
        if(item.id) { itemElement.id = item.id; }
        if(item.image) {
            itemElement.style.backgroundImage = `url(${item.image})`;
        }
        itemElement.style.left = `calc(${(Number(item.column) + 0.5) * 100}% - 30px)`;
        itemElement.style.top = `calc(${(Number(item.row) + 0.5) * 100}% - 30px)`;

        this.graph.appendChild(itemElement);
        this.items.push(item);
    }
    render(config) {
        const className = io.github.shunshun94.util.PositionMapping.consts.className + '-viewer';
        this.dom.className = className + (config.className ? ' ' + config.className : '');

        const titleElement = document.createElement('div');
        titleElement.textContent = config.title;
        titleElement.className = `${className}-title`;
        this.dom.appendChild(titleElement);

        this.graph = document.createElement('div');
        this.graph.className = `${className}-graph`;
        this.dom.appendChild(this.graph);

        const crossRowElement = document.createElement('hr');
        crossRowElement.className = `${className}-crossRow`;
        this.graph.appendChild(crossRowElement);

        const crossColumnElement = document.createElement('hr');
        crossColumnElement.className = `${className}-crossColumn`;
        this.graph.appendChild(crossColumnElement);

        ['top', 'bottom', 'left', 'right'].forEach((position) => {
            const mapTitle = document.createElement('div');
            mapTitle.textContent = config[position] || '';
            mapTitle.className = `${className}-position ${className}-position-${position}`;
            this.dom.appendChild(mapTitle);
        });
    }
};
