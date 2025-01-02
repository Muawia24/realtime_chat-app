import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import API from '../utils/api';
import { SOCKET_URL } from '../config/config';
import { Box, Typography, Button, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import MessageList from '../components/ChatList';
import MessageInput from '../components/ChatInput';

export const socket = io(SOCKET_URL);

const ChatRoom = () => {
    const { roomName } = useParams();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const { data } = await API.get(`/chatrooms/${roomName}`);
                setIsAdmin(data.admin === userInfo._id);
            } catch (error) {
                console.error('Error fetching room details:', error);
                setError('Failed to fetch room details.');
            }
        };

        fetchRoomDetails();
        console.log('before joining');
        socket.emit('join_room', { username: userInfo.name, room: roomName });

        socket.on('previousMessages', setMessages);
        socket.on('receive_message', (msg) => setMessages((prev) => [...prev, msg]));
        socket.on('delete_message', (messageId) =>
            setMessages((prev) => prev.filter((msg) => msg._id !== messageId))
        );
        socket.on('delete_message1', (messageId) => {
            console.log('delete msg');
            setMessages((prevMessages) =>
                prevMessages.filter((msg) => msg._id !== messageId)
            );
        });

        socket.on('added_user', (msg) => setMessages((prev) => [...prev, msg]));

        return () => {
            socket.off('previousMessages');
            socket.off('receive_message');
            socket.off('delete_message');
            socket.off('join_room');
        };
    }, [roomName]);

    const handleExitRoom = async () => {
        try {
            await API.post(`/chatrooms/${roomName}/exit`, { userId: userInfo._id });
            const msg = {
                username: 'system',
                content: `${userInfo.name} has left the room`,
                room: roomName,
            }
            socket.emit('leave_room', { room: roomName, msg});
            navigate('/chatrooms');
        } catch (err) {
            console.error('Error exiting room:', err);
            setError('Failed to exit the room. Please try again.');
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Room: {roomName}
            </Typography>

            {isAdmin && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/chat/${roomName}/manage`)}
                    sx={{ marginBottom: 2 }}
                >
                    Manage Room
                </Button>
            )}

            <Button
                variant="outlined"
                color="error"
                onClick={handleExitRoom}
                sx={{ marginBottom: 2, marginLeft: 2 }}
            >
                Exit Room
            </Button>

            {error && <Alert severity="error">{error}</Alert>}

            <MessageList messages={messages} isAdmin={isAdmin} socket={socket} />
            <MessageInput roomName={roomName} socket={socket} />
        </Box>
    );
};

export default ChatRoom;
