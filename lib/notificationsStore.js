// lib/notificationsStore.js
// Tiny global store for unread count. No React context required.

let state = { unread: 0 };
const listeners = new Set();

export const notificationsStore = {
  get() {
    return state;
  },
  set(next) {
    state = { ...state, ...next };
    listeners.forEach((fn) => fn(state));
  },
  setUnread(n) {
    state = { ...state, unread: Math.max(0, Number(n) || 0) };
    listeners.forEach((fn) => fn(state));
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};