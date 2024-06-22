// App.js
import React, { useEffect, useState } from 'react';
import { useRTMClient } from 'agora-rtm-react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import './App.css';

const App = () => {
  const [client, setClient] = useState(null);
  const [localTracks, setLocalTracks] = useState({
    videoTrack: null,
    audioTrack: null,
  });
  const [remoteUsers, setRemoteUsers] = useState({});
  const rtmClient = useRTMClient();
  const [channel, setChannel] = useState(null);
  const options = {
    appid: "81986d5ee23d47798625898064cfdf40",
    channel: "main",
    uid: null,
    token: "007eJxTYFDIZc9rW8N3SmZaelejh+BdH3fZE02CHc6Tb9nH/nqRuEiBwcLQ0sIsxTQ11cg4xcTcHMgxMrWwtDAwM0lOS0kzMXgulJnWEMjIsFbnCAMjFIL4LAy5iZl5DAwAmb8dRw==",
    role: "audience",
    audienceLatency: 2,
    rtmToken: "00681986d5ee23d47798625898064cfdf40IABe1RD/vGY+wkr+cF83jzEzhy8HKplmYwqdFOiCSdpk1m9rZqAAAAAAEACnP2T62O9pZgEA6AMQDgAA",
  };

  useEffect(() => {
    const initClient = async () => {
      const agoraClient = AgoraRTC.createClient({
        mode: "live",
        codec: "vp8",
      });
      setClient(agoraClient);
      await rtmClient.login({ token: options.rtmToken, uid: options.uid });
      const agoraChannel = rtmClient.createChannel(options.channel);
      await agoraChannel.join();
      setChannel(agoraChannel);
      agoraChannel.on('ChannelMessage', ({ text }, senderId) => {
        displayReaction(text);
      });
    };

    initClient();
  }, [rtmClient]);

  const joinChannel = async (role) => {
    options.role = role;
    console.log("Joining with role:", options.role);
    await client.join(options.appid, options.channel, options.token || null, options.uid || null);
    if (role === "host") {
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setLocalTracks({ videoTrack, audioTrack });
      await client.publish([videoTrack, audioTrack]);
      videoTrack.play('local-player');
    }
  };

  const leaveChannel = async () => {
    for (let trackName in localTracks) {
      const track = localTracks[trackName];
      if (track) {
        track.stop();
        track.close();
      }
    }
    await client.leave();
    await channel.leave();
    await rtmClient.logout();
  };

  const sendReaction = (emoji) => {
    channel.sendMessage({ text: emoji });
    displayReaction(emoji);
  };

  const displayReaction = (emoji) => {
    const emojiElement = document.createElement('div');
    emojiElement.className = 'emoji';
    emojiElement.innerText = emoji;
    document.getElementById('emoji-container').appendChild(emojiElement);
    setTimeout(() => {
      emojiElement.style.display = 'none';
    }, 1000);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#">Basic Live</a>
      </nav>
      <div className="container mt-3">
        <div className="row">
          <div className="col text-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => joinChannel('host')}
            >
              Join as host
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => joinChannel('audience')}
            >
              Join as audience
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={leaveChannel}
            >
              Leave
            </button>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <div id="local-player" className="player"></div>
            <div id="remote-playerlist"></div>
            <div id="emoji-reactions" className="text-center mt-3">
              {['👍', '❤️', '😂', '😮', '😢', '😡'].map((emoji) => (
                <button
                  key={emoji}
                  className="btn btn-sm btn-light emoji-btn"
                  onClick={() => sendReaction(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div id="emoji-container" className="emoji-container"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
