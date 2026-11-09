import Cookies from 'js-cookie';

const TOKEN_KEY = 'token';
const USER_KEY  = 'user';

export const auth = {
  setToken(token) {
    Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: 'lax' });
  },
  getToken() {
    return Cookies.get(TOKEN_KEY);
  },
  removeToken() {
    Cookies.remove(TOKEN_KEY);
  },
  setUser(user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },
  getUser() {
    if (typeof window === 'undefined') return null;
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch {
      return null;
    }
  },
  removeUser() {
    if (typeof window !== 'undefined') localStorage.removeItem(USER_KEY);
  },
  logout() {
    this.removeToken();
    this.removeUser();
  },
  isAuthenticated() {
    return !!this.getToken();
  },
};