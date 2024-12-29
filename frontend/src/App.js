import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatRoom from './pages/Chat';
import ChatRooms from './pages/ChatRooms';
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

            <div>
                <h1>Real-Time Chat App</h1>
                <Header />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/chatrooms" />} />
                    <Route path="/register" element={!user ? <Register /> : <Navigate to="/chatrooms" />} />

                    {/* Protected Routes */}
                    <Route path="/chatrooms" element={user ? <ChatRooms /> : <Navigate to="/login" />} />
                    <Route path="/chat/:roomName" element={user ? <ChatRoom /> : <Navigate to="/login" />} />
                    <Route path="/chat/:roomName/manage" element={user ? <AdminRoomManager /> : <Navigate to="/login" />} />

                    

                    {/* Logout Route */}
                    <Route path="/logout" element={<LogoutHandler />} />

                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to={user ? "/chatrooms" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
