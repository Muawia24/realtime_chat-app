import React, { use } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import API from '../utils/api';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const MessageList = ({ messages, isAdmin, socket }) => {
    const [dropdownVisible, setDropdownVisible] = React.useState(null);
    const user = JSON.parse(localStorage.getItem('userInfo')) || {};

    const toggleDropdown = (messageId) =>
        setDropdownVisible((prev) => (prev === messageId ? null : messageId));

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
                        justifyContent: msg.sender === user._id ? 'flex-start' : 'flex-end',
                        marginBottom: 1,
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: msg.sender === user._id ? '#e0f7fa' : '#d1c4e9',
                            padding: '8px 12px',
                            borderRadius: '16px',
                            maxWidth: '70%',
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {msg.sender === user._id ? 'You' : msg.username}
                        </Typography>
                        <Typography variant="body1">{msg.content}</Typography>
                        {msg.fileUrl && (
                            <a
                                href={`http://localhost:5000${msg.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'blue', textDecoration: 'underline' }}
                            >
                                View File
                            </a>
                        )}
                        {isAdmin && (
                            <>
                                <IconButton onClick={() => toggleDropdown(msg._id)} size="small">
                                    <MoreVertIcon />
                                </IconButton>
                                {dropdownVisible === msg._id && (
                                    <Menu
                                        open
                                        onClose={() => setDropdownVisible(null)}
                                    >
                                        <MenuItem onClick={() => deleteMessage(msg._id)}>
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
    );
};

export default MessageList;
