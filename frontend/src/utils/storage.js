const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const THEME_KEY = 'theme';

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  getTheme: () => localStorage.getItem(THEME_KEY) || 'dark',
  setTheme: (theme) => localStorage.setItem(THEME_KEY, theme),

  clearAuth: () => {
    storage.removeToken();
    storage.removeUser();
  },
};
