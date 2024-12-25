import React, { createContext, useState, useEffect } from "react";
import API from "../utils/api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("AuthProvider useEffect triggered");
        const storedUser = localStorage.getItem('userInfo');
        console.log("Stored User:", storedUser);

        if (storedUser) {
            setUser(JSON.parse(storedUser));
            console.log("User initialized:", JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        console.log(localStorage.getItem('userInfo'));
        console.log("User in AuthContext:", user);
        const { data } = await API.post('/auth/login', { email, password });
        console.log(JSON.stringify(data));
        localStorage.setItem('userInfo', JSON.stringify(data));
        
        setUser(data);
    }

    const register = async (name, email, password) => {
        const { data } = await API.post('/auth/register', { name, email, password });

        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;