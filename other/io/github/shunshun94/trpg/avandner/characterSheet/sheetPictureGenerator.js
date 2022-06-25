var appendName = (base)=>{
    var names = document.createElement('div');
    names.style="box-sizing:border-box;position:relative;left:446px;top:4px;width:350px;";
    
    var characterName = document.createElement('div');
    characterName.style = 'box-sizing:border-box;';
    
    var characterNameTitle = document.createElement('span');
    characterNameTitle.style="width:136px;box-sizing:border-box;background-color:black;color:white;padding:4px;";
    characterNameTitle.innerText = 'キャラクター名';

    var characterNameContent = document.createElement('span');
    characterNameContent.innerText = base.name;
    characterNameContent.style = 'box-sizing:border-box;padding:4px;border-right:1px none black;';

    var characterNameOtherInfo = document.createElement('span');
    characterNameOtherInfo.style = 'box-sizing:border-box;height:37px;position:relative;top:6px;display:inline-block;border-left:1px dashed black;padding:3px;font-size:9px;'
    var characterNameOtherSex = document.createElement('span');
    characterNameOtherSex.innerText = `性別：${base.sex}`;
    var characterNameOtherAge = document.createElement('span');
    characterNameOtherAge.innerText = `年齢：${base.age}`;
    characterNameOtherInfo.appendChild(characterNameOtherSex);
    characterNameOtherInfo.appendChild(document.createElement('br'));
    characterNameOtherInfo.appendChild(characterNameOtherAge);

    characterName.appendChild(characterNameTitle);
    characterName.appendChild(characterNameContent);
    characterName.appendChild(characterNameOtherInfo);
    
    const playerName = document.createElement('div');
    playerName.style = "box-sizing:border-box;position:relative;top:12px;";

    var playerNameTitle = document.createElement('span');
    playerNameTitle.style="width:136px;box-sizing:border-box;background-color:black;color:white;padding:4px;";
    playerNameTitle.innerText = 'プレイヤー名　';

    var playerNameContent = document.createElement('span');
    playerNameContent.innerText = base.player;
    playerNameContent.style = 'box-sizing:border-box;padding:4px;';

    playerName.appendChild(playerNameTitle);
    playerName.appendChild(playerNameContent);

    names.appendChild(characterName);
    names.appendChild(playerName);
    return names;
};

var generate = (data)=>{
    var base = document.createElement('div');
    base.id="sheetPicture";
    base.style='font-size:18px;box-sizing:border-box;position:absolute;top:0px;left:0px;width:800px;height:1200px;border:black;background-color:skyblue;';
    base.appendChild(appendName(data.base));
    document.getElementsByTagName('body')[0].append(base);
};
