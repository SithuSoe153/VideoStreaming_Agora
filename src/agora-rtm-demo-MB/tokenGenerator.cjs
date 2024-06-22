const AgoraRTM = require('agora-access-token');

const appID = '81986d5ee23d47798625898064cfdf40';
const appCertificate = '9de9ada527f94229bc5d22df211a7fe8';
const uid = '001';
const role = AgoraRTM.RtmRole.Rtm_User;
const expirationTimeInSeconds = 3600;

const currentTimestamp = Math.floor(Date.now() / 1000);
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

const token = AgoraRTM.RtmTokenBuilder.buildToken(appID, appCertificate, uid, role, privilegeExpiredTs);
console.log("Token: " + token);
