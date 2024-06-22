import React, { useState } from 'react';
import { createClient, createChannel } from 'agora-rtm-react';
import './App.css';

const appID = '81986d5ee23d47798625898064cfdf40';
const useClient = createClient(appID);
const useChannel = createChannel('main');

const App = () => {
  const [uid, setUid] = useState(''); // UID state
  const [token, setToken] = useState(''); // Token state
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const client = useClient();
  const channel = useChannel(client);

  const generateToken = async () => {
    // Assuming you have a backend server that generates the token.
    // For demonstration, we use a static token generated earlier.
    // Replace this with a call to your backend to get the dynamic token.
    setToken('00681986d5ee23d47798625898064cfdf40IAAh84QlHaAy2YMkWYX+2430QqfCBM0GwUV9bQH7CzWnEEsKslUAAAAAEADlNYlJnul3ZgEA6AMupnZm');
  };

  const login = async () => {
    try {
      await generateToken(); // Generate token before login
      await client.login({ uid, token }); // Login using uid and token
      setLoggedIn(true);
      await channel.join();
      console.log('Logged in and joined channel:', uid);

      channel.on('ChannelMessage', ({ text }, memberId) => {
        setMessages(prevMessages => [...prevMessages, { memberId, text }]);
      });
    } catch (error) {
      console.error('Login or join channel error:', error);
    }
  };

  const sendMessage = async () => {
    if (!loggedIn) {
      console.error('Client is not logged in');
      return;
    }
    try {
      const rtmMessage = { text: message, messageType: 'TEXT' };
      await channel.sendMessage(rtmMessage);
      setMessages(prevMessages => [...prevMessages, { memberId: uid, text: message }]);
      setMessage('');
    } catch (error) {
      console.error('Send message error:', error);
    }
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
      <button onClick={login} disabled={loggedIn}>Join Channel</button>
      <div>
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} disabled={!loggedIn}>Send Message</button>
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
