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
        name: 'TRPG テキストセッションのログを変換するやつ',
        path: 'LogConverter.html',
        desc: 'ココフォリア、ユドナリウム、Tekey、Flocon、どどんとふむせる、LINE のログをログエディタの出力に変換するツール'
    }, {
        name: 'Log to CSS',
        path: 'LogToCSS.html',
        desc: '編集してクラス情報が挿入されたログから CSS を生成するツール'
    }, {
        name: 'ログと分析用 json に変換',
        path: 'logToTableJson.html',
        desc: '読み込んだファイルを表形式に変換するツール（CoC と SW2.0、SW2.5 にのみ対応）'
    }, {
        name: 'GitHub',
        path: 'https://github.com/Shunshun94/shared/tree/master/jquery/io/github/shunshun94/trpg/logEditor/',
        desc: 'ソースコードをこちらで公開しています'
    }, {
        name: 'ほしいものリスト',
        path: 'http://amzn.asia/8mNqdKy',
        desc: '支援などはこちらにお願いします'
    }
];

io.github.shunshun94.trpg.logEditor.Link.buildHtml = (list = io.github.shunshun94.trpg.logEditor.Link.getList()) => {
    const result = document.createElement('dl');
    result.className = 'io-github-shunshun94-trpg-logEditor-Link';
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
