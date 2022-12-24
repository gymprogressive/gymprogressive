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
 *  parameters: userId, messageId, Id
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Messages$Attachments.html#get
 * 
 * users.settings
 * users.settings.cse.identities
 * users.settings.cse.keypairs
 * users.settings.getAutoForwarding
 *  parameters: userId
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Settings.html#getAutoForwarding
 * users.settings.getImap
 *  parameters: userId
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Settings.html#getImap
 * users.settings.getLanguage
 *  parameters: userId
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Settings.html#getLanguage
 * users.settings.getPop
 *  parameters: userId
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Settings.html#getPop
 * users.settings.getVacation
 *  parameters: userId
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Settings.html#getVacation
 * users.settings.updateAutoForwarding
 *  parameters: userId
 *  requestBody:
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Settings.html#updateAutoForwarding
 * users.settings.updateImap
 *  parameters: userId
 *  requestBody:
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Settings.html#updateImap
 * users.settings.updateLanguage
 *  parameters: userId
 *  requestBody:
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Settings.html#updateLanguage
 * users.settings.updatePop
 *  parameters: userId
 *  requestBody:
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Settings.html#updatePop
 * users.settings.updateVacation
 *  parameters: userId
 *  requestBody:
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Settings.html#updateVacation
 * 
 * users.settings.delegates
 * users.settings.delegates.create
 *  parameters: userId
 *  requestBody:
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Settings$Delegates.html#create
 * users.settings.delegates.delete
 *  parameters: userId, cseEmailAddress
 *  requestBody:
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Settings$Delegates.html#delete
 * users.settings.delegates.get
 *  parameters: userId, cseEmailAddress
 *  requestBody:
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Settings$Delegates.html#get
 * users.settings.delegates.list
 *  parameters: userId
 *  query parameters: pageToken, pageSize
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Settings$Delegates.html#list
 * users.settings.delegates.patch
 *  parameters: userId, emailAddress
 *  requestBody:
 *  https://developers.google.com/gmail/api/reference/rest/v1/users.settings.cse.identities#CseIdentity
 * 
 * users.settings.filters
 * users.settings.filters.create
 *  parameters: userId
 *  requestBody:
 *  https://googleapis.dev/nodejs/googleapis/latest/gmail/classes/Resource$Users$Settings$Filters.html#create
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
