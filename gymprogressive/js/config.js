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

let Logo = () => {
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
          {'name':'Отжимания от стены','levels':[{'sets':'','reps':''},{'sets':'','reps':''},{'sets':'','reps':''}]},
          {'name':'Отжимания в наклоне'},
          {'name':'Отжимания на коленях'},
          {'name':'Неполные отжимания'},
          {'name':'Полные отжимания'},
          {'name':'Узкие отжимания'},
          {'name':'Разновысокие отжимания'},
          {'name':'Неполные отжимания на одной руке'},
          {'name':'Отжимания на одной руке с поддержкой'},
          {'name':'Отжимания на одной руке'}
        ]},
      {
        'name':'Присядания',
        'excersises':[
          {'name':'Приседания в стойке на плечах'},
          {'name':'Приседания Складной нож'},
          {'name':'Приседания с поддержкой'},
          {'name':'Неполные приседания'},
          {'name':'Полные приседания'},
          {'name':'Узкие приседания'},
          {'name':'Разновысокие приседания'},
          {'name':'Неполные приседания на одной ноге'},
          {'name':'Приседания на одной ноге с поддержкой'},
          {'name':'Приседания на одной ноге'}
        ]},
      {
        'name':'Подтягивания',
        'excersises':[
          {'name':'Вертикальные подтягивания'},
          {'name':'Горизонтальные подтягивания'},
          {'name':'Подтягивания Складной нож'},
          {'name':'Неполные подтягивания'},
          {'name':'Полные подтягивания'},
          {'name':'Узкие подтягивания'},
          {'name':'Разновысокие подтягивания'},
          {'name':'Неполные подтягивания на одной руке'},
          {'name':'Подтягивания на одной руке с поддержкой'},
          {'name':'Подтягивания на одной руке'}
        ]},
      {
        'name':'Подъем ног',
        'excersises':[
          {'name':'Подтягивание коленей к груди'},
          {'name':'Подьемы коленей из положения лёжа'},
          {'name':'Подъемы согнутых ног лёжа'},
          {'name':'Подъёмы ног Лягушка'},
          {'name':'Подъёмы прямых ног из положения лёжа'},
          {'name':'Подтягивание коленей в висе'},
          {'name':'Подъёмы согнутых ног в висе'},
          {'name':'Подъёмы ног в висе Лягушка'},
          {'name':'Неполные подъемы прямых ног в висе'},
          {'name':'Подъёмы прямых ног в висе'}
        ]},
      {
        'name':'Мостик',
        'excersises':[
          {'name':'Мостик от плеч'},
          {'name':'Прямой Мостик'},
          {'name':'Мостик из обратного наклона'},
          {'name':'Мостик из упора на голову'},
          {'name':'Полумостик'},
          {'name':'Полный Мостик'},
          {'name':'Мостик по стенке вниз'},
          {'name':'Мостик по стенке вверх'},
          {'name':'Неполный Мостик из положения стоя'},
          {'name':'Полный Мостик из положения стоя'}
        ]},
      {
        'name':'Стойка',
        'excersises':[
          {'name':'Стойка на голове у стены'},
          {'name':'Стойка Ворон'},
          {'name':'Стойка на руках у стены'},
          {'name':'Неполные отжимания в стойке у стены'},
          {'name':'Отжимания в стойке на руках у стены'},
          {'name':'Узкие отжимания в стойке на руках'},
          {'name':'Разновысокие отжимания в стойке'},
          {'name':'Неполные отжимания в стойке на одной руке'},
          {'name':'Отжимания в стойке на одной руке с поддержкой'},
          {'name':'Отжимания в стойке на одной руке'}
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