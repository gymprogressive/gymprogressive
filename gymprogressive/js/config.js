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

const SCOPES = 'https://www.googleapis.com/auth/drive.metadata \
            https://www.googleapis.com/auth/userinfo.profile \
            https://www.googleapis.com/auth/userinfo.email \
            https://www.googleapis.com/auth/spreadsheets.readonly \
            https://www.googleapis.com/auth/calendar.readonly \
            https://www.googleapis.com/auth/contacts.readonly \
            https://www.googleapis.com/auth/drive.appfolder \
            https://www.googleapis.com/auth/drive.appdata \
            https://www.googleapis.com/auth/drive \
            https://www.googleapis.com/auth/drive.file';

const app_name = 'gymprogressive';

const configFileName = app_name + '_config.json';

let configFileId;

// Интервал между синхронизациями конфига
const SYNC_PERIOD = 1000 * 60 * 3     // 3 минуты
// Конфигурация по умолчанию
const DEFAULT_CONFIG = {
    app_name: 'gymprogressive',
    app_name_ru: 'Жим Прогрессивный'
    // ...

}

// храним ID таймера синхронизации, чтобы иметь возможность его сбросить
let configSyncTimeoutId

let USER;

