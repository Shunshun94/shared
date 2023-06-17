var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.logEditor = io.github.shunshun94.trpg.logEditor || {};
io.github.shunshun94.trpg.logEditor.Link = io.github.shunshun94.trpg.logEditor.Link || {};

io.github.shunshun94.trpg.logEditor.Link.LIST = [
    {
        name: 'ログエディタ',
        path: 'LogEditor.html',
        desc: 'ココフォリア、ユドナリウム、Tekey、Flocon、どどんとふむせる、LINE のログを並び替えたり編集したりするツール'
    }, {
        name: 'Log to HTML',
        path: 'LogConverter.html',
        desc: 'ココフォリア、ユドナリウム、Tekey、Flocon、どどんとふむせる、LINE のログをログエディタの出力に変換するツール'
    }, {
        name: 'Log to CSS',
        path: 'LogToCSS.html',
        desc: 'アップロードしたログの各要素のクラスから CSS を生成するツール'
    }, {
        name: 'ログと分析用 json に変換',
        path: 'logToTableJson.html',
        desc: '読み込んだファイルを表形式に変換するツール'
    }
];

io.github.shunshun94.trpg.logEditor.Link.buildHtml = (list = io.github.shunshun94.trpg.logEditor.Link.getList()) => {
    const result = document.createElement('dl');
    list.map((elem)=>{
        const title = document.createElement('dt');
        const titleLink = document.createElement('a');
        titleLink.setAttribute('rel',    'noopener noreferrer');
        titleLink.setAttribute('target', '_blank');
        titleLink.setAttribute('href',    elem.path);
        titleLink.textContent = elem.name;
        title.append(titleLink);

        const desc = document.createElement('dd');
        desc.textContent = elem.desc;

        result.append(title);
        result.append(desc);
    });
    return result;
};

io.github.shunshun94.trpg.logEditor.Link.getList = (ignorePath = io.github.shunshun94.trpg.logEditor.Link.getCurrentFileName()) => {
    return io.github.shunshun94.trpg.logEditor.Link.LIST.filter((d)=>{
        return d.path !== ignorePath;
    });
};

io.github.shunshun94.trpg.logEditor.Link.getCurrentFileName = () => {
    const path = location.pathname.split('/').reverse();
    return path.find((t)=>{return t;}) || '';
};
