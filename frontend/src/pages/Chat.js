import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import API from '../utils/api';
import { useNavigate, useParams } from 'react-router-dom';

const socket = io('http://localhost:5000'); // Connect to backend

const ChatRoom = () => {
    const { roomName } = useParams(); // Get the room name from the URL
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]); // Stores all messages (previous + new)
    const navigate = useNavigate();

    useEffect(() => {

        console.log('useEffect triggerd');

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const userId = userInfo?._id || 'Anonymous';
        setUserId(userId);

        const fetchRoomDetails = async () => {
            try {
                const { data } = await API.get(`/chatrooms/${roomName}`);
                setIsAdmin(data.admin === userId); // Check if current user is the room admin
            } catch (error) {
                console.error('Error fetching room details:', error);
            }
        };
        fetchRoomDetails();

        // Retrieve username from localStorage or default to 'Anonymous'
        const usernameFromStorage = JSON.parse(localStorage.getItem('userInfo'))?.name;

        // Join the room
        socket.emit('join_room', { username: usernameFromStorage, room: roomName });

        // Listen for previous messages
        socket.on('previousMessages', (previousMessages) => {
            console.log(`previous messages...`);
            setMessages(previousMessages); // Load previous messages into state
        });

        // Listen for new messages
        socket.on('receive_message', (msg) => {
            console.log(`received message: ${msg.content}`)
            setMessages((prevMessages) => [...prevMessages, msg]); // Add new message to state
        });

        

        return () => {
            socket.off('previousMessages');
            socket.off('receive_message');
        };
    }, [roomName]);

    const sendMessage = () => {
        if (message) {
            const userId = JSON.parse(localStorage.getItem('userInfo'))?._id;
            socket.emit('send_message', { sender: userId, room: roomName, content: message });
            setMessage('');
        }
    };

    const handleManageRoom = () => {
        navigate(`/chat/${roomName}/manage`); // Redirect to the manage room page
    };

    return (
        <div>
            <h1>Room: {roomName}</h1>
            {/* Conditionally Show Manage Room Button */}
            {isAdmin && (
                <button onClick={handleManageRoom} style={{ marginBottom: '1rem', cursor: 'pointer' }}>
                    Manage Room
                </button>
            )}
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
