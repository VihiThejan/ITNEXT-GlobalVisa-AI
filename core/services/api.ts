import { User, User Profile, AssessmentResult } from '../types';

const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  auth: {
    async login(email: string, password?: string): Promise<User | null> {
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (!res.ok) throw new Error('Login failed');
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.result));
        return data.result;
      } catch (e) {
        console.error(e);
        return null;
      }
    },

    async register(userData: Partial<User>, password?: string): Promise<User> {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, password })
      });
      if (!res.ok) throw new Error('Registration failed');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.result));
      return data.result;
    },

    async getCurrentSession(): Promise<User | null> {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    },

    async logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  profile: {
    async update(email: string, profile: UserProfile): Promise<User> {
      const user = await api.auth.getCurrentSession();
      if (!user || !user.id) {
        throw new Error("No session or user ID");
      }

      console.log('Updating profile for user:', user.id, profile);
      const res = await fetch(`${API_URL}/profile/update`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ userId: user.id, profile })
      });

      if (!res.ok) throw new Error('Profile update failed');

      const data = await res.json();
      const updated = data.result;

      // Update localStorage with new data
      localStorage.setItem('user', JSON.stringify(updated));
      console.log('Profile updated successfully');
      return updated;
    }
  },

  assessments: {
    async save(email: string, assessment: AssessmentResult): Promise<void> {
      // Backend endpoint to save assessment to DB
      await fetch(`${API_URL}/assessments/save`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, assessment })
      });
    }
  }
};
