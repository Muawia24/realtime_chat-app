import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LogoutHandler = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        logout(); // Log the user out
        navigate('/login'); // Redirect to login page
    }, [logout, navigate]);

    return null; // This component doesn't render anything
};

export default LogoutHandler;
