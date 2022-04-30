const createLink = (dom) => {
    const a = document.createElement('a');
    a.href = `#${dom.id}`;
    a.innerText = dom.innerText;
    return a;
}
const list = [].concat.apply([], ['h2', 'h3'].map((tag)=>{
    return Array.from(document.getElementsByTagName(tag)).map((d)=>{
       return {
           dom: d, pos: d.offsetTop, tag: tag
       };
    });
})).sort((a,b)=>{return a.pos - b.pos});
let major = 0;
let minor = 0;
list.forEach((d)=>{
    const pastText = d.dom.textContent;
    if(d.tag === 'h2') {
        minor = 0;
        major++;
        d.dom.textContent = `${major}. ${pastText}`;
    }
    if(d.tag === 'h3') {
        minor++;
        d.dom.textContent = `${major}.${minor}. ${pastText}`;
    }
    d.dom.id = `header_${major}_${minor}`;
});
const lis = [];
let currentH2Li = false;
list.forEach((d)=>{
    if(d.tag === 'h2') {
        if(currentH2Li) {
            lis.push(currentH2Li.outerHTML);
        }
        currentH2Li = document.createElement('li');
        currentH2Li.appendChild(createLink(d.dom));
        currentH2Li.appendChild(document.createElement('ul'));
    }
    if(d.tag === 'h3') {
        const li = document.createElement('li');
        li.appendChild(createLink(d.dom));
        currentH2Li.getElementsByTagName('ul')[0].appendChild(li);
    }
});
lis.push(currentH2Li.outerHTML);
document.getElementById('content').innerHTML = `<h2>目次</h2><ul>${lis.join('')}</ul>`;
