import React, { useState } from 'react';
import { createClient, createChannel } from 'agora-rtm-react';

const useClient = createClient('81986d5ee23d47798625898064cfdf40');
const useChannel = createChannel('main');

const App = () => {
  const [uid, setUid] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const client = useClient();
  const channel = useChannel(client);

  const login = async () => {
    await client.login({ uid });
    await channel.join();

    channel.on('ChannelMessage', ({ text }, memberId) => {
      setMessages(prevMessages => [...prevMessages, { memberId, text }]);
    });
  };

  const sendMessage = async () => {
    const rtmMessage = { text: message, messageType: 'TEXT' };
    await channel.sendMessage(rtmMessage);
    setMessages(prevMessages => [...prevMessages, { memberId: uid, text: message }]);
    setMessage('');
  };

  return (
    <div>
      <h1>Agora RTM Messaging</h1>
      <input
        type="text"
        placeholder="Enter your UID"
        value={uid}
        onChange={e => setUid(e.target.value)}
      />
      <button onClick={login}>Join Channel</button>
      <div>
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
      <div>
        <h2>Messages</h2>
        {messages.map((msg, index) => (
          <div key={index}><strong>{msg.memberId}:</strong> {msg.text}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
