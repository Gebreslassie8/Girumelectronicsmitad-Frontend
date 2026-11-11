'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { profileStore } from '@/lib/profileStore';
import { useAuth } from '@/components/providers/AuthProvider';

const ProfileContext = createContext(null);

export default function ProfileProvider({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  // ✅ Load profile on mount
  useEffect(() => {
    const stored = profileStore.get();
    if (stored) {
      setProfile(stored);
    } else if (user) {
      // Default profile from user
      const defaultProfile = {
        fullName: user.fullName || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        avatar: null,
      };
      setProfile(defaultProfile);
      profileStore.save(defaultProfile);
    }
  }, [user]);

  // ✅ Subscribe to profile changes
  useEffect(() => {
    const unsubscribe = profileStore.subscribe((newProfile) => {
      setProfile(newProfile);
    });
    return unsubscribe;
  }, []);

  // ✅ Update profile
  const updateProfile = (newProfile) => {
    setProfile(newProfile);
    profileStore.save(newProfile);
  };

  // ✅ Clear profile (on logout)
  const clearProfile = () => {
    setProfile(null);
    profileStore.remove();
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
};
