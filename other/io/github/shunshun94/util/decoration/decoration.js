var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.decoration = io.github.shunshun94.util.decoration || {};
io.github.shunshun94.util.decoration.CONSTS = {
    CLASS: {
        TARGET_CLASS: 'io-github-shunshun94-util-decoration',
        CHAR_CLASS: 'io-github-shunshun94-util-decoration-char'
    }
};
io.github.shunshun94.util.decoration.exec = (
    targetClassName = io.github.shunshun94.util.decoration.CONSTS.CLASS.TARGET_CLASS,
    charClassName = io.github.shunshun94.util.decoration.CONSTS.CLASS.CHAR_CLASS
) => {
    const targetList = Array.from(document.getElementsByClassName(targetClassName));
    targetList.forEach((targetElement)=>{
        const text = targetElement.innerText;
        const length = text.length;
        const resultList = [];
        for(var i = 0; i < length; i++) {
            resultList.push(`<span class="${charClassName}" style="--char-index:${i};">${text.charAt(i)}</span>`);
        }
        targetElement.innerHTML = resultList.join('');
    });
};