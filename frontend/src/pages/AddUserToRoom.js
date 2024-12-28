import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';

const AdminRoomManager = () => {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [message, setMessage] = useState('');
    const { roomName } = useParams();

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
            const room = await API.get(`/chatrooms/${roomName}`);
            const userIds = room.data.users;

            const { data } = await API.post(`/chatrooms/${roomName}/addUserToRoom`, { userId: selectedUser, roomName });
            setUsers((prevUsers) => [...prevUsers, data.newUser]);
            setMessage('User added successfully!');
            setSelectedUser('');
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
        <div>
            <h1>Manage Room: {roomName}</h1>

            {/* Current Users */}
            <h3>Users in this Room:</h3>
            <ul>
            {users.map((user) => (
                    <li key={user._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{user.name}</span>
                        <button
                            onClick={() => handleRemoveUser(user._id)}
                            style={{
                                backgroundColor: '#ff4d4d',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                borderRadius: '4px',
                            }}
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>

            {/* Add New Users */}
            <h3>Add a User:</h3>
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="">Select a user</option>
                {allUsers
                    .filter((user) => !users.some((u) => u._id === user._id)) // Exclude users already in the room
                    .map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.name}
                        </option>
                    ))}
            </select>
            <button onClick={handleAddUser}>Add User</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminRoomManager;
