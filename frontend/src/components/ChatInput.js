import React, { useState } from 'react';
import { Box, TextField, Button, IconButton, Chip } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import API from '../utils/api';

const MessageInput = ({ roomName, socket }) => {
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);

    const handleSendMessage = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
        if (!message && !file) return;

        const formData = new FormData();
        formData.append('room', roomName);
        formData.append('sender', userInfo._id);
        formData.append('username', userInfo.name);
        if (message) formData.append('content', message);
        if (file) formData.append('file', file);

        try {
            const { data } = await API.post(`/chatrooms/${roomName}/messages`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            socket.emit('send_message', data);
            setMessage('');
            setFile(null);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
                label="Enter your message"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <IconButton component="label">
                <AttachFileIcon />
                <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
            </IconButton>
            <Button variant="contained" color="primary" onClick={handleSendMessage}>
                Send
            </Button>
            {file && (
                <Chip
                    label={file.name}
                    onDelete={() => setFile(null)}
                    color="primary"
                    variant="outlined"
                />
            )}
        </Box>
    );
};

export default MessageInput;
