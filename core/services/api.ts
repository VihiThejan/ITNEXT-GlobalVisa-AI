import { User, UserProfile, AssessmentResult } from '../types';

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
        console.log('Login response:', data);
        console.log('User role:', data.result.role);
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
    async update(_userId: string, profile: UserProfile): Promise<User> {
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
    async save(_userId: string, assessment: AssessmentResult): Promise<void> {
      const user = await api.auth.getCurrentSession();
      if (!user || !user.id) {
        console.error('No user session found, cannot save assessment');
        return;
      }

      console.log('Saving assessment to backend for user:', user.id);
      const res = await fetch(`${API_URL}/assessments/save`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId: user.id, assessment })
      });

      if (!res.ok) {
        console.error('Failed to save assessment');
      } else {
        console.log('Assessment saved successfully');
      }
    }
  },

  admin: {
    async getUsers(): Promise<User[]> {
      console.log('Fetching all users from admin API');
      const res = await fetch(`${API_URL}/admin/users`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!res.ok) throw new Error('Failed to fetch users');

      const data = await res.json();
      console.log(`Fetched ${data.users.length} users`);
      return data.users;
    },

    async searchUsers(query: string): Promise<User[]> {
      console.log('Searching users:', query);
      const res = await fetch(`${API_URL}/admin/users/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!res.ok) throw new Error('Failed to search users');

      const data = await res.json();
      return data.users;
    },

    async getUserActivity(userId: string): Promise<User> {
      console.log('Fetching user activity:', userId);
      const res = await fetch(`${API_URL}/admin/users/${userId}/activity`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!res.ok) throw new Error('Failed to fetch user activity');

      const data = await res.json();
      return data.user;
    },

    async getAnalytics() {
      console.log('Fetching analytics from admin API');
      const res = await fetch(`${API_URL}/admin/analytics`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!res.ok) throw new Error('Failed to fetch analytics');

      const data = await res.json();
      console.log('Analytics received:', data.analytics);
      return data.analytics;
    }
  }
};
