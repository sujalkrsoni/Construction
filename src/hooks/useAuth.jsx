// src/hooks/useAuth.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi } from '../api';
import api from '../api'; // For the logout API call

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Will store { isAuthenticated: true, mobileNo: '...' } or null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user was previously logged in based on localStorage
    const storedMobileNo = localStorage.getItem('userMobileNo');
    const isLoggedInFlag = localStorage.getItem('isLoggedIn');

    if (storedMobileNo && isLoggedInFlag === 'true') {
      setUser({ isAuthenticated: true, mobileNo: storedMobileNo });
    }
    setLoading(false); // Authentication state determined
  }, []);

  const login = async (mobileNo, password) => {
    try {
      const data = await loginApi(mobileNo, password);
      console.log(data.statusCode, data.message)
      if (data.statusCode === "200" && data.message === "Login successful") {
        // Login successful.
        // Save flag and mobile number to localStorage (NOT PASSWORD!)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userMobileNo', mobileNo); // Store mobile number as an identifier
        setUser({ isAuthenticated: true, mobileNo });
        return true;
      } else {
        // Login failed on the server side
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Clear any potentially stale login info
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userMobileNo');
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Make a call to your backend's logout endpoint if it exists
      // This is crucial for invalidating the server-side session/cookie
      await api.post('/logout'); // Assuming a /logout endpoint via POST
      console.log('Server-side logout initiated.');
    } catch (error) {
      console.error('Logout API call failed, but clearing client state:', error);
    } finally {
      // Clear client-side state regardless of API logout success
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userMobileNo');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};