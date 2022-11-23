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
 * https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Messages.html
 ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/**
 * users.drafts
 * users.drafts.create
 *  parameters: userId
 * users.drafts.delete
 *  parameters: userId, id
 * users.drafts.get
 *  parameters: userId, id
 *  query parameters: format
 * users.drafts.list
 *  parameters: userId
 *  query parameters: maxResults, pageToken, q, includeSpamTrash
 * users.drafts.send
 *  parameters: userId
 * users.drafts.update
 *  parameters: userId, id
 * 
 * users.history
 * users.history.list
 *  parameters: userId
 *  query parameters: maxResults, pageToken, startHistoryId, labelId, historyTypes[]
 * 
 * users.labels
 * users.labels.create
 *  parameters: userId
 * users.labels.delete
 *  parameters: userId, id
 * users.labels.get
 *  parameters: userId, id
 * users.labels.list
 *  parameters: userId
 * users.labels.patch
 *  parameters: userId, id
 * users.labels.update
 *  parameters: userId, id
 *  
 * users.messages
 * users.messages.batchDelete
 *  parameters: userId
 *  requestBody:
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Messages.html#batchDelete 
 * users.messages.batchModify
 *  parameters: userId
 *  requestBody:
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Messages.html#batchModify
 *  https://stackoverflow.com/questions/51870530/ignore-same-thread-emails-that-have-different-labels
 * users.messages.delete
 *  parameters: userId, id
 * users.messages.get
 *  parameters: userId, id, format, metadataHeaders
 * users.messages.import
 *  parameters: userId, internalDateSource, neverMarkSpam, processForCalendar, deleted
 *  requestBody:
 *  media:
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Messages.html#import
 * users.messages.insert
 *  parameters: userId, internalDateSource, deleted
 *  requestBody:
 *  media:
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Messages.html#insert
 * users.messages.list
 *  parameters: userId, maxResults, pageToken, q, labelIds[], includeSpamTrash
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Messages.html#list
 * users.messages.modify
 *  parameters: userId, id
 *  requestBody:
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Messages.html#modify
 * users.messages.send
 *  parameters: userId, id
 *  requestBody:
 *  media:
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Messages.html#send
 * users.messages.trash
 *  parameters: userId, id
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Messages.html#trash
 * users.messages.untrash
 *  parameters: userId, id
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Messages.html#untrash
 * 
 * users.messages.attachments
 * users.messages.attachments.get
 * 
 * users.settings
 * users.settings.getAutoForwarding
 * users.settings.getImap
 * users.settings.getLanguage
 * users.settings.getPop
 * users.settings.getVacation
 * users.settings.updateAutoForwarding
 * users.settings.updateImap
 * users.settings.updateLanguage
 * users.settings.updatePop
 * users.settings.updateVacation
 * 
 * users.settings.delegates
 * users.settings.delegates.create
 * users.settings.delegates.delete
 * users.settings.delegates.get
 * users.settings.delegates.list
 * 
 * users.settings.filters
 * users.settings.filters.create
 * users.settings.filters.delete
 * users.settings.filters.get
 * users.settings.filters.list
 * 
 * users.settings.forwardingAddresses
 * users.settings.forwardingAddresses.create
 * users.settings.forwardingAddresses.delete
 * users.settings.forwardingAddresses.get
 * users.settings.forwardingAddresses.list
 * 
 * users.settings.sendAs
 * users.settings.sendAs.create
 * users.settings.sendAs.delete
 * users.settings.sendAs.get
 * users.settings.sendAs.list
 * users.settings.sendAs.patch
 * users.settings.sendAs.update
 * users.settings.sendAs.verify
 * 
 * users.settings.sendAs.smimeInfo
 * users.settings.sendAs.smimeInfo.delete
 * users.settings.sendAs.smimeInfo.get
 * users.settings.sendAs.smimeInfo.insert
 * users.settings.sendAs.smimeInfo.list
 * users.settings.sendAs.smimeInfo.setDefault
 * 
 * users.threads
 * users.threads.delete
 * users.threads.get
 * users.threads.list
 * users.threads.modify
 * users.threads.trash
 * users.threads.untrash
 *  */ 


/*
//https://stackoverflow.com/questions/27695749/gmail-api-not-respecting-utf-encoding-in-subject
  let decode = decodeURIComponent(escape(window.atob(raw)));
  log(decode);
*/

// https://stackoverflow.com/questions/62078087/how-to-use-gapi-for-sending-email-in-angular-9
