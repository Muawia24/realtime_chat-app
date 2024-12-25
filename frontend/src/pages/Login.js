import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

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
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;

