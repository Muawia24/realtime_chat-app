import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Container } from '@mui/material';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatRoom from './pages/Chat';
import ChatRooms from './pages/ChatRooms';
import HomePage from './pages/Home';
import AdminRoomManager from './pages/AddUserToRoom';
import LogoutHandler from './pages/LogoutHandler';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Header from './Header';

const App = () => {
    const { loading, user } = useContext(AuthContext); // Get the authenticated user

    if (loading) {
        // Optionally show a loader while the user state is being initialized
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <CssBaseline /> {/* Resets default browser styling for a cleaner UI */}
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {/* App Header */}
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            ChatSpace
                        </Typography>
                        <Header user={user} />
                    </Toolbar>
                </AppBar>

                {/* Main Content */}
                <Box sx={{ flexGrow: 1, paddingY: 3 }}>
                    <Container>
                        <Routes>
                            {/* Home Page Route */}
                            <Route path="/home" element={<HomePage />} />

                            {/* Public Routes */}
                            <Route
                                path="/login"
                                element={!user ? <Login /> : <Navigate to="/chatrooms" />}
                            />
                            <Route
                                path="/register"
                                element={!user ? <Register /> : <Navigate to="/chatrooms" />}
                            />

                            {/* Protected Routes */}
                            <Route
                                path="/chatrooms"
                                element={user ? <ChatRooms /> : <Navigate to="/home" />}
                            />
                            <Route
                                path="/chat/:roomName"
                                element={user ? <ChatRoom /> : <Navigate to="/home" />}
                            />
                            <Route
                                path="/chat/:roomName/manage"
                                element={user ? <AdminRoomManager /> : <Navigate to="/home" />}
                            />

                            {/* Logout Route */}
                            <Route path="/logout" element={<LogoutHandler />} />

                            {/* Fallback Route */}
                            <Route
                                path="*"
                                element={<Navigate to={user ? "/chatrooms" : "/home"} />}
                            />
                        </Routes>
                    </Container>
                </Box>

                {/* Footer */}
                <Box component="footer" sx={{ py: 2, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                    <Typography variant="body2" color="textSecondary">
                        © 2024 ChatSpace. All rights reserved.
                    </Typography>
                </Box>
            </Box>
        </Router>
    );
};

export default App;
