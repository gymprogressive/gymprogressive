// 1st version
function prom(gapiCall, argObj) {
    return new Promise((resolve, reject) => {
        gapiCall(argObj).then(resp => {
            if (resp && (resp.status < 200 || resp.status > 299)) {
                console.log('Вызов GAPI вернул плохой статус', resp);
                reject(resp);
            } else {
                resolve(resp);
            }
        }, err => {
            console.log('Вызов GAPI неудался', err);
            reject(err);
        })
    });
}

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
    console.log("-//-//-//-//-//-//-//-//-//-//-//-//-");
    console.log(configFileId);
    console.log("-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-");
    return configFileId;
}


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
        localStorage.removeItem(app_name + 'configFileId');
        // в localStorage лежит актуальный конфиг, дальше пользуемся им
    }
}


function isLoggedIn() {
    return gisInited && gapiInited;
}

function getConfig() {
    let ret;
    try {
        ret = JSON.parse(localStorage.getItem(app_name + '_config'));
    } catch(e) {}
    // если сохраненного конфига нет, возвращаем копию дефолтного
    return ret || {...DEFAULT_CONFIG};
}

async function saveConfig(newConfig) {
    // эту функцию зовем всегда, когда надо изменить конфиг
    localStorage.setItem(app_name + '_config', JSON.stringify(newConfig))
    if (isLoggedIn()) {
        // получаем config file ID
        const configFileId = await getConfigFileId();
        // заливаем новый конфиг в Google Drive
        upload(configFileId, newConfig);
    }
}

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
            localStorage.removeItem(app_name + 'configFileId');
            syncConfig();
        } else {
            throw e;
        }
    }
}

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

// Old version
/*
  function getConfigFileNameId() {
    configFileId = localStorage.getItem(app_name + '_configFileId');
    if (!configFileId) {
      findFile(configFileName).then(
        function(response){
          configFileId = response[0].id;
          localStorage.setItem(app_name + 'configFileId', configFileId);
          console.log(response[0].id);
      })
    }
    return configFileId;
  }
*/

// 2nd version

// 3rd version

