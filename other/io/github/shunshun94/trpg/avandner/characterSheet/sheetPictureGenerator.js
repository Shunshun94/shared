var base = document.createElement('div');
base.id="sheetPicture";
base.style='font-size:12px;box-sizing:border-box;position:absolute;top:0px;left:0px;width:800px;height:1200px;border:black;background-color:#FAFAFA;';

var names = document.createElement('div');
names.style="position:relative;left:446px;top:4px;width:350px;";

var characterName = document.createElement('div');

var characterNameTitle = document.createElement('span');
characterNameTitle.style="background-color:black;color:white;border:1px solid black;padding:4px;";
characterNameTitle.innerText = 'キャラクター名';
var characterNameContent = document.createElement('span');
characterNameContent.innerText = 'デルフィス';
characterNameContent.style = 'border:1px solid black;padding:4px;'

characterName.appendChild(characterNameTitle);
characterName.appendChild(characterNameContent);
names.appendChild(characterName);
base.appendChild(names);

document.getElementsByTagName('body')[0].append(base);