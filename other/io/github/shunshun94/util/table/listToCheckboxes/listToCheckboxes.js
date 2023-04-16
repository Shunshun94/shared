var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.table = io.github.shunshun94.util.table || {};
io.github.shunshun94.util.table.listToCheckboxes = io.github.shunshun94.util.table.listToCheckboxes || {};

io.github.shunshun94.util.table.listToCheckboxes.ModifyListEvent = 'io-github-shunshun94-util-table-listToCheckboxes-ModifyListEvent';

io.github.shunshun94.util.table.listToCheckboxes.generateList = (list, name) => {
    const result = document.createElement('ul');
    list.forEach((item, id)=>{
        if(item.trim()) {
            const itemDom = document.createElement('li');
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            const text = document.createElement('span');
            checkbox.type = 'checkbox';
            checkbox.value = `${name}_${id}`;
            checkbox.checked = true;
            text.textContent = item;
            label.append(checkbox);
            label.append(text);
            itemDom.append(label);
            result.append(itemDom);
        }
    });
    result.addEventListener('input', (e)=>{
        const event = new Event(io.github.shunshun94.util.table.listToCheckboxes.ModifyListEvent, {bubbles: true});
        event.list = Array.from(result.children).map((li)=>{
            return li.getElementsByTagName('input')[0];
        }).filter((input)=>{
            return input.checked;
        }).map((input)=>{
            return input.value;
        });
        result.dispatchEvent(event);
    });
    return result;
};
