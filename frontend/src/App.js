import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const App = () => {
    const { user } = useContext(AuthContext); // Get the authenticated user

    return (
        <Router>
            <div>
                <h1>Real-Time Chat App</h1>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/chat" />} />
                    <Route path="/register" element={!user ? <Register /> : <Navigate to="/chat" />} />

                    {/* Protected Routes */}
                    <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />

                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to={user ? "/chat" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
