'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { auth } from '@/lib/auth';
import { mockLogin, mockRegister } from '@/lib/mockAuth';
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
      const { token, user: userData } = await mockLogin(phone, password);
      auth.setToken(token);
      auth.setUser(userData);
      setUser(userData);
      toast.success(tLogin('success'));
      router.push('/dashboard');
      return { token, user: userData };
    } catch (err) {
      toast.error(err.message || tLogin('error'));
      throw err;
    }
  };

  const register = async (payload) => {
    try {
      // ✅ ሁልጊዜ customer — admin/seller በ admin ብቻ ይፈጠራሉ
      const safePayload = { ...payload, role: 'customer' };
      const { token, user: userData } = await mockRegister(safePayload);
      auth.setToken(token);
      auth.setUser(userData);
      setUser(userData);
      toast.success(tRegister('success'));
      router.push('/dashboard');
      return { token, user: userData };
    } catch (err) {
      toast.error(err.message || tRegister('error'));
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
