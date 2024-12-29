import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Box, Typography, TextField, Button, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    console.log("AuthContext login function:", login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log();
            await login(email, password);
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
        }
    }
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    borderRadius: 2,
                    maxWidth: 400,
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            type="email"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            type="password"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ paddingY: 1.5 }}
                        >
                            Login
                        </Button>
                    </Box>
                </form>
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="body2">
                        Don't have an account?{' '}
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => navigate('/register')}
                            sx={{ textDecoration: 'none', color: 'primary.main' }}
                        >
                            Register Here
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}

export default Login;

