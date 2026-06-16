import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ai-classroom-user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ai-classroom-token') || '');
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const data = await authService.me();
        setUser(data.user);
        // ensure token stored separately
        if (!token) setToken(localStorage.getItem('ai-classroom-token') || '');
      } catch (error) {
        setUser(null);
        setToken('');
        localStorage.removeItem('ai-classroom-user');
        localStorage.removeItem('ai-classroom-token');
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, [token]);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('ai-classroom-user', JSON.stringify(user));
      localStorage.setItem('ai-classroom-token', token);
    }
  }, [user, token]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('ai-classroom-user');
    localStorage.removeItem('ai-classroom-token');
  };

  return (
    <AuthContext.Provider value={{ user, token, authLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
