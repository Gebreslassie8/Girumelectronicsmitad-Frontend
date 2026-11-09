'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import api from '@/lib/api';
import { auth } from '@/lib/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const tLogin = useTranslations('auth.login');
  const tRegister = useTranslations('auth.register');

  useEffect(() => {
    const cached = auth.getUser();
    if (cached) setUser(cached);
    setLoading(false);
  }, []);

  const login = async (phone, password) => {
    try {
      const { data } = await api.post('/auth/login', { phone, password });
      auth.setToken(data.token);
      auth.setUser(data.user);
      setUser(data.user);
      toast.success(tLogin('success'));
      router.push('/dashboard');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || tLogin('error'));
      throw err;
    }
  };

  const register = async (payload) => {
    try {
      const { data } = await api.post('/auth/register', payload);
      auth.setToken(data.token);
      auth.setUser(data.user);
      setUser(data.user);
      toast.success(tRegister('success'));
      router.push('/dashboard');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || tRegister('error'));
      throw err;
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
