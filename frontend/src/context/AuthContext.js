import React, { createContext, useState } from "react";
import API from "../utils/api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const { user, setUser } = useState(null);

    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });

        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    }

    const register = async (name, email, password) => {
        const { data } = await API.post('/auth/login', { email, password });

        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;