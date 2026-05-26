import { supabase } from './supabase';

const BASE = import.meta.env.VITE_API_BASE_URL || '';

export const apiService = {
  async getToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || '';
  },

  async get(path: string) {
    const token = await this.getToken();
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
  },

  async post(path: string, body: unknown) {
    const token = await this.getToken();
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json();
  },

  async delete(path: string) {
    const token = await this.getToken();
    const res = await fetch(`${BASE}${path}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
    return res.status === 204 ? null : res.json();
  }
};
