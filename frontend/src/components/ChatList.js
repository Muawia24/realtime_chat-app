import React from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import API from '../utils/api';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const MessageList = ({ messages, isAdmin, socket }) => {
    const [anchorEl, setAnchorEl] = React.useState(null); // Anchor element for menu
    const [selectedMessageId, setSelectedMessageId] = React.useState(null); // Tracks the selected message ID
    const user = JSON.parse(localStorage.getItem('userInfo')) || {};

    const handleMenuOpen = (event, messageId) => {
        setAnchorEl(event.currentTarget); // Set the clicked element as the anchor
        setSelectedMessageId(messageId); // Track the message for which the menu is open
    };

    const handleMenuClose = () => {
        setAnchorEl(null); // Close the menu
        setSelectedMessageId(null); // Reset the selected message ID
    };

    const deleteMessage = async (messageId) => {
        try {
            await API.delete(`/messages/${messageId}`);
            socket.emit('delete_message', messageId); // Notify other clients
            handleMenuClose(); // Close the menu
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
                        {/* Username and Three-Dot Menu */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 1,
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {msg.sender === user._id ? 'You' : msg.username}
                            </Typography>

                            {isAdmin && (
                                <IconButton
                                    onClick={(event) => handleMenuOpen(event, msg._id)}
                                    size="small"
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            )}
                        </Box>
                        
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
                               

                                {/* Dropdown Menu */}
                                <Menu
                                    anchorEl={anchorEl} // Anchor the menu to the clicked button
                                    open={Boolean(anchorEl && selectedMessageId === msg._id)} // Ensure the correct menu is open
                                    onClose={handleMenuClose} // Close on outside click
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                >
                                    <MenuItem
                                        onClick={() => deleteMessage(selectedMessageId)}
                                    >
                                        Delete
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default MessageList;
