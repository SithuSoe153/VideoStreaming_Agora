// basicLive.js

var client = AgoraRTM.createInstance('81986d5ee23d47798625898064cfdf40'); // Replace with your Agora App ID
var channel = null;
var options = {
    appid: '81986d5ee23d47798625898064cfdf40',
    token: '00669b5921596cd4632a94ead5fe6706777IABEg5rTkq4KKNC978aDCu8MglojWm34R+BUlBvxHWc7NqTtS3a379yDIgDw4ERs0wttZgQAAQBTFpJrAgBTFpJrAwBTFpJrBABTFpJr', // Replace with your RTM token
    uid: '1', // Replace with your user ID
    // channelName: null
};

$(document).ready(function () {
    $("#host-join").click(function (e) {
        joinChannel();
    });

    $("#leave").click(function (e) {
        leaveChannel();
    });

    $("#send-message").click(function (e) {
        sendMessage($("#message").val());
    });
});

async function joinChannel() {
    console.log("Joining channel:", options.channelName);

    try {
        await client.login({ uid: options.uid, token: options.token });
        console.log("Logged in as:", options.uid);

        channel = client.createChannel(options.channelName);
        await channel.join();
        console.log("Joined channel:", options.channelName);

        channel.on('ChannelMessage', ({ text }, memberId) => {
            console.log("Message received:", text, "from:", memberId);
            $('#messages').append(`<div><strong>${memberId}:</strong> ${text}</div>`);
        });

        $("#host-join").attr("disabled", true);
        $("#leave").attr("disabled", false);
        $("#send-message").attr("disabled", false);
    } catch (error) {
        console.error("Error joining channel:", error);
    }
}

async function leaveChannel() {
    try {
        await channel.leave();
        await client.logout();
        console.log("Left the channel and logged out.");

        $("#host-join").attr("disabled", false);
        $("#leave").attr("disabled", true);
        $("#send-message").attr("disabled", true);
    } catch (error) {
        console.error("Error leaving channel:", error);
    }
}

async function sendMessage(text) {
    if (channel) {
        try {
            await channel.sendMessage({ text: text });
            console.log("Message sent:", text);
            $('#messages').append(`<div><strong>${options.uid}:</strong> ${text}</div>`);
            $("#message").val('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
}


// // basicLive.js

// // Create Agora client
// var client = AgoraRTC.createClient({
//     mode: "live",
//     codec: "vp8"
// });
// var localTracks = {
//     videoTrack: null,
//     audioTrack: null
// };
// var remoteUsers = {};

// // Agora client options
// var options = {
//     // appid: "81986d5ee23d47798625898064cfdf40",
//     appid: "69b5921596cd4632a94ead5fe6706777",
//     channel: "soe",
//     uid: 1,
//     token:
//         "00669b5921596cd4632a94ead5fe6706777IABEg5rTkq4KKNC978aDCu8MglojWm34R+BUlBvxHWc7NqTtS3a379yDIgDw4ERs0wttZgQAAQBTFpJrAgBTFpJrAwBTFpJrBABTFpJr",
//     role: "audience", // host or audience
//     audienceLatency: 2
// };

// $(document).ready(function () {
//     $("#host-join").click(function (e) {
//         options.role = "host";
//         join();
//     });

//     $("#audience-join").click(function (e) {
//         options.role = "audience";
//         options.audienceLatency = 2;
//         join();
//     });

//     $("#leave").click(function (e) {
//         leave();
//     });
// });

// async function join() {
//     console.log("Joining with role:", options.role);

//     // Show loading indicator
//     $("#local-player").addClass("loading");

//     if (options.role === "audience") {
//         client.setClientRole(options.role, {
//             level: options.audienceLatency
//         });
//         client.on("user-published", handleUserPublished);
//         client.on("user-unpublished", handleUserUnpublished);
//     } else {
//         // Remove existing listeners if any
//         client.getListeners("user-published").includes(handleUserPublished) && client.off("user-published", handleUserPublished);
//         client.getListeners("user-unpublished").includes(handleUserUnpublished) && client.off("user-unpublished", handleUserUnpublished);
//         client.setClientRole(options.role);
//     }

//     try {
//         options.uid = await client.join(options.appid, options.channel, options.token || null, options.uid || null);
//         console.log("Joined channel:", options.channel, "with UID:", options.uid);

//         if (options.role === "host") {
//             localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
//                 encoderConfig: "music_standard"
//             });
//             localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
//             localTracks.videoTrack.play("local-player");
//             $("#local-player").removeClass("loading d-none");
//             console.log("Local tracks created and playing.");
//             await client.publish(Object.values(localTracks));
//             console.log("Published local tracks.");
//         } else {
//             $("#local-player").addClass("d-none"); // Hide local player for audience
//         }

//         $("#host-join").attr("disabled", true);
//         $("#audience-join").attr("disabled", true);
//         $("#leave").attr("disabled", false);
//     } catch (error) {
//         console.error("Error joining channel:", error);
//     }
// }

// async function leave() {
//     try {
//         for (var trackName in localTracks) {
//             var track = localTracks[trackName];
//             if (track) {
//                 track.stop();
//                 track.close();
//                 localTracks[trackName] = undefined;
//             }
//         }

//         remoteUsers = {};
//         $("#remote-playerlist").html("");

//         await client.leave();
//         $("#local-player").addClass("d-none");
//         $("#host-join").attr("disabled", false);
//         $("#audience-join").attr("disabled", false);
//         $("#leave").attr("disabled", true);
//         console.log("Client left the channel.");
//     } catch (error) {
//         console.error("Error leaving channel:", error);
//     }
// }

// async function subscribe(user, mediaType) {
//     const uid = user.uid;
//     await client.subscribe(user, mediaType);
//     console.log("Subscribed to user:", uid);
//     if (mediaType === 'video') {
//         const player = $(`
//             <div id="player-wrapper-${uid}">
//                 <p class="player-name">remoteUser(${uid})</p>
//                 <div id="player-${uid}" class="player"></div>
//             </div>
//         `);
//         $("#remote-playerlist").append(player);
//         user.videoTrack.play(`player-${uid}`, {
//             fit: "contain"
//         });
//     }
//     if (mediaType === 'audio') {
//         user.audioTrack.play();
//     }
// }

// function handleUserPublished(user, mediaType) {
//     console.log("User published:", user.uid);
//     const id = user.uid;
//     remoteUsers[id] = user;
//     subscribe(user, mediaType);
// }

// function handleUserUnpublished(user, mediaType) {
//     console.log("User unpublished:", user.uid);
//     if (mediaType === 'video') {
//         const id = user.uid;
//         delete remoteUsers[id];
//         $(`#player-wrapper-${id}`).remove();
//     }
// }
