// const agora = require('agora-access-token');

// const appID = '81986d5ee23d47798625898064cfdf40';
// const appCertificate = '9de9ada527f94229bc5d22df211a7fe8';
// const uid = 'USER_ID'; // This can be any unique ID for your user
// const expirationTimeInSeconds = 3600; // Token expiration time in seconds

// const token = agora.RtmTokenBuilder.buildToken(appID, appCertificate, uid, agora.RtmRole.Rtm_User, expirationTimeInSeconds);

// console.log('RTM Token:', token);



// =============================================



const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const appID = '19547e2b1603452688a040cc0a219aea';
const appCertificate = '6864c80f096846819d541175679b6606';

const channelName = 'main';

const uid = '003'; // Set uid to 0 for dynamic uid
const role = RtcRole.PUBLISHER;
// const expirationTimeInSeconds = 3600;
const expirationTimeInSeconds = 86400000;
// const expirationTimeInSeconds = 604800000;


const currentTimestamp = Math.floor(Date.now() / 1000);
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
console.log('Generated Token: ', token);



// const { RtmTokenBuilder, RtmRole } = require('agora-access-token');
// const appID = '81986d5ee23d47798625898064cfdf40';
// const appCertificate = '9de9ada527f94229bc5d22df211a7fe8';

// const userId = '1'; // Replace with your actual user ID

// const role = RtmRole.Rtm_User;
// // const expirationTimeInSeconds = 3600;
// const expirationTimeInSeconds = 86400000;

// const currentTimestamp = Math.floor(Date.now() / 1000);
// const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

// const token = RtmTokenBuilder.buildToken(appID, appCertificate, userId, role, privilegeExpiredTs);
// console.log('Generated RTM Token: ', token);



// =============================================


// const appId = '30c3c3fa4b384a358e60e07cad3f6374';
// const appCertificate = '9eab098ea65a46d1b67fc81096d299c8';
// const base64Credentials = Buffer.from(`${appId}:${appCertificate}`).toString('base64');
// console.log(base64Credentials);  // Use this value in Postman
