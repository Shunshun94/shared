var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.PositionMapping = io.github.shunshun94.util.PositionMapping || {};

io.github.shunshun94.util.PositionMapping.consts = {
    className: 'io-github-shunshun94-util-PositionMapping'
};

io.github.shunshun94.util.PositionMapping.Editor = class {
    constructor(element, config = {
        title: 'タイトル',
        titleEditable: true,
        top: '縦軸 上',
        topEditable: true,
        bottom: '縦軸 下',
        bottomEditable: true,
        left: '横軸 左',
        leftEditable: true,
        right: '横軸 右',
        rightEditable: true
    }, items = []) {
        this.id = element.id || Math.random().toString(36).substr(2, 9);
        this.dom = element;
        this.items = [];
        this.graph = null;
        this.render(config);
        items.forEach((item) => { this.add(item); });
    }
    bindDragEvents(itemElement) {
        const draggingClass = `${io.github.shunshun94.util.PositionMapping.consts.className}-editor-dragging`;
        let offsetX = 0;
        let offsetY = 0;
        let isDragging = false;
        const getEventPosition = (e) => {
            if (e.touches) {
                return {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
            } else {
                return {
                    x: e.clientX,
                    y: e.clientY
                };
            }
        };
        const startDrag = (e) => {
            e.preventDefault();
            const pos = getEventPosition(e);
            const target = itemElement.getBoundingClientRect();
            isDragging = true;
            offsetX = pos.x - target.left;
            offsetY = pos.y - target.top;
            itemElement.classList.add(draggingClass);
        };
        const moveDrag = (e) => {
            if(! isDragging) { return; }
            const pos = getEventPosition(e);
            const area = this.graph.getBoundingClientRect();

            let left= pos.x - area.left - offsetX;
            let top = pos.y - area.top - offsetY;
            left = Math.max(0, Math.min(left, area.width - itemElement.clientWidth));
            top = Math.max(0, Math.min(top, area.height - itemElement.clientHeight));

            itemElement.style.left = `${left}px`;
            itemElement.style.top = `${top}px`;
        };
        const endDrag = (e) => { isDragging = false; itemElement.classList.remove(draggingClass); };
        itemElement.addEventListener('mousedown', startDrag);
        itemElement.addEventListener('touchstart', startDrag);
        itemElement.addEventListener('mousemove', moveDrag);
        itemElement.addEventListener('touchmove', moveDrag);
        itemElement.addEventListener('mouseup', endDrag);
        itemElement.addEventListener('touchend', endDrag);
    }
    generateItemElement(item) {
        const itemElement = document.createElement('div');
        itemElement.className = `${io.github.shunshun94.util.PositionMapping.consts.className}-viewer-item`;
        if(item.name) {
            const nameElement = document.createElement('div');
            nameElement.textContent = item.name;
            itemElement.appendChild(nameElement);
        }
        itemElement.id = `${this.id}-${item.id}`;
        if(item.image) {
            itemElement.style.backgroundImage = `url(${item.image})`;
        }
        itemElement.style.left = `calc(${(Number(item.column || '0') + 0.5) * 100}% - 30px)`;
        itemElement.style.top = `calc(${(Number(item.row || '0') + 0.5) * 100}% - 30px)`;
        itemElement.draggable = true;
        return itemElement;
    }
    add(item) {
        if(! item.id) {
            item.id = Math.random().toString(36).substr(2, 9);
        }
        const itemElement = this.generateItemElement(item);
        this.graph.appendChild(itemElement);
        this.bindDragEvents(itemElement);
        this.items.push(item);
    }
    getItems() {
        return this.items.map((item)=>{
            const itemElement = this.graph.querySelector(`#${this.id}-${item.id}`);
            const area = this.graph.getBoundingClientRect();
            const left = parseFloat(itemElement.style.left) + 30;
            const top = parseFloat(itemElement.style.top) + 30;
            item.column = (left / area.width) - 0.5;
            item.row = (top / area.height) - 0.5;
            return item;
        });
    }
    getConfig() {
        const getText = (element) => {
            if(element.tagName === 'INPUT') {
                return element.value;
            } else {
                return element.textContent;
            }
        };
        const config = {};
        config.title = getText(this.dom.querySelector(`.${io.github.shunshun94.util.PositionMapping.consts.className}-editor-title`));
        ['top', 'bottom', 'left', 'right'].forEach((position) => {
            const element = this.dom.querySelector(`.${io.github.shunshun94.util.PositionMapping.consts.className}-editor-position-${position}`);
            config[position] = getText(element);
        });
        return config;
    }
    render(config) {
        const generateTextElement = (columnName, classNameSuffix = false) => {
            const element = document.createElement(config[`${columnName}Editable`] ? 'input' : 'div');
            element.className = `${io.github.shunshun94.util.PositionMapping.consts.className}-editor-` + (classNameSuffix ? classNameSuffix : columnName);
            if(config[`${columnName}Editable`]) {
                element.type = 'text';
                element.value = config[columnName] || '';
                element.name = columnName;
            } else {
                element.textContent = config[columnName] || '';
            }
            return element;
        };
        const className = io.github.shunshun94.util.PositionMapping.consts.className + '-editor';
        this.dom.className = className + (config.className ? ' ' + config.className : '');

        const titleElement = generateTextElement('title');
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
            const mapTitle = generateTextElement(position, `position ${className}-position-${position}`);
            this.dom.appendChild(mapTitle);
        });
    }
};

io.github.shunshun94.util.PositionMapping.Viewer = class {
    constructor(element, config = {
        title: 'ポジションマッピング',
        top: 'row軸 上',
        bottom: 'row軸 下',
        left: 'column軸 左',
        right: 'column軸 右'
    }, items = []) {
        this.id = element.id || Math.random().toString(36).substr(2, 9);
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
        if(item.id) { itemElement.id = `${this.id}-${item.id}`; }
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
