import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API = (import.meta.env.VITE_API_URL) || 'http://localhost:5000/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  // Keep localStorage in sync
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // Login function
  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Register function
  const register = async (email, password, name) => {
    const res = await axios.post(`${API}/auth/register`, { email, password, name });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Logout function with redirect
  const logout = () => {
    setToken(null);
    setUser(null);
    window.location.href = '/login'; // redirect to login page
  };

  // Memoized Axios instance that updates headers whenever token changes
  const authAxios = useMemo(() => {
    return axios.create({
      baseURL: API,
      headers: { Authorization: token ? `Bearer ${token}` : '' }
    });
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
