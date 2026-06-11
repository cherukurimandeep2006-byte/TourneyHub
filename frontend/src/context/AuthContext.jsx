// ============================================
// context/AuthContext.jsx - Global Auth State
// ============================================

import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

// AuthProvider wraps the entire app and provides auth state globally
export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage so login persists on page refresh
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('tourneyUser');
    return stored ? JSON.parse(stored) : null;
  });

  // Login: save user data and token to state and localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('tourneyUser', JSON.stringify(userData));
  };

  // Logout: clear state and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('tourneyUser');
  };

  // Helper booleans
  const isAdmin = user?.role === 'admin';
  const isCaptain = user?.role === 'captain';
  const isLoggedIn = !!user;
  const token = user?.token || null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isCaptain, isLoggedIn, token }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook: any component can call useAuth() to get auth state
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};

export default AuthContext;
