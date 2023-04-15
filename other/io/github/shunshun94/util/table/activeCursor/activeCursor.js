var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.table = io.github.shunshun94.util.table || {};

io.github.shunshun94.util.table.bindActiveCursor = (table) => {
    table.addEventListener('mousemove', (e)=>{
        if(e.target.localName === 'td') {
            e.target.className.split(' ').forEach((className)=>{
                Array.from(table.getElementsByClassName(className)).forEach((dom)=>{
                    dom.className += ' active';
                });
            });
        }
    });
    table.addEventListener('mouseout', (e)=>{
        Array.from(table.getElementsByClassName('active')).forEach((dom)=>{
            dom.className = dom.className.replaceAll('active', '');
        });
    });
};
