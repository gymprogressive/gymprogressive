// https://stackoverflow.com/questions/783818/how-do-i-create-a-custom-error-in-javascript

/**
 * Ключи доступа
 */ 

const GOOGLE_API_KEY = 'AIzaSyBPtXcGno5ywS42kvzSpB6HAvgzgct6rLc';
const GOOGLE_CLIENT_ID = '624974603531-khuubvttovq900rh9iki38cta657d0bc.apps.googleusercontent.com';

/** 
* Разрешения
*
* Список по ссылке:
* https://developers.google.com/identity/protocols/oauth2/scopes
*/
let SCOPES = getScopes();

function getScopes() {
  let scopes = '';
  const url = 'https://www.googleapis.com/auth/';
  const arr = [
    'userinfo.profile',
    'userinfo.email',
    'spreadsheets.readonly',
    'calendar.readonly',
    'contacts.readonly',
    'drive',
    'drive.appfolder',
    'drive.appdata',
    'drive.metadata',
    'drive.file',
    'gmail.readonly',
    'gmail.send'
  ];

  arr.forEach(function(item){
    scopes = scopes + url + item + ' ';
  });
  return scopes;
}

const app_name = 'gymprogressive';

let tokenCheckTimeoutId;

const CHECK_PERIOD = 1000 * 60 * 1;     // 1 минута

const configFileName = app_name + '_config.json';

let configFileId;

// Интервал между синхронизациями конфига
const SYNC_PERIOD = 1000 * 60 * 3;     // 3 минуты
// Конфигурация по умолчанию
let CONFIG = {
    app_name: 'gymprogressive',
    app_name_ru: 'Жим Прогрессивный'
    // ...

}

// храним ID таймера синхронизации, чтобы иметь возможность его сбросить
let configSyncTimeoutId;

let USER;

/*

gapi.client.gmail.CJ
                 .users
                       .threads
                       .dratfs
                       .history
                       .labels
                       .settings
                                .forwardingAddresses
                                .delegates
                                .filters
                                .sendAs
                       .messages
                                .attachments

*/

let Logo = async () => {
  log(await gapi.client);
let str = `
 +--------------------------------------+\ 
 |                                      |\ 
 |          Жим "Прогрессивный          |\ 
 |                                      |\ 
 |                © 2022                |\ 
 +--------------------------------------+\ 
` 
  log(str,'DarkGreen','PaleGreen');
}

let TokenExpires = (now, expires_in) => {
  let options = {
    //era: 'long',
    year: 'numeric',
    month: 'numeric',
    //month: 'long',
    day: 'numeric',
    //weekday: 'long',
    timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

  log ('Время токена до: ' + new Date(expires_in).toLocaleString("ru", options));
  
  if ((expires_in - now) > 0) { log ('Осталось: ' + Math.round((expires_in - now)/1000) + ' cекунд');
  } else { log ('Токен истёк','warning'); }

  return expires_in - now;
}

let programs = {'list':[
  {
    'program':'Большая шестерка',
    'progressions':[
      {
        'name':'Отжимания',
        'excersises':[
          {'name':'Отжимания от стены','levels':[{'sets': 1,'reps': 10},{'sets': 2,'reps': 25},{'sets': 3,'reps': 50}]},
          {'name':'Отжимания в наклоне','levels':[{'sets': 1,'reps': 10},{'sets': 2,'reps': 20},{'sets': 3,'reps': 40}]},
          {'name':'Отжимания на коленях','levels':[{'sets': 1,'reps': 10},{'sets': 2,'reps': 15},{'sets': 3,'reps': 30}]},
          {'name':'Неполные отжимания','levels':[{'sets': 1,'reps': 8},{'sets': 2,'reps': 35},{'sets': 3,'reps': 50}]},
          {'name':'Полные отжимания','levels':[{'sets': 1,'reps': 5},{'sets': 2,'reps': 10},{'sets': 2,'reps': 30}]},
          {'name':'Узкие отжимания','levels':[{'sets': 1,'reps': 5},{'sets': 2,'reps': 10},{'sets': 2,'reps': 30}]},
          {'name':'Разновысокие отжимания','levels':[{'sets': 1,'reps': [5, 5]},{'sets': 2,'reps': [10, 10]},{'sets': 2,'reps':[20, 20]}]},
          {'name':'Неполные отжимания на одной руке','levels':[{'sets': 1,'reps': [5, 5]},{'sets': 2,'reps': [10, 10]},{'sets': 2,'reps':[20, 20]}]},
          {'name':'Отжимания на одной руке с поддержкой','levels':[{'sets': 1,'reps': [5, 5]},{'sets': 2,'reps': [10, 10]},{'sets': 2,'reps':[20, 20]}]},
          {'name':'Отжимания на одной руке','levels':[{'sets': 1,'reps': [5, 5]},{'sets': 2,'reps': [10, 10]},{'sets': 2,'reps':[50, 50]}]}
        ]},
      {
        'name':'Присядания',
        'excersises':[
          {'name':'Приседания в стойке на плечах','levels':[{'sets': 1,'reps': 10},{'sets': 2,'reps': 20},{'sets': 3,'reps': 40}]},
          {'name':'Приседания Складной нож','levels':[{'sets': 1,'reps': 10},{'sets': 2,'reps': 20},{'sets': 3,'reps': 30}]},
          {'name':'Приседания с поддержкой','levels':[{'sets': 1,'reps': 10},{'sets': 2,'reps': 15},{'sets': 3,'reps': 20}]},
          {'name':'Неполные приседания','levels':[{'sets': 1,'reps': 8},{'sets': 2,'reps': 11},{'sets': 2,'reps': 15}]},
          {'name':'Полные приседания','levels':[{'sets': 1,'reps': 5},{'sets': 2,'reps': 8},{'sets': 2,'reps': 10}]},
          {'name':'Узкие приседания','levels':[{'sets': 1,'reps': 5},{'sets': 2,'reps': 8},{'sets': 2,'reps': 10}]},
          {'name':'Разновысокие приседания','levels':[{'sets': 1,'reps': [5, 5]},{'sets': 2,'reps': [7, 7]},{'sets': 2,'reps': [9, 9]}]},
          {'name':'Неполные приседания на одной ноге','levels':[{'sets': 1,'reps': [4, 4]},{'sets': 2,'reps': [6, 6]},{'sets': 2,'reps': [8, 8]}]},
          {'name':'Приседания на одной ноге с поддержкой','levels':[{'sets': 1,'reps': [3, 3]},{'sets': 2,'reps': [5, 5]},{'sets': 3,'reps': [7, 7]}]},
          {'name':'Приседания на одной ноге','levels':[{'sets': 1,'reps': [1, 1]},{'sets': 2,'reps': [3, 3]},{'sets': 2,'reps': [6, 6]}]}
        ]},
      {
        'name':'Подтягивания',
        'excersises':[
          {'name':'Вертикальные подтягивания','levels':[{'sets': 1,'reps': 10},{'sets': 2,'reps': 25},{'sets': 3,'reps': 40}]},
          {'name':'Горизонтальные подтягивания','levels':[{'sets': 1,'reps': 10},{'sets': 2,'reps': 20},{'sets': 3,'reps': 30}]},
          {'name':'Подтягивания Складной нож','levels':[{'sets': 1,'reps': 10},{'sets': 2,'reps': 15},{'sets': 3,'reps': 20}]},
          {'name':'Неполные подтягивания','levels':[{'sets': 1,'reps': 8},{'sets': 2,'reps': 11},{'sets': 3,'reps': 15}]},
          {'name':'Полные подтягивания','levels':[{'sets': 1,'reps': 5},{'sets': 2,'reps': 8},{'sets': 2,'reps': 10}]},
          {'name':'Узкие подтягивания','levels':[{'sets': 1,'reps': 5},{'sets': 2,'reps': 8},{'sets': 2,'reps': 10}]},
          {'name':'Разновысокие подтягивания','levels':[{'sets': 1,'reps': [5, 5]},{'sets': 2,'reps': [7, 7]},{'sets': 2,'reps': [9, 9]}]},
          {'name':'Неполные подтягивания на одной руке','levels':[{'sets': 1,'reps': [4, 4]},{'sets': 2,'reps': [6, 6]},{'sets': 2,'reps': [8, 8]}]},
          {'name':'Подтягивания на одной руке с поддержкой','levels':[{'sets': 1,'reps': [3, 3]},{'sets': 2,'reps': [5, 5]},{'sets': 2,'reps': [7, 7]}]},
          {'name':'Подтягивания на одной руке','levels':[{'sets': 1,'reps': [2, 2]},{'sets': 2,'reps': [3, 3]},{'sets': 2,'reps': [6, 6]}]}
        ]},
      {
        'name':'Подъем ног',
        'excersises':[
          {'name':'Подтягивание коленей к груди','levels':[{'sets': 1,'reps': 10},{'sets': 2,'reps': 20},{'sets': 3,'reps': 40}]},
          {'name':'Подьемы коленей из положения лёжа','levels':[{'sets': 1,'reps': 10},{'sets': 2,'reps': 20},{'sets': 3,'reps': 35}]},
          {'name':'Подъемы согнутых ног лёжа','levels':[{'sets': 1,'reps': 10},{'sets': 2,'reps': 15},{'sets': 3,'reps': 30}]},
          {'name':'Подъёмы ног Лягушка','levels':[{'sets': 1,'reps': 8},{'sets': 2,'reps': 15},{'sets': 3,'reps': 25}]},
          {'name':'Подъёмы прямых ног из положения лёжа','levels':[{'sets': 1,'reps': 5},{'sets': 2,'reps': 10},{'sets': 2,'reps': 20}]},
          {'name':'Подтягивание коленей в висе','levels':[{'sets': 1,'reps': 5},{'sets': 2,'reps': 10},{'sets': 2,'reps': 15}]},
          {'name':'Подъёмы согнутых ног в висе','levels':[{'sets': 1,'reps': 5},{'sets': 2,'reps': 10},{'sets': 2,'reps': 15}]},
          {'name':'Подъёмы ног в висе Лягушка','levels':[{'sets': 1,'reps': 5},{'sets': 2,'reps': 10},{'sets': 2,'reps': 15}]},
          {'name':'Неполные подъемы прямых ног в висе','levels':[{'sets': 1,'reps': 5},{'sets': 2,'reps': 10},{'sets': 2,'reps': 15}]},
          {'name':'Подъёмы прямых ног в висе','levels':[{'sets': 1,'reps': 5},{'sets': 2,'reps': 10},{'sets': 2,'reps': 30}]}
        ]},
      {
        'name':'Мостик',
        'excersises':[
          {'name':'Мостик от плеч','levels':[{'sets': 1,'reps': 10},{'sets': 2,'reps': 25},{'sets': 3,'reps': 50}]},
          {'name':'Прямой Мостик','levels':[{'sets': 1,'reps': 10},{'sets': 2,'reps': 20},{'sets': 3,'reps': 40}]},
          {'name':'Мостик из обратного наклона','levels':[{'sets': 1,'reps': 8},{'sets': 2,'reps': 15},{'sets': 3,'reps': 30}]},
          {'name':'Мостик из упора на голову','levels':[{'sets': 1,'reps': 8},{'sets': 2,'reps': 15},{'sets': 2,'reps': 25}]},
          {'name':'Полумостик','levels':[{'sets': 1,'reps': 8},{'sets': 2,'reps': 15},{'sets': 2,'reps': 20}]},
          {'name':'Полный Мостик','levels':[{'sets': 1,'reps': 6},{'sets': 2,'reps': 10},{'sets': 2,'reps': 15}]},
          {'name':'Мостик по стенке вниз','levels':[{'sets': 1,'reps': 3},{'sets': 2,'reps': 6},{'sets': 2,'reps': 10}]},
          {'name':'Мостик по стенке вверх','levels':[{'sets': 1,'reps': 2},{'sets': 2,'reps': 4},{'sets': 2,'reps': 6}]},
          {'name':'Неполный Мостик из положения стоя','levels':[{'sets': 1,'reps': 1},{'sets': 2,'reps': 3},{'sets': 2,'reps': 6}]},
          {'name':'Полный Мостик из положения стоя','levels':[{'sets': 1,'reps': 1},{'sets': 2,'reps': 3},{'sets': 2,'reps': 30}]}
        ]},
      {
        'name':'Стойка',
        'excersises':[
          {'name':'Стойка на голове у стены','levels':[{'sets': 1,'reps':'30s'},{'sets': 1,'reps':'60s'},{'sets': 1,'reps': '120s'}]},
          {'name':'Стойка Ворон','levels':[{'sets': 1,'reps': '10s'},{'sets': 1,'reps': '30s'},{'sets': 1,'reps': '60s'}]},
          {'name':'Стойка на руках у стены','levels':[{'sets': 1,'reps': '30s'},{'sets': 1,'reps': '60s'},{'sets': 1,'reps': '120s'}]},
          {'name':'Неполные отжимания в стойке у стены','levels':[{'sets': 1,'reps': 5},{'sets': 2,'reps': 10},{'sets': 2,'reps': 20}]},
          {'name':'Отжимания в стойке на руках у стены','levels':[{'sets': 1,'reps': 5},{'sets': 2,'reps': 10},{'sets': 2,'reps': 15}]},
          {'name':'Узкие отжимания в стойке на руках','levels':[{'sets': 1,'reps': 5},{'sets': 2,'reps': 9},{'sets': 2,'reps': 12}]},
          {'name':'Разновысокие отжимания в стойке','levels':[{'sets': 1,'reps': [5, 5]},{'sets': 2,'reps': [8, 8]},{'sets': 2,'reps': [10, 10]}]},
          {'name':'Неполные отжимания в стойке на одной руке','levels':[{'sets': 1,'reps': [4, 4]},{'sets': 2,'reps': [6, 6]},{'sets': 2,'reps': [8, 8]}]},
          {'name':'Отжимания в стойке на одной руке с поддержкой','levels':[{'sets': 1,'reps': [3, 3]},{'sets': 2,'reps': [4, 4]},{'sets': 2,'reps': [6, 6]}]},
          {'name':'Отжимания в стойке на одной руке','levels':[{'sets': 1,'reps': [1, 1]},{'sets': 2,'reps': [2, 2]},{'sets': 2,'reps': [5, 5]}]}
        ]
      }
    ]
  }
]};

let excersises = {'list':[
  {'id':1,'name':'Отжимания от стены','description':'','level':'','group':'Отжимания','links':[]}
]};

// async / await
// https://habr.com/ru/company/skillbox/blog/458950/?ysclid=la4x7huwo4850619620
// Google Workspace browser samples
// https://github.com/googleworkspace/browser-samples
// https://developers.google.com/gmail/api/quickstart/js
// https://smtpjs.com/
// https://app.elasticemail.com/