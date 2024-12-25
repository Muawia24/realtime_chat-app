import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const ChatRooms = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [error, setError] = useState('');
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

    return (
        <div>
            <h1>Your Chat Rooms</h1>

            {/* Chat Room List */}
            <ul>
                {chatRooms.map((room) => (
                    <li key={room._id}>
                        <button
                            onClick={() => joinRoom(room.name)}
                            style={{
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                color: 'blue',
                                textDecoration: 'underline',
                            }}
                        >
                            {room.name}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Create New Chat Room */}
            <div>
                <input
                    type="text"
                    placeholder="Enter new room name"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                />
                <button onClick={createChatRoom}>Create Room</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default ChatRooms;