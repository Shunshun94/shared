var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.OpenCampaignCalendar = io.github.shunshun94.trpg.OpenCampaignCalendar || {};

io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS = io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS || {};
io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.RAXIA_LIFE_NEO = io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.RAXIA_LIFE_NEO || {};
io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.RAXIA_LIFE_3RD = io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.RAXIA_LIFE_3RD || {};
io.github.shunshun94.trpg.OpenCampaignCalendar.CONSTS.RAXIA_LIFE_3RD.SPECIAL_DAYS = [
  {
    "key": "0127",
    "list": [
      {
        "name": "モーネ誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=Nl3Piy"
      }
    ]
  },
  {
    "key": "0224",
    "list": [
      {
        "name": "フェリシア誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=mGE1A5"
      }
    ]
  },
  {
    "key": "0301",
    "list": [
      {
        "name": "シャーロット誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=hwVy6T"
      }, {
        "name": "フロラ誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=TYWFC9"
      }
    ]
  },
  {
    "key": "0303",
    "list": [
      {
        "name": "クリスティ誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=g7T7te"
      }
    ]
  },
  {
    "key": "0306",
    "list": [
      {
        "name": "レジェダ誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=Gm9Btr"
      }
    ]
  },
  {
    "key": "0329",
    "list": [
      {
        "name": "レオン誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=FVOXHZ"
      }
    ]
  },
  {
    "key": "0331",
    "list": [
      {
        "name": "サーティア誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=vN8Wti"
      }
    ]
  },
  {
    "key": "0401",
    "list": [
      {
        "name": "カレン誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=7vNjQm"
      }
    ]
  },
  {
    "key": "0406",
    "list": [
      {
        "name": "マニオイディア誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=j0nmue"
      }
    ]
  },
  {
    "key": "0407",
    "list": [
      {
        "name": "ウォンチュン誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=rTae2P"
      }
    ]
  },
  {
    "key": "0408",
    "list": [
      {
        "name": "リオ誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=YFIUg9"
      }
    ]
  },
  {
    "key": "0423",
    "list": [
      {
        "name": "セルマ誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=uqOzAE"
      }
    ]
  },
  {
    "key": "0612",
    "list": [
      {
        "name": "ハリエット誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=bTsZoF"
      },
      {
        "name": "レオネス誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=DflTQD"
      }
    ]
  },
  {
    "key": "0704",
    "list": [
      {
        "name": "カイ誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=nIcLq4"
      }
    ]
  },
  {
    "key": "0710",
    "list": [
      {
        "name": "スフェン誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=7nBddE"
      }
    ]
  },
  {
    "key": "0814",
    "list": [
      {
        "name": "アンビオ誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=ALG81s"
      }
    ]
  },
  {
    "key": "0815",
    "list": [
      {
        "name": "ヨミヅ誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=x2kjVG"
      }
    ]
  },
  {
    "key": "0914",
    "list": [
      {
        "name": "ルミア誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=IE8Up2"
      }
    ]
  },
  {
    "key": "0917",
    "list": [
      {
        "name": "グリム誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=TKiv8O"
      }
    ]
  },
  {
    "key": "1001",
    "list": [
      {
        "name": "うすはね誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=n5Ehb5"
      }
    ]
  },
  {
    "key": "1004",
    "list": [
      {
        "name": "シア誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=a6C3j2"
      }
    ]
  },
  {
    "key": "1219",
    "list": [
      {
        "name": "プリムラ誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=dzZwZ1"
      }
    ]
  },
  {
    "key": "1229",
    "list": [
      {
        "name": "シキ誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=1qHZvk"
      }
    ]
  },
  {
    "key": "1231",
    "list": [
      {
        "name": "アブサン誕生日",
        "url": "https://yutorize.work/ytsheet/sw2.5/?id=7rCvLI"
      }
    ]
  }
];
