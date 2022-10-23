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
    'drive.metadata',
    'userinfo.profile',
    'userinfo.email',
    'spreadsheets.readonly',
    'calendar.readonly',
    'contacts.readonly',
    'drive.appfolder',
    'drive.appdata',
    'drive',
    'drive.file'
  ];

  arr.forEach(function(item){
    scopes = scopes + url + item + ' ';
  });
  return scopes;
}

const app_name = 'gymprogressive';

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
let configSyncTimeoutId

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

  log ('Текущее время:   ' + new Date(now).toLocaleString("ru", options));
  log ('Время токена до: ' + new Date(expires_in).toLocaleString("ru", options));
  if (now > expires_in) log('Текущее время больше времени действия токена','warning');
}