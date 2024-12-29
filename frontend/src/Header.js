import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation(); // Get the current route
    const navigate = useNavigate(); // For navigation

    // Determine where the button should go and its label
    let navigateTo = '/chatrooms';
    let label = 'Back to Chatrooms';

    if (location.pathname.includes('/chat/') && location.pathname.includes('/manage')) {
        navigateTo = `/chat/${location.pathname.split('/')[2]}`; // Navigate back to the chat room
        label = 'Back to Chat';
    } else if (location.pathname.includes('/chat/')) {
        navigateTo = '/chatrooms'; // Navigate back to chatrooms
        label = 'Back to Chatrooms';
    } else {
        return;
    }

    return (
        <button
            onClick={() => navigate(navigateTo)}
            style={{
                marginBottom: '1rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                cursor: 'pointer',
                borderRadius: '5px',
            }}
        >
            {label}
        </button>
    );
};

export default Header;
