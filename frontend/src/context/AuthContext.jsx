import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const persistAuth = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authService.getMe();
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token, clearAuth]);

  const signup = async (formData) => {
    const { data } = await authService.signup(formData);
    persistAuth(data.data.user, data.data.token);
    return data;
  };

  const login = async (formData) => {
    const { data } = await authService.login(formData);
    persistAuth(data.data.user, data.data.token);
    return data;
  };

  const logout = () => clearAuth();

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signup, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
