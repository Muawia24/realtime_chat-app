import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    TextField,
    Alert,
} from '@mui/material';

import API from '../utils/api';

const ChatRooms = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [error, setError] = useState('');
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate(); // Initialize navigate

    // Fetch chat rooms on load
    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const { data } = await API.get('/chatrooms');
                setChatRooms(data);
            } catch (err) {
                console.error('Failed to fetch chat rooms:', err);
            }
        };

        fetchChatRooms();
    }, []);

    // Handle new chat room creation
    const createChatRoom = async () => {
        if (!newRoomName) {
            setError('Room name is required');
            return;
        }

        try {
            const { data } = await API.post('/chatrooms', { name: newRoomName });
            setChatRooms((prevRooms) => [...prevRooms, data]); // Add new room to the list
            setNewRoomName(''); // Clear input
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create chat room');
        }
    };

    // Navigate to a specific room
    const joinRoom = (roomName) => {
        navigate(`/chat/${roomName}`); // Navigate to the room's chat page
    };

    const handleLogout = () => {
        logout(); // Log out the user
        navigate('/login'); // Redirect to login page
    };

    return (
        <Box sx={{ padding: 2 }}>
            {/* Header */}
            <AppBar position="static" sx={{ marginBottom: 3 }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Chat Rooms</Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Log Out
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Chat Room List */}
            <Typography variant="h5" gutterBottom>
                Available Chat Rooms
            </Typography>
            <List>
                {chatRooms.map((room) => (
                    <ListItem key={room._id} disablePadding>
                        <ListItemButton onClick={() => joinRoom(room.name)}>
                            <ListItemText primary={room.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* Create New Chat Room */}
            <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Create a New Chat Room
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <TextField
                        label="New Room Name"
                        variant="outlined"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        sx={{ flexGrow: 1, minWidth: 200 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={createChatRoom}
                    >
                        Create Room
                    </Button>
                </Box>
                {error && (
                    <Alert severity="error" sx={{ marginTop: 2 }}>
                        {error}
                    </Alert>
                )}
            </Box>
        </Box>
    );
};

export default ChatRooms;