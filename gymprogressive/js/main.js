// Переменная для хранения Клиента Токена
let tokenClient;

// Переменная с токеном доступа
let access_token;

// Переменная с временем действия токена
let expires_in;

// Получение токена из локального хранилища
if (window.localStorage.getItem('access_token'))
  access_token = localStorage.getItem('access_token');

// Получение времени истечения токена из локального хранилища  
if (window.localStorage.getItem('token_expires_in'))
  expires_in = new Date(localStorage.getItem('token_expires_in')).getTime(); // время действия токена в милисекундах

// Флаги инициализации библиотек
let gapiInited = false;
let gisInited = false;

// Элемениы управления
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Working_with_Objects
let $C = new Object();

/**
 * Элементы управления
 */

/*

    // alias for 
    const ByTagName = $d.getElementsByTagName;

*/

/**
 * Псевдоним для document.getElementById( s )
 * @param {*} s 
 * @returns 
 */
function id( s ) { return document.getElementById( s ); }

/**
 * Псевдоним для document.getElementById( s )
 * @param {*} s 
 * @returns 
 */
function byid( s ) { return document.getElementById( s ); }

/**
 * Псевдоним для document.getElementsByClassName(cls)
 * @param {*} cls 
 * @returns 
 */
function byclass(cls) { return document.getElementsByClassName(cls); }

/**
 * Псевдоним для document.getElementsByTagName(tag)
 * @param {*} tag 
 * @returns 
 */
function baytag(tag) { return document.getElementsByTagName(tag); }


// aliases for EventListener
EventTarget.prototype.on = EventTarget.prototype.addEventListener;
EventTarget.prototype.off = EventTarget.prototype.removeEventListener;

// aliases for HTMLElement methods
HTMLElement.prototype.find = HTMLElement.prototype.querySelector;
HTMLElement.prototype.findAll = HTMLElement.prototype.querySelectorAll;

//HTMLElement.prototype.addClass = HTMLElement.prototype.classList.add;
//HTMLElement.prototype.removeClass = HTMLElement.prototype.classList.remove;
//HTMLElement.prototype.replaceClass = HTMLElement.prototype.classList.replace;

//HTMLElement.prototype.setAttr = HTMLElement.prototype.setAttribute;
//HTMLElement.prototype.removeAttr = HTMLElement.prototype.removeAttribute;

$C['btnGetToken'] =byid('_getToken');
$C['btnRevokeToken'] = byid('_revokeToken');

$C['imgAvatar'] = byid('_imgAvatar');

$C['mnuStart'] = byid('itemStart');
$C['mnuSettings'] = byid('itemSettings');
$C['mnuProfile'] = byid('itemProfile');

$C['settings'] = byid('modSettings');

$C['profile'] = byid('modProfile');
$C['profileAvatar'] = byid('profile_avatar');
$C['profileName'] = byid('profile_name');
$C['profileEmail'] = byid('profile_email');

$C['contactsEmail'] = byid('contactsEmail');
$C['contactsTextarea'] = byid('contactsTextarea');
$C['contactsAlert'] = byid('contactsAlert');
$C['contactsSubmit'] = byid('contactsSubmit');

let modProfile = new bootstrap.Modal($C.profile, {});
let modSettings = new bootstrap.Modal($C.settings, {});

/**
 * Проверка входа в приложение
 * @returns 
 */
function isLoggedIn() {
  const not_expired = (new Date().getTime()) < expires_in;
  return gapiInited && gisInited && not_expired;
}

/**
 * Проверка истечения времения действия токена
 * @returns 
 */
function isExpired() {
  return (new Date().getTime()) > expires_in;
}

async function gapiStart() {
  // Вывод Лого
  Logo();

  await gapi.client.init({
    }).then(function() {
      // Инициализация библиотеки Google API с полученным ключом
      if (access_token) {
        //log (access_token,'Red','LemonChiffon');
        gapi.auth.setToken({access_token: access_token});
        gisInited = true;
      } 

      let now = new Date().getTime(); // текущее время в милисекундах
      
      TokenExpires(now,expires_in);

      if (now > expires_in) {
        gisInited = false;
      }
      
      gapi.client.load('gmail', 'v1');
      gapi.client.load('drive', 'v3');
      gapi.client.load('sheets', 'v4');
      gapi.client.load('calendar','v3');

      //console.info('Библиотека Client Google API инциализирована');
      log('Библиотека Client Google API инциализирована','info');
      
      gapiInited = true;

      checkApp();

  }).then(function(response) {
      log('Библиотеки загружены','info');
  }, function(reason) {
    console.error('Ошибка: ' + reason.result.error.message);
  }).then(function() {
    //  log("access_token: ");
    //  log(access_token);
  });
}

/**
 * Загрузка Библиотеки Google API
 */
function gapiLoad() {
  // обрабатываем загрузку библиотеки gapi
  gapi.load('client', gapiStart)
}

/**
 * Инициализация библиотеки Google Identity Services
 */
function gisInit() {
  // обрабатываем загрузку библиотеки gis
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: SCOPES,
    prompt: '',
    callback: (tokenResponse) => {
      let later = new Date(new Date().getTime() + (1 * Number(tokenResponse.expires_in) * 1000));

      localStorage.setItem('token_expires_in', later);
      expires_in = later;

      log('Токен истекает через ' + tokenResponse.expires_in + ' секунд','warning');
      
      localStorage.setItem('access_token', tokenResponse.access_token);
      access_token = tokenResponse.access_token;

      log('Библиотека GIS инициализирована','info');
      gisInited = true;

      checkApp();
    },
  });
}

/**
 * Инициализация элементов управления
 */
function checkApp() {
  $C.mnuStart.onclick=function(){
    log('тренировка');
  }

  $C.mnuSettings.onclick=function(){
    log('настройки');
    modSettings.show();
  }

  $C.mnuProfile.onclick=function(){
    log('профиль');
    modProfile.show();
  }

  $C.settings.on('shown.bs.modal', function () {
    log("Окно 'Настройки' открыто",'warning');
  })

  //var myInput = document.getElementById('myInput')
  $C.profile.on('shown.bs.modal', function () {
    log("Окно 'Профиль' открыто",'warning');
    //myInput.focus()
  })

  $C.contactsSubmit.onclick=function(){
    log('Нажата кнопка Отправить');
    
    sendEmail($C.contactsEmail.value,'Жим "Прогрессивный" От: '+USER.email,$C.contactsTextarea.value);
  }

  log(` Проверка элементов управления.\ 
Параметры
-------------------- 
gapi:         ${gapiInited}
gis:          ${gisInited}
not expired:  ${!isExpired()}`,'MidnightBlue');

  if (gapiInited && gisInited && !isExpired()){
    log ('Активация элементов управления','info');
    //log(access_token,'White','Tomato');
    
    USER = getUserProfileData(access_token, cbUserProfileSuccess, cbUserProfileError);

    $C.mnuStart.classList.remove('disabled');
    $C.mnuSettings.classList.remove('disabled');
    $C.mnuProfile.classList.remove('disabled');
    
    $C.btnGetToken.style.display='none';
    $C.btnRevokeToken.style.display='block';

    $C.contactsTextarea.removeAttribute('disabled');
    $C.contactsAlert.classList.add('d-none');    
    $C.contactsSubmit.removeAttribute('disabled');

    scheduleCheckToken();
    scheduleConfigSync();
    
  } else {
    log ('Дезактивация элементов управления','info');
    $C.mnuStart.classList.add('disabled');
    $C.mnuSettings.classList.add('disabled');
    $C.mnuProfile.classList.add('disabled');
    
    $C.btnGetToken.style.display='block';
    $C.btnRevokeToken.style.display='none';

    $C.contactsTextarea.setAttribute('disabled', '');
    $C.contactsAlert.classList.remove('d-none');
    $C.contactsSubmit.setAttribute('disabled', '');
    
    $C.imgAvatar.src='placeholder.png';
  }

  log('Проверка авторизации выполнена','info');
}

/**
 * Получить токен
 */
function getToken() {
  tokenClient.requestAccessToken();
}

function listMajors() {
  // получить данные из диапазона таблицы
  // используется идентификатор определенной таблицы
  /*
  let response = prom(gapi.client.sheets.spreadsheets.values.get,{
    spreadsheetId: '1q_6BY4I83K2Ppdxrp9mTFlHJg5GXvle7Xn4Kr6ORmeE',
    range: 'Class Data!A1:E1'});
  let range = response.result;
  log(range);
  */
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1q_6BY4I83K2Ppdxrp9mTFlHJg5GXvle7Xn4Kr6ORmeE',
    range: 'Class Data!A1:E1',
   }).then(function(response) {
    let range = response.result;
    log(range);
  });
}

function loadCalendar() {
  if (access_token) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.googleapis.com/calendar/v3/calendars/primary/events');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send();
    
    gapi.client.calendar.events.list({ 'calendarId': 'primary' })
    .then(calendarAPIResponse => log(JSON.stringify(calendarAPIResponse)))
    .catch(err => log(err));
    /*
    document.getElementById("showEventsBtn").innerText = "Refresh Calendar";
    */
  }
    
}

/**
 * Отозвать токен
 */
// очистить отзыв токена от внешний функций
// вынести их уровнем выше
function revokeToken() {
  let cred = gapi.client.getToken();

  if (cred !== null) {
    //Перед удалением конфига вызвать диалог для подтверждения
    //deleteConfigFile();
    google.accounts.oauth2.revoke(cred.access_token, () => {
      console.warn('Токен отозван: ' + cred.access_token);
      
      gapi.client.setToken('');
      access_token = null;
      localStorage.setItem('access_token','');
      
      gisInited = false;
      
      checkApp();
    });
  }

}

/**
 * Обратный вызов при успешном запросе профиля пользователя
 * @param {*} result 
 */
function cbUserProfileSuccess ( result ) {
  // надо перенести функцию в объект $C
  // чтобы при удачном запросе обработка проходила внутри объекта
  log(result);

  $C.profileAvatar.src = $C.imgAvatar.src = result.picture;
  $C.profileName.innerText = result.name;
  $C.profileEmail.innerText = result.email;
  USER.email = result.email;
  USER.picture = result.picture;
  USER.name = result.name;
}

/**
 * Обратный вызов при ошибке запроса профиля пользователя
 * @param {*} result 
 */
function cbUserProfileError ( result ) {
  // надо перенести функцию в объект $C
  // чтобы при удачном запросе обработка проходила внутри объекта
  log('' + result,'error');
  $C.imgAvatar.src='placeholder.png';
  gisInited = false;

  checkApp();
}

/**
 * Запрос данных профиля
 * @param {*} accessToken
 * @param {*} cbSuccess 
 * @param {*} cbError 
 */
async function getUserProfileData (accessToken, cbSuccess, cbError) {
  const request = 'https://www.googleapis.com/oauth2/v3/userinfo';
  const headers = new Headers();
      
  headers.append('Authorization', `Bearer ${accessToken}`);
  const response = await fetch(request, {headers})
  .then(async (response)=>{
    log('Статус запроса данных пользователя: ' + response.status);
    if (response.status >= 400 && response.status < 600) {
      // читать здесь
      // https://stackoverflow.com/questions/783818/how-do-i-create-a-custom-error-in-javascript
      throw new Error('Неудачная попытка получить данные с сервера');
    }
    return response.json();
  })
  .then((data)=>{
    cbSuccess(data);
    return(data);
  })
  .catch((err) => {
    cbError(err);
  });
}

/**
* Вывод метаданных для первых 10 файлов.
*/
async function listFiles() {
  let response;
  try {
    response = await gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': 'files(id, name)',
    });
  } catch (err) {
    log(err.message);
    return;
  }
  const files = response.result.files;
  if (!files || files.length == 0) {
    log('Файлы не найдены.');
    return;
  }
  // Подготовка строки вывода
  const output = files.reduce(
      (str, file) => `${str}${file.name} (${file.id}\n`,
      'Файлы:\n');
  log(output);
}


/**
 * sandbox
 */

const sandbox = byid('sandbox');

const datepicker = addDatePicker(sandbox);

/**
 * addDatePicker
 * @param {*} sandbox 
 * @returns 
 */
function addDatePicker(sandbox) {
  // https://mymth.github.io/vanillajs-datepicker/#/
  const div = document.createElement('div');
  div.setAttribute('class','mb-3');
  sandbox.appendChild(div);

  const elt = document.createElement('input');

  elt.setAttribute('name','datepicker');
  elt.setAttribute('type','text');
  elt.setAttribute('class','form-control date text-center');

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  today = dd + '/' + mm + '/' + yyyy;
  elt.value = today;
  div.appendChild(elt);

  const datepicker = new Datepicker(elt, {
    // ...options
    buttonClass: 'btn',
    autohide: true,
    calendarWeeks: true,
    clearBtn: true,
    daysOfWeekHighlighted: [0,6],
    language: 'ru',
    showDaysOfWeek: true,
    todayBtn: true,
    todayBtnMode: 0,
    todayHighlight: true
  });
  
  return datepicker;
}

/**
 * changeDate, changeMonth, changeView, changeYear, hide, show
 */

// const elt = document.querySelector('input[name="foo"]');
datepicker.inputField.on('changeDate', (e) => {
  log(e);
});

const row1 = addRowProgression(sandbox, programs.list[0].progressions[0]);

function addRowProgression(parent, row) {
  log(row,'info');
  const excersises = row.excersises;

  const eltRow = document.createElement('div');
  eltRow.classList.add('row');
  parent.appendChild(eltRow);
  
  const eltNameCol = document.createElement('div');
  eltNameCol.classList.add('input-group', 'mt-3', 'mb-3', 'justify-content-center');
  eltRow.appendChild(eltNameCol);

  const eltNameText = document.createElement('div');
  eltNameText.classList.add('input-group-text', 'd-flex');
  eltNameText.innerText = row.name;
  eltNameCol.appendChild(eltNameText);

  const eltExcersiseCol = document.createElement('div');
  eltExcersiseCol.classList.add('input-group', 'mt-3', 'mb-3', 'justify-content-center');
  eltRow.appendChild(eltExcersiseCol);

  const eltExcersiseBtn = document.createElement('div');
  eltExcersiseBtn.classList.add('btn', 'btn-secondary', 'dropdown-toggle');
  eltExcersiseBtn.setAttribute('type','button');
  eltExcersiseBtn.setAttribute('data-bs-toggle','dropdown');
  eltExcersiseBtn.innerText = row.excersises[0].name;
  eltExcersiseCol.appendChild(eltExcersiseBtn);

  const eltExcersiseUl = document.createElement('ul');
  eltExcersiseUl.classList.add('dropdown-menu','text-center');
  eltExcersiseCol.appendChild(eltExcersiseUl);

  excersises.forEach(element => {
    const eltExcersiseLi = document.createElement('li');
    eltExcersiseUl.appendChild(eltExcersiseLi);

    const eltExcersiseA = document.createElement('a');
    eltExcersiseA.classList.add('dropdown-item');
    eltExcersiseA.setAttribute('href','#');
    eltExcersiseA.innerText = element.name;
    eltExcersiseLi.appendChild(eltExcersiseA);

  });

}

/*
        <div class='row'>
          <div class='input-group mt-3 mb-3 justify-content-center'>
            <div class='input-group-text d-flex'>Отжимания</div>
          </div>

          <div class='input-group mt-3 mb-3 justify-content-center'>  
            <button type='button' class='btn btn-secondary dropdown-toggle' data-bs-toggle='dropdown'>
              Отжимания от стены
            </button>
            <ul class='dropdown-menu text-center'>
              <li><a class='dropdown-item' href='#'>Отжимания от стены</a></li>
              <li><a class='dropdown-item' href='#'>Отжимания в наклоне</a></li>
              <li><a class='dropdown-item' href='#'>Отжимания на коленях</a></li>
              <li><a class='dropdown-item' href='#'>Неполные отжимания</a></li>
              <li><a class='dropdown-item' href='#'>Полные отжимания</a></li>
              <li><a class='dropdown-item' href='#'>Узкие отжимания</a></li>
              <li><a class='dropdown-item' href='#'>Разновысокие отжимания</a></li>
              <li><a class='dropdown-item' href='#'>Неполные отжимания на одной руке</a></li>
              <li><a class='dropdown-item' href='#'>Отжимания на одной руке с поддержкой</a></li>
              <li><a class='dropdown-item' href='#'>Отжимания на одной руке</a></li>
            </ul>
          </div>
        </div>

        <div class='mt-3 mb-3 row justify-content-center'>
          <div class='mt-3 mb-3 col-sm-2'>
            <input type='text' class='form-control text-center' placeholder='1'>
          </div>
          <div class='mt-3 mb-3 col-sm-2'>
            <input type='text' class='form-control text-center' placeholder='2'>
          </div>
          <div class='mt-3 mb-3 col-sm-2'>
            <input type='text' class='form-control text-center' placeholder='3'>
          </div>
        </div>
      */


/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * https://developers.google.com/gmail/api/reference/rest
 ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
  * Print all Labels in the authorized user's inbox. If no labels
  * are found an appropriate message is printed.
*/
 async function listLabels() {
  let response;
  try {
    response = await gapi.client.gmail.users.labels.list({
      'userId': 'me',
    });
  } catch (err) {
    log(err.message,'error');
    return;
  }
  const labels = response.result.labels;
  if (!labels || labels.length == 0) {
    log('No labels found.','warning');
    return;
  }
  // Flatten to string to display
  const output = labels.reduce(
      (str, label) => `${str}${label.name}\n`,
      'Labels:\n');
  log(output,'info');
}

/**
 * gmail.users.getProfile
 * @returns 
 */
async function getProfile() {
  let sendRequest = await prom(gapi.client.gmail.users.getProfile,{
    'userId': 'me'
  }).then((response) => {
    const result = response.result;

    if (response.status == 200) {
      log(result);
      return result;
    } else {
      throw new Error(response);
    }

  });
  return sendRequest;
}

/**
 * Отправить письмо
 * @param {*} headers_obj 
 * @param {*} message 
 * @param {*} cb 
 * @returns 
 */
function sendMessage(headers_obj, message, cb) {
  let email = '';

  for(let header in headers_obj)
    email += header += ": "+headers_obj[header]+"\r\n";

  email += "\r\n" + message;
  
  let raw = window.btoa(unescape(encodeURIComponent(email)));

  let sendRequest = prom(gapi.client.gmail.users.messages.send,{
    'userId': 'me',
    'resource': {
      'raw': raw
    }
  }).then(function (response) {

    cb(response);

    return response;
  });

  return sendRequest;
}

function sendEmail(to, subject, message)
{
  log(to);
  log(subject);
  log(message);
  sendMessage(
    {
      'To': to,
      'Subject': '=?UTF-8?B?' + window.btoa(unescape(encodeURIComponent(subject))) + '?=',
      'Content-Type': 'text/html; charset=UTF-8',
      'Content-Transfer-Encoding': 'base64'
    },
    message,
    sendMessageCallback
  );
}

function testMail(){
  //sendEmail('m89265729463@gmail.com','Test','Test');
  sendEmail('gym.progressive@gmail.com','От: ' + USER.email,'Яхууу');
}

function sendMessageCallback(response) {
  
  const msg_id = response.result.id;
  const msg_date = response.headers.date; 
  const msg_status = response.status;
  const msg_statusText = response.statusText; 
  
  log(msg_status, 'warning');

  log(response);

/*
  {
    "result": {
      "id": "184705210440bc96",
      "threadId": "184705210440bc96",
      "labelIds": [
        "SENT"
      ]
    },
    "body": "{\n  \"id\": \"184705210440bc96\",\n  \"threadId\": \"184705210440bc96\",\n  \"labelIds\": [\n    \"SENT\"\n  ]\n}\n",
    "headers": {
      "cache-control": "private",
      "content-encoding": "gzip",
      "content-length": "85",
      "content-type": "application/json; charset=UTF-8",
      "date": "Sun, 13 Nov 2022 09:28:57 GMT",
      "server": "ESF",
      "vary": "Origin, X-Origin, Referer"
    },
    "status": 200,
    "statusText": "OK"
  }
*/
}

/**
 * Синхронизация конфига
 * @returns 
 */
async function syncConfig() {
  if (!isLoggedIn) {
      return;
  }
  // получаем config file ID
  const configFileId = await getConfigFileId();
  try {
    // загружаем конфиг
    const remoteConfig = await downloadFile(configFileId);
    if (!remoteConfig || typeof remoteConfig !== 'object') {
      // пустой или испорченный конфиг, перезаписываем текущим
      uploadFile(configFileId, getConfig()); // ??? функция из первой версии
    } else {
      // сохраняем локально, перезаписывая существующие данные
      localStorage.setItem(app_name + '_config', JSON.stringify(remoteConfig))
    }
    // синхронизация завершена, в localStorage актуальный конфиг
    log('Синхронизация завершена, в localStorage актуальный конфиг');
  } catch(e) {
    if (e.status === 404) {
      // кто-то удалил наш конфиг, забываем неверный fileID и пробуем еще раз
      localStorage.removeItem(app_name + '_configFileId');
      syncConfig();
    } else {
      throw e;
    }
  }
}

/**
 * Шедуллер синхронизации конфига
 * @param {*} delay 
 */
function scheduleConfigSync(delay) {
  log('Запущен таймер синхронизации конфига','info');
  // сбрасываем старый таймер, если он был
  if (configSyncTimeoutId) {
    clearTimeout(configSyncTimeoutId);
  }
  configSyncTimeoutId = setTimeout(() => {
    // выполняем синхронизацию и шедулим снова
    syncConfig()
      .catch(e => {
        log('Ошибка синхронизации файла конфигурации', e);
        location.reload();
      })
      .finally(() => scheduleConfigSync());
  }, typeof delay === 'undefined' ? SYNC_PERIOD : delay);
}

function tokenExpired () {
  gisInited = false;
  checkApp();
};

async function checkToken() {
  if (!isLoggedIn) {
    return;
  }

  let now = new Date().getTime(); // текущее время в милисекундах

  if (TokenExpires(now,expires_in) < 0) {
    throw Error('Токен не активен');
  }

  // проверка токена завершена
  log('Проверка токена завершена');
}

function scheduleCheckToken(delay) {
  log('Запущен таймер проверки токена','info');
  // сбрасываем старый таймер, если он был
  if (tokenCheckTimeoutId) {
    clearTimeout(tokenCheckTimeoutId);
  }
  tokenCheckTimeoutId = setTimeout(() => {
    // выполняем проверку и шедулим снова
    checkToken()
      .catch(e => {
        log('Ошибка: ' + e,'error');
        tokenExpired();
      })
      .finally(() => scheduleCheckToken());
  }, typeof delay === 'undefined' ? CHECK_PERIOD : delay);
}

// Удалить после завершения тестирования
function testCheckToken() {
  scheduleCheckToken(1000 * 60 * 1/3);
}

/**
 * %=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%
 * %=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%
 * %=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%
 * %=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%
 * %=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%
 * %=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%=%
 */

/**
 * Промисификация
 * @param {*} gapiCall 
 * @param {*} argObj 
 * @returns 
 */
function prom(gapiCall, argObj) {
  return new Promise((resolve, reject) => {
    gapiCall(argObj).then(response => {
      if (response && (response.status < 200 || response.status > 299)) {
        console.log('Вызов GAPI вернул плохой статус', response);
        reject(response);
      } else {
        resolve(response);
      }
    }, err => {
      console.log('Вызов GAPI неудался', err);
      reject(err);
    })
  });
}

/**
 * Получение идентификатора файла данных
 * @param {*} fileName 
 * @returns 
 */ 
// Подумать над промисификацией
 async function getAppDataFileId(fileName) {
  
    // тест для промисификации
    const data = await prom(gapi.client.drive.files.list,{
      q: 'name="' + fileName + '"',
      spaces: 'appDataFolder',
      fields: 'files(id)',
      pageSize: 100,
      orderBy: 'createdTime'  
    });
    
    if (_.isEmpty(data.result.files)) {
      throw 'Файлы не найдены';
    }

    return data.result.files[0].id;
  
  /*return await gapi.client.drive.files.list({
    q: 'name="' + fileName + '"',
    spaces: 'appDataFolder',
    fields: 'files(id)',
    pageSize: 100,
    orderBy: 'createdTime'
  }).then(
    function (data) {
      if (_.isEmpty(data.result.files)) {
        throw 'Файлы не найдены';
      }
      return data.result.files[0].id;
    }
  );*/
};

/**
 * Создание пустого файла в appDataFolder
 * @param {*} name 
 * @param {*} mimeType 
 * @returns 
 */
async function createEmptyFile(name, mimeType) {
  const resp = await prom(gapi.client.drive.files.create, {
    resource: {
      name: name,
      // для создания папки используйте
      // mimeType = 'application/vnd.google-apps.folder'
      mimeType: mimeType || 'text/plain',
      // вместо 'appDataFolder' можно использовать ID папки
      parents: ['appDataFolder']
    },
    fields: 'id'
  });
  console("Создан файл " + name);
  // функция возвращает строку — идентификатор нового файла
  return resp.result.id;
}

/**
 * Поиск файлов в appDataFolder
 * @param {*} query 
 * @returns 
 */
async function find(query) {
  let ret = [];
  let token;
  do {
    const resp = await prom(gapi.client.drive.files.list, {
      // вместо 'appDataFolder' можно использовать ID папки
      spaces: 'appDataFolder',
      fields: 'files(id, name), nextPageToken',
      pageSize: 100,
      pageToken: token,
      orderBy: 'createdTime',
      q: query
    })
    ret = ret.concat(resp.result.files);
    token = resp.result.nextPageToken;
  } while (token)
  // результат: массив объектов вида [{id: '...', name: '...'}], 
  // отсортированных по времени создания
  return ret;
}

/**
 * Удаление файла с идентификатором
 * @param {*} fileId 
 * @returns 
 */
async function deleteFile(fileId) {
  try {
    await prom(gapi.client.drive.files.delete, {
        fileId: fileId
    })
    return true;
  } catch (err) {
    if (err.status === 404) {
        return false;
    }
    throw err;
  }
}

/**
 * Поиск файлов в appDataFolder
 * @param {*} query 
 * @returns 
 */ 
async function findFile(query) {
return await prom(gapi.client.drive.files.list, {
  // вместо 'appDataFolder' можно использовать ID папки
  spaces: 'appDataFolder',
  fields: 'files(id,name)',
  pageSize: 100,
  orderBy: 'createdTime',
  q: 'name="' + query + '"'
}).then( function (data) {
  if (_.isEmpty(data.result.files)) {
    throw 'Файлы не найдены';
  }
  // результат: массив объектов вида [{id: '...', name: '...'}], 
  // отсортированных по времени создания
  return data.result.files;
  });
};

/**
 * Сохранение файла данных на Google диске
 * @param {*} fileId 
 * @param {*} content 
 * @returns 
 */
async function uploadFile(fileId, content) {
log('Сохранено содержимое файла с идентификатором ' + fileId);
// функция принимает либо строку, либо объект, который можно сериализовать в JSON
return prom(gapi.client.request, {
  path: `/upload/drive/v3/files/${fileId}`,
  method: 'PATCH',
  params: {uploadType: 'media'},
  body: typeof content === 'string' ? content : JSON.stringify(content)
})
}

/**
 * Скачивание файла данных для Google диска
 * @param {*} fileId 
 * @returns 
 */
async function downloadFile(fileId) {
  const resp = await prom(gapi.client.drive.files.get, {
    fileId: fileId,
    alt: 'media'
  });
  // resp.body хранит ответ в виде строки
  // resp.result — это попытка интерпретировать resp.body как JSON.
  // Если она провалилась, значение resp.result будет false
  // Т.о. функция возвращает либо объект, либо строку
  log('Загружен файл с идентификатором ' + fileId);

  return resp.result || resp.body;
}

/**
 * Создание пустого файла конфигурации
 */
function createConfigFile() {
  createEmptyFile(configFileName);
}

/**
 * Загрузка файла конфигурации на Google диск
 */
function saveConfigFile() {
  getConfigFileId().then(
    function(response) {
      configFileId = response;
      log('Сохранение конфигурации в файл с идентификатором ' + configFileId);
      
      uploadFile(configFileId, DEFAULT_CONFIG);
    }
  );
}

/**
 * Скачивание файла конфигурации с Google диска
 */
function loadConfigFile() {
  log('Попытка загрузки файла конфигурации');
  getConfigFileId().then( function(response) {
    configFileId = response;

    log('Загрузка файла конфигурации с идентификатором ' + configFileId);
    
    downloadFile(configFileId).then( function(appData){
      log(appData);
    });   
  });
}

/**
 * Удаление файла конфигурации из локального хранилища и Google диска
 */
async function deleteConfigFile() {
  configFileId = await getConfigFileId();
  deleteFile(configFileId).then( function(info){
    localStorage.removeItem(app_name + '_configFileId');
    if (info) log('Файл конфигурации удалён','warning');
  });
}

/**
 * Получение идентификатора файла конфигурации
 * @returns 
 */
async function getConfigFileId() {
  // берем configFileId
  let configFileId = localStorage.getItem(app_name + '_configFileId');
  if (!configFileId) {
    try {
      // ищем нужный файл на Google Drive
      const configFiles = await find('name = "' + configFileName + '"');
      if (configFiles.length > 0) {
        // берем первый (раньше всех созданный) файл
        configFileId = configFiles[0].id;
      } else {
        // создаем новый
        configFileId = await createEmptyFile(configFileName);
      }
      // сохраняем ID
      localStorage.setItem(app_name + '_configFileId', configFileId);
    } catch(e){
      // в случае ошибки перегружаем страницу
      log(e.status,'error');
      location.reload(); // обработку ошибки надо вынести в обратный вызов
    }
  }
  return configFileId;
}

/**
 * Получение файла конфигурации из локального хранилища либо
 * из перменной с настройками по умолчанию
 * @returns 
 */
function getConfig() {
  let ret;
  try {
    ret = JSON.parse(localStorage.getItem(app_name + '_config'));
  } catch(e) {}
    // если сохраненного конфига нет, возвращаем копию дефолтного
  return ret || {...CONFIG};
}

/**
 * Сохранение файла конфигурации в локальном хранилище
 * @param {*} newConfig 
 */
async function saveConfig(newConfig) {
  // эту функцию зовем всегда, когда надо изменить конфиг
  localStorage.setItem(app_name + '_config', JSON.stringify(newConfig))
  if (isLoggedIn()) {
    // получаем config file ID
    const configFileId = await getConfigFileId();
    // заливаем новый конфиг в Google Drive
    uploadFile(configFileId, newConfig);
  }
}

/*
// 1st version
async function upload(fileId, content) {
    console.log("Загружено содержимое файла с идентификатором " + fileId);
    // функция принимает либо строку, либо объект, который можно сериализовать в JSON
    return prom(gapi.client.request, {
        path: `/upload/drive/v3/files/${fileId}`,
        method: 'PATCH',
        params: {uploadType: 'media'},
        body: typeof content === 'string' ? content : JSON.stringify(content)
    })
}
*/

/*
// 1st version
async function download(fileId) {
    const resp = await prom(gapi.client.drive.files.get, {
        fileId: fileId,
        alt: 'media'
    });
    // resp.body хранит ответ в виде строки
    // resp.result — это попытка интерпретировать resp.body как JSON.
    // Если она провалилась, значение resp.result будет false
    // Т.о. функция возвращает либо объект, либо строку
    return resp.result || resp.body;
}
*/


/*
// 1st version
async function getConfigFileId() {
    // берем configFileId
    let configFileId = localStorage.getItem(app_name + '_configFileId');
    if (!configFileId) {
        // ищем нужный файл на Google Drive
        const configFiles = await find('name = "' + configFileName + '"');
        if (configFiles.length > 0) {
            // берем первый (раньше всех созданный) файл
            configFileId = configFiles[0].id;
        } else {
            // создаем новый
            configFileId = await createEmptyFile(configFileName);
        }
        // сохраняем ID
        localStorage.setItem(app_name + '_configFileId', configFileId);
    }

    return configFileId;
}
*/

/*
// 1st version
async function getConfig_onSignIn() {
    // обработчик события логина/логаута (см. выше)
    if (isLoggedIn()) {
        // пользователь зашел
        // шедулим (как это по-русски?) немедленную синхронизацию конфига
        scheduleConfigSync(0);
    } else {
        // пользователь вышел
        // в следующий раз пользователь может зайти под другим аккаунтом
        // поэтому забываем config file ID
        localStorage.removeItem(app_name + '_configFileId');
        // в localStorage лежит актуальный конфиг, дальше пользуемся им
    }
}
*/

/*
// 1st version
function isLoggedIn() {
    return gisInited && gapiInited;
}
*/

/*
// 1st version
async function syncConfig() {
    if (!isLoggedIn()) {
        return;
    }
    // получаем config file ID
    const configFileId = await getConfigFileId();
    try {
        // загружаем конфиг
        const remoteConfig = await download(configFileId);
        if (!remoteConfig || typeof remoteConfig !== 'object') {
            // пустой или испорченный конфиг, перезаписываем текущим
            upload(configFileId, getConfig());
        } else {
            // сохраняем локально, перезаписывая существующие данные
            localStorage.setItem(app_name + '_config', JSON.stringify(remoteConfig))
        }
        // синхронизация завершена, в localStorage актуальный конфиг
    } catch(e) {
        if (e.status === 404) {
            // кто-то удалил наш конфиг, забываем неверный fileID и пробуем еще раз
            localStorage.removeItem(app_name + '_configFileId');
            syncConfig();
        } else {
            throw e;
        }
    }
}
*/

/* // 1st version
function scheduleConfigSync(delay) {
    // сбрасываем старый таймер, если он был
    if (configSyncTimeoutId) {
        clearTimeout(configSyncTimeoutId);
    }
    configSyncTimeoutId = setTimeout(() => {
        // выполняем синхронизацию и шедулим снова
        syncConfig()
            .catch(e => console.log('Ошибка синхронизации файла конфигурации', e))
            .finally(() => scheduleConfigSync());
    }, typeof delay === 'undefined' ? SYNC_PERIOD : delay);
}
*/

/*
    // пример использования find
    if ((await find(‘name = "config.json"’)).length > 0) {
        // файл(ы) существует
    }

*/

/*
function initApp() {
    // запускаем синхронизацию при старте приложения
    scheduleConfigSync()
}
*/

// 2nd version

// 3rd version

      

  
  //миграция в gis
  //https://developers.google.com/identity/oauth2/web/guides/migration-to-gis?hl=en#gapi-callback
  //https://developers.google.com/identity/gsi/web/reference/js-reference?hl=en&authuser=19

  //https://advancedweb.hu/using-google-auth-in-javascript/
  //https://github.com/sashee/drive-api-from-js
  //https://sashee.github.io/drive-api-from-js/

  //https://www.bootdey.com/snippets/view/Profile-settings