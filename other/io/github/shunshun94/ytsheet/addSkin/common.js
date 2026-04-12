var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.ytsheet = io.github.shunshun94.ytsheet || {};
io.github.shunshun94.ytsheet.addSkin = io.github.shunshun94.ytsheet.addSkin || {};

io.github.shunshun94.ytsheet.addSkin.param = io.github.shunshun94.ytsheet.addSkin.param || com.hiyoko.util.getQueries();

io.github.shunshun94.ytsheet.addSkin.getUserId = () => {
    const userIdCandiate = /ytsheet2=(\d+)/.exec(document.cookie);
    return (userIdCandiate) ? userIdCandiate[1] : '';
};

io.github.shunshun94.ytsheet.addSkin.userId = io.github.shunshun94.ytsheet.addSkin.getUserId();

/**
 * ゆとシートの出力メニューにボタンを追加します
 * @param {string} buttonId ボタンに付与する HTML の ID 属性値です
 * @param {string} buttonText  ボタンに表示するテキストです
 * @param {function} onClickFunction ボタンを押した際に実行される関数です
 * @param {string} beforeElementId この ID を持つ要素の後ろにボタンを配置します。afterElementId と両方していした場合はこちらが優先されます。afterElementId もこれも指定しない場合は配置されません。
 * @param {string} afterElementId この ID を持つ要素の前にボタンを配置します。beforeElementId もこれも指定しない場合は配置されません。
 * @param {string} popupDescription ボタンにカーソルを合わせた際に表示される説明です
 * @param {string} smallDescription ボタンの下に小さく表示される説明です
 * @returns 生成されたボタンの HTML 要素です
 */
io.github.shunshun94.ytsheet.addSkin.drawDownloadButton = (
    buttonId,
    buttonText,
    onClickFunction,
    beforeElementId,
    afterElementId,
    popupDescription = '',
    smallDescription = '',
) => {
    const buttonBase = document.createElement('li');
	buttonBase.setAttribute('id', buttonId);
	const button = document.createElement('a');
	button.appendChild(document.createTextNode(buttonText));
    button.onclick = (e)=>{onClickFunction(e);};

    if(popupDescription) {
        button.title = popupDescription;
    }
    if(smallDescription) {
        const smallNotification = document.createElement('small');
	    smallNotification.textContent = `（${smallDescription}）`;
        button.appendChild(smallNotification);
    }
	buttonBase.appendChild(button);
    if(beforeElementId) {
        document.getElementById(beforeElementId).after(buttonBase);
    }
    if(afterElementId) {
        document.getElementById(afterElementId).before(buttonBase);
    }
    return buttonBase;
};

/**
 * トップメニューにボタンを追加します
 * @param {string} buttonHtml 
 * @param {string} url 
 * @returns 追加されたボタンの HTML 要素
 */
io.github.shunshun94.ytsheet.addSkin.drawTopMenuButton = (buttonHtml, url) => {
    const navUl = document.getElementsByTagName('nav')[0].getElementsByTagName('ul')[0];
    const lastLi = Array.from(navUl.children).at(-1);
    const newMenu = document.createElement('li');
    newMenu.innerHTML = `<a href="${url}"><span>${buttonHtml}</span></a>`;
    navUl.insertBefore(newMenu, lastLi);
    return newMenu;
};
