// ✅ Profile state management (localStorage + event)
const PROFILE_KEY = 'grum_profile';

export const profileStore = {
  // Get profile
  get() {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  // Save profile
  save(profile) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      // ✅ Emit event so all components update
      window.dispatchEvent(new CustomEvent('profile-updated', { detail: profile }));
    } catch (err) {
      console.error('Profile save error:', err);
    }
  },

  // Remove profile
  remove() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PROFILE_KEY);
    window.dispatchEvent(new CustomEvent('profile-updated', { detail: null }));
  },

  // Subscribe to changes
  subscribe(callback) {
    if (typeof window === 'undefined') return () => {};
    const handler = (e) => callback(e.detail);
    window.addEventListener('profile-updated', handler);
    return () => window.removeEventListener('profile-updated', handler);
  },
};
