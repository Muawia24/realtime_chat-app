import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #1e88e5, #42a5f5)',
                color: '#fff',
                textAlign: 'center',
                padding: 3,
            }}
        >
            {/* Welcome Text */}
            <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                Welcome to ChatSpace
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 4 }}>
                Connect with your friends in real-time. Sign up or log in to get started!
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        fontWeight: 'bold',
                        textTransform: 'none',
                    }}
                >
                    Log In
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                        borderColor: '#fff',
                        color: '#fff',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': {
                            borderColor: '#fff',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                        },
                    }}
                >
                    Register
                </Button>
            </Box>

            {/* Footer */}
            <Typography variant="body2" sx={{ marginTop: 6, opacity: 0.7 }}>
                © {new Date().getFullYear()} ChatSpace. All rights reserved.
            </Typography>
        </Box>
    );
};

export default HomePage;
