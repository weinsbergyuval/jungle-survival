import { create } from 'zustand';
import { api } from '../lib/api';

// Name-only auth, persisted in localStorage so returning players skip the
// name prompt. No passwords — the server upserts on the name.
export const useAuth = create((set, get) => ({
  token: localStorage.getItem('js_token'),
  user: JSON.parse(localStorage.getItem('js_user') || 'null'),

  isLoggedIn: () => Boolean(get().token),

  async login(name) {
    const data = await api('/api/auth/login', { method: 'POST', body: { name } });
    localStorage.setItem('js_token', data.token);
    localStorage.setItem('js_user', JSON.stringify(data.user));
    set({ token: data.token, user: data.user });
    return data.user;
  },

  logout() {
    localStorage.removeItem('js_token');
    localStorage.removeItem('js_user');
    set({ token: null, user: null });
  },
}));
