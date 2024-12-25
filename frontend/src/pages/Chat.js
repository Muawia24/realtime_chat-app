import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to backend

const ChatRoom = () => {
    const { roomName } = useParams(); // Get the room name from the URL
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]); // Stores all messages (previous + new)

    useEffect(() => {
        // Retrieve username from localStorage or default to 'Anonymous'
        const usernameFromStorage = JSON.parse(localStorage.getItem('userInfo'))?._id || 'Anonymous';
        setUserId(usernameFromStorage);

        // Join the room
        socket.emit('joinRoom', { username: usernameFromStorage, room: roomName });

        // Listen for previous messages
        socket.on('previousMessages', (previousMessages) => {
            setMessages(previousMessages); // Load previous messages into state
        });

        // Listen for new messages
        socket.on('receive_message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]); // Add new message to state
        });

        return () => {
            socket.disconnect(); // Disconnect socket on component unmount
        };
    }, [roomName]);

    const sendMessage = () => {
        if (message) {
            socket.emit('send_message', { sender: userId, room: roomName, content: message });
            setMessage('');
        }
    };

    return (
        <div>
            <h1>Room: {roomName}</h1>
            <div
                style={{
                    border: '1px solid #ccc',
                    padding: '1rem',
                    height: '300px',
                    overflowY: 'scroll',
                    marginBottom: '1rem',
                }}
            >
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.sender}:</strong> {msg.content}{' '}
                        <small>({new Date(msg.timestamp).toLocaleTimeString()})</small>
                    </p>
                ))}
            </div>
            <input
                type="text"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatRoom;
