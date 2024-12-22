import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [room, setRoom] = useState('');
    const [username, setUsername] = useState('');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Listen for incoming messages
        socket.on('receive_message', (msg) => {
            if (msg.room === room) {
                setMessages((prevMessages) => [...prevMessages, msg]);
            } else {
                // If the message is for another room, show notification
                setNotifications((prevNotifications) => [
                    ...prevNotifications,
                    `New message from ${msg.room}: ${msg.content}`,
                ]);
            }
        });

        socket.on('previousMessages', (previousMessages) => {
            setMessages(previousMessages);
        });

        return () => {
            socket.disconnect();
        };
    }, [room]);

    const joinRoom = () => {
        if (username && room) {
            socket.emit('joinRoom', { username, room });
        }
    };

    const sendMessage = () => {
        if (message) {
            socket.emit('send_message', { sender: username, room: room, content: message });
            setMessage(''); // Clear input field
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Chat Room</h1>
            {!room ? (
                <div>
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter room"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                    />
                    <button onClick={joinRoom}>Join Room</button>
                </div>
            ) : (
                <div>
                    {/* Notifications */}
                    {notifications.length > 0 && (
                        <div style={{ marginBottom: '1rem', color: 'red' }}>
                            {notifications.map((notif, index) => (
                                <p key={index}>{notif}</p>
                            ))}
                        </div>
                    )}

                    {/* Chat Messages */}
                    <div
                        style={{
                            border: '1px solid #ccc',
                            padding: '1rem',
                            height: '300px',
                            overflowY: 'scroll',
                        }}
                    >
                        {messages.map((msg, index) => (
                            <p key={index}>
                                <strong>{msg.sender}: </strong>
                                {msg.content}{' '}
                                <small>({new Date(msg.timestamp).toLocaleTimeString()})</small>
                            </p>
                        ))}
                    </div>

                    {/* Input Field */}
                    <input
                        type="text"
                        placeholder="Enter message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            )}
        </div>
    );
};

export default Chat;