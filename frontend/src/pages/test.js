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
    Alert,
    Chip,
  } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
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
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('userInfo'));

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

        socket.on('user_left', (msg) => {
            
            setMessages((prevMessages) => [...prevMessages, msg.content]);
        })

        

        return () => {
            socket.off('previousMessages');
            socket.off('receive_message');
            socket.off('delete_message');
            
        };
    }, [roomName]);

    const sendMessage = async () => {
        if (message || file) {
            const user = JSON.parse(localStorage.getItem('userInfo'));
            const formData = new FormData();
            formData.append('room', roomName);
            formData.append('sender', user._id);
            formData.append('username', user.name)
            if (message) formData.append('content', message);
            if (file) formData.append('file', file);
            try {
                const { data } = await API.post(`/chatrooms/${roomName}/messages`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                socket.emit('sendMessage', data); // Emit the new message to the server
                setMessages((prevMessages) => [...prevMessages, data]); // Optimistically update the UI
                setMessage('');
                setFile(null);
            } catch (err) {
                console.error('Error sending message:', err);
            }
        } 
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const handleRemoveFile = () => {
        setFile(null); // Remove the selected file
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
    
    const handleExitRoom = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('userInfo'));
            const msg = {
                username: 'System',
                room: roomName,
                content: `${user.name} has left the room.`,
                timestamp: new Date(),
            };

            await API.post(`/chatrooms/${roomName}/exit`, { userId: user._id }); // Call API to remove the user
            socket.emit('leave_room', { room: roomName, msg: msg }); // Notify the backend via socket
            navigate('/chatrooms'); // Redirect to chatrooms page
        } catch (err) {
            setError('Failed to exit the room. Please try again.');
            console.error(err);
        }
    };
    const handleConfirmExit = () => {
        setOpen(false);
        handleExitRoom();
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

            {/* Exit Room Button */}
            <Button
                variant="outlined"
                color="error"
                onClick={handleConfirmExit}
                sx={{ marginBottom: 2, marginLeft: 2 }}
            >
                Exit Room
            </Button>

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{ marginTop: 2 }}>
                    {error}
                </Alert>
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
                {messages.map((msg, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: msg.sender === user._id ? 'flex-start' : 'flex-end',
                            marginBottom: 1,
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: msg.sender === user._id ? '#e0f7fa' : '#d1c4e9',
                                color: 'black',
                                padding: '8px 12px',
                                borderRadius: '16px',
                                maxWidth: '70%',
                                textAlign: msg.sender === user._id ? 'left' : 'right',
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                {msg.sender === user._id ? 'You' : msg.username}
                            </Typography>
                            <Typography variant="body1">{msg.content}</Typography>
                            {msg.fileUrl && (
                                <a
                                    href={msg.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'blue', textDecoration: 'underline', fontSize: '0.9rem' }}
                                >
                                    View File
                                </a>
                        )}

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
                 <IconButton component="label">
                    <AttachFileIcon />
                    <input type="file" hidden onChange={handleFileChange} />
                </IconButton>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={sendMessage}
                >
                    Send
                </Button>
            </Box>
            {file && (
                <Chip
                    label={file.name}
                    onDelete={handleRemoveFile}
                    color="primary"
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                />
            )}
        </Box>
    );
};

export default ChatRoom;
