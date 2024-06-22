const agora = require('agora-access-token');

const appID = '81986d5ee23d47798625898064cfdf40';
const appCertificate = '9de9ada527f94229bc5d22df211a7fe8';
const uid = 'USER_ID'; // This can be any unique ID for your user
const expirationTimeInSeconds = 3600; // Token expiration time in seconds

const token = agora.RtmTokenBuilder.buildToken(appID, appCertificate, uid, agora.RtmRole.Rtm_User, expirationTimeInSeconds);

console.log('RTM Token:', token);
