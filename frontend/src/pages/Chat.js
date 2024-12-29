import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import API from '../utils/api';
import {
    Box,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Menu,
    MenuItem,
  } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate, useParams } from 'react-router-dom';

const socket = io('http://localhost:5000'); // Connect to backend

const ChatRoom = () => {
    const { roomName } = useParams(); // Get the room name from the URL
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]); // Stores all messages (previous + new)
    const [anchorEl, setAnchorEl] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(null);
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

        socket.on('delete_message1', (messageId) => {
            console.log('delete msg');
            setMessages((prevMessages) =>
                prevMessages.filter((msg) => msg._id !== messageId)
            );
        });

        

        return () => {
            socket.off('previousMessages');
            socket.off('receive_message');
            socket.off('delete_message');
            
        };
    }, [roomName]);

    const sendMessage = () => {
        if (message) {
            const userId = JSON.parse(localStorage.getItem('userInfo'))?._id;
            const username = JSON.parse(localStorage.getItem('userInfo')).name;
            console.log('sending triggers');
            socket.emit('send_message', { sender: userId, room: roomName, content: message , username: username});
            setMessage('');
        }
    };

    const handleManageRoom = () => {
        navigate(`/chat/${roomName}/manage`); // Redirect to the manage room page
    };

    const toggleDropdown = (messageId) => {
        setDropdownVisible((prev) => (prev === messageId ? null : messageId));
    };

    const deleteMessage = async (messageId) => {
        try {
          await API.delete(`/messages/${messageId}`);
          socket.emit('delete_message', messageId);
          setDropdownVisible(null);
        } catch (error) {
          console.error('Error deleting message:', error);
        }
      };

      return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Room: {roomName}
            </Typography>

            {/* Conditionally Show Manage Room Button */}
            {isAdmin && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleManageRoom}
                    sx={{ marginBottom: 2 }}
                >
                    Manage Room
                </Button>
            )}

            {/* Messages Section */}
            <Box
                sx={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: 2,
                    height: '300px',
                    overflowY: 'scroll',
                    marginBottom: 2,
                }}
            >
                {messages.map((msg) => (
                    <Box
                        key={msg._id}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'relative', // Needed for dropdown
                            marginBottom: 1,
                        }}
                    >
                        <Typography>
                            <strong>{msg.username}:</strong> {msg.content}{' '}
                            <small>({new Date(msg.timestamp).toLocaleTimeString()})</small>
                        </Typography>

                        {/* Three Dots Menu */}
                        {isAdmin && (
                            <>
                                <IconButton
                                    onClick={() => toggleDropdown(msg._id)}
                                    size="small"
                                >
                                    <MoreVertIcon />
                                </IconButton>

                                {/* Dropdown Options */}
                                {dropdownVisible === msg._id && (
                                    <Menu
                                        anchorEl={null} // Use parent position for placement
                                        open={Boolean(dropdownVisible === msg._id)}
                                        onClose={() => setDropdownVisible(null)}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            zIndex: 10,
                                        }}
                                    >
                                        <MenuItem
                                            onClick={() => deleteMessage(msg._id)}
                                            sx={{ color: 'red' }}
                                        >
                                            Delete
                                        </MenuItem>
                                    </Menu>
                                )}
                            </>
                        )}
                    </Box>
                ))}
            </Box>

            {/* Input Section */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    label="Enter your message"
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={sendMessage}
                >
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default ChatRoom;
