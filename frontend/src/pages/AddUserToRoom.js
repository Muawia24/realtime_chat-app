import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    MenuItem,
    Select,
    Button,
    Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import API from '../utils/api';
import { socket } from './Chat';

const AdminRoomManager = () => {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [message, setMessage] = useState('');
    const { roomName } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoomUsers = async () => {
            try {
                const { data } = await API.get(`/chatrooms/${roomName}`);
                const userIds = data.users;
                const roomUsers = await API.post('/roomusers', { userIds });
                setUsers(roomUsers.data);
            } catch (error) {
                console.error('Error fetching room users:', error);
            }
        };

        const fetchAllUsers = async () => {
            try {
                const { data } = await API.get('/users'); // Fetch all users
                const userList = data.filter(item => !users.includes(item));
                console.log(userList);
                setAllUsers(userList);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        fetchRoomUsers();
        fetchAllUsers();
    }, [roomName]);

    const handleAddUser = async () => {
        try {
            const { data } = await API.post(`/chatrooms/${roomName}/addUserToRoom`, { userId: selectedUser});
            const userIds = data.users;
            const roomUsers = await API.post('/roomusers', { userIds });
            const msg = {
                username: 'system',
                content: `Admin added ${data.newUser.name} to this room`,
                room: roomName,
            }
            console.log('new user:', data.newUser);
            setUsers((prevUsers) => [...prevUsers, data.newUser]);
    
            setMessage('User added successfully!');
            setSelectedUser('');

            socket.emit('add_user', { msg });

        } catch (error) {
            setMessage('User already exists');
            console.log(error);
        }
    };

    const handleRemoveUser = async (userId) => {
        try {
            await API.post(`/chatrooms/${roomName}/removeUser`, { userId });

            // Update the users list dynamically
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));

            setMessage('User removed successfully!');
        } catch (error) {
            setMessage('Error removing user.');
            console.error(error);
        }
    };

    //console.log(users.map(user => user));

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Manage Room: {roomName}
            </Typography>

            {/* Current Users */}
            <Typography variant="h6" gutterBottom>
                Users in this Room:
            </Typography>
            <List>
                {users.map((user) => (
                    <ListItem
                        key={user._id}
                        secondaryAction={
                            <IconButton
                                edge="end"
                                color="error"
                                onClick={() => handleRemoveUser(user._id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemText primary={user.name} />
                    </ListItem>
                ))}
            </List>

            {/* Add New Users */}
            <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
                Add a User:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    displayEmpty
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="" disabled>
                        Select a user
                    </MenuItem>
                    {allUsers.filter((user) => !users.some((u) => u._id === user._id))
                    .map((user) => (
                            <MenuItem key={user._id} value={user._id}>
                                {user.name}
                            </MenuItem>
                        ))}
                </Select>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleAddUser}
                >
                    Add User
                </Button>
            </Box>

            {/* Feedback Message */}
            {message && (
                <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ marginTop: 2 }}>
                    {message}
                </Alert>
            )}
        </Box>
    );
};

export default AdminRoomManager;
