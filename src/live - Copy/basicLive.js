// basicLive.js

// Create Agora client
var client = AgoraRTC.createClient({
    mode: "live",
    codec: "vp8"
});
var localTracks = {
    videoTrack: null,
    audioTrack: null
};
var remoteUsers = {};

// Agora client options
var options = {
    // appid: "81986d5ee23d47798625898064cfdf40",
    // // appid: "69b5921596cd4632a94ead5fe6706777",
    // channel: "soe2",
    // uid: '2',
    // token: "00669b5921596cd4632a94ead5fe6706777IAAoy/ziujnNIHSMCtn5/KcittgKdiXMM+apE0XxA862oRGSGMsNvtUaIgBX0XYeRRdsZgQAAQDFIZFrAgDFIZFrAwDFIZFrBADFIZFr",
    // role: "audience", // host or audience
    // audienceLatency: 2

    // appid: "81986d5ee23d47798625898064cfdf40",
    appid: "69b5921596cd4632a94ead5fe6706777",
    channel: "soe1",
    uid: '3',
    token: "00669b5921596cd4632a94ead5fe6706777IAA01W0XKQKKb/q3lLSVCxbJ5/yPuHXcRgAc961saeYi5KvDEVK379yDIgANMiWS5xZsZgQAAQBnIZFrAgBnIZFrAwBnIZFrBABnIZFr",
    role: "audience", // host or audience
    audienceLatency: 2
};

$(document).ready(function () {
    $("#host-join").click(function (e) {
        options.role = "host";
        join();
    });

    $("#audience-join").click(function (e) {
        options.role = "audience";
        options.audienceLatency = 2;
        join();
    });

    $("#leave").click(function (e) {
        leave();
    });
});

async function join() {
    console.log("Joining with role:", options.role);

    // Show loading indicator
    $("#local-player").addClass("loading");

    if (options.role === "audience") {
        client.setClientRole(options.role, {
            level: options.audienceLatency
        });
        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", handleUserUnpublished);
    } else {
        // Remove existing listeners if any
        client.getListeners("user-published").includes(handleUserPublished) && client.off("user-published", handleUserPublished);
        client.getListeners("user-unpublished").includes(handleUserUnpublished) && client.off("user-unpublished", handleUserUnpublished);
        client.setClientRole(options.role);
    }

    try {
        options.uid = await client.join(options.appid, options.channel, options.token || null, options.uid || null);
        console.log("Joined channel:", options.channel, "with UID:", options.uid);

        if (options.role === "host") {
            localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
                encoderConfig: "music_standard"
            });
            localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
            localTracks.videoTrack.play("local-player");
            $("#local-player").removeClass("loading d-none");
            console.log("Local tracks created and playing.");
            await client.publish(Object.values(localTracks));
            console.log("Published local tracks.");
        } else {
            $("#local-player").addClass("d-none"); // Hide local player for audience
        }

        $("#host-join").attr("disabled", true);
        $("#audience-join").attr("disabled", true);
        $("#leave").attr("disabled", false);
    } catch (error) {
        console.error("Error joining channel:", error);
    }
}

async function leave() {
    try {
        for (var trackName in localTracks) {
            var track = localTracks[trackName];
            if (track) {
                track.stop();
                track.close();
                localTracks[trackName] = undefined;
            }
        }

        remoteUsers = {};
        $("#remote-playerlist").html("");

        await client.leave();
        $("#local-player").addClass("d-none");
        $("#host-join").attr("disabled", false);
        $("#audience-join").attr("disabled", false);
        $("#leave").attr("disabled", true);
        console.log("Client left the channel.");
    } catch (error) {
        console.error("Error leaving channel:", error);
    }
}

async function subscribe(user, mediaType) {
    const uid = user.uid;
    await client.subscribe(user, mediaType);
    console.log("Subscribed to user:", uid);
    if (mediaType === 'video') {
        const player = $(`
            <div id="player-wrapper-${uid}">
                <p class="player-name">remoteUser(${uid})</p>
                <div id="player-${uid}" class="player"></div>
            </div>
        `);
        $("#remote-playerlist").append(player);
        user.videoTrack.play(`player-${uid}`, {
            fit: "contain"
        });
    }
    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
}

function handleUserPublished(user, mediaType) {
    console.log("User published:", user.uid);
    const id = user.uid;
    remoteUsers[id] = user;
    subscribe(user, mediaType);
}

function handleUserUnpublished(user, mediaType) {
    console.log("User unpublished:", user.uid);
    if (mediaType === 'video') {
        const id = user.uid;
        delete remoteUsers[id];
        $(`#player-wrapper-${id}`).remove();
    }
}
