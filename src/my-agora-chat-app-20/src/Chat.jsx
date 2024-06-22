// src/Chat.js
import React, { useEffect, useState } from 'react';
import AgoraRTM from 'agora-rtm-sdk';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [client, setClient] = useState(null);

    useEffect(() => {
        const initClient = async () => {
            const client = AgoraRTM.createInstance(import.meta.env.VITE_AGORA_APP_ID);
            setClient(client);
            await client.login({ uid: '10', token: null });

            const channel = client.createChannel('your_channel_name');
            await channel.join();

            channel.on('ChannelMessage', ({ text }, senderId) => {
                setMessages(prevMessages => [...prevMessages, { text, senderId }]);
            });
        };

        initClient();

        return () => {
            if (client) {
                client.logout();
            }
        };
    }, []);

    const sendMessage = async () => {
        if (client && message) {
            const channel = client.getChannel('your_channel_name');
            await channel.sendMessage({ text: message });
            setMessage('');
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <b>{msg.senderId}</b>: {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
