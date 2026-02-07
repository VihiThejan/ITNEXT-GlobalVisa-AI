import { User, UserProfile, AssessmentResult } from '../types';

// Backend API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL environment variable is not set');
}

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

    async googleLogin(credential: string): Promise<User | null> {
      try {
        const res = await fetch(`${API_URL}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential })
        });
        if (!res.ok) throw new Error('Google login failed');
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.result));
        return data.result;
      } catch (e) {
        console.error(e);
        return null;
      }
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
    async save(_userId: string, assessment: AssessmentResult): Promise<User | null> {
      const user = await api.auth.getCurrentSession();
      if (!user || !user.id) {
        console.error('No user session found, cannot save assessment');
        return null;
      }

      console.log('Saving assessment to backend for user:', user.id);
      const res = await fetch(`${API_URL}/assessments/save`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId: user.id, assessment })
      });

      if (!res.ok) {
        console.error('Failed to save assessment');
        return null;
      } else {
        const data = await res.json();
        console.log('Assessment saved successfully');
        // Update local storage with fresh user data
        if (data.result) {
          localStorage.setItem('user', JSON.stringify(data.result));
          return data.result;
        }
        return null;
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
    },

    // Country Management
    async getAllCountries() {
      console.log('Fetching all countries from admin API');
      const res = await fetch(`${API_URL}/admin/countries`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!res.ok) throw new Error('Failed to fetch countries');

      const data = await res.json();
      console.log(`Fetched ${data.countries.length} countries`);
      return data.countries;
    },

    async getCountryById(id: string) {
      console.log('Fetching country:', id);
      const res = await fetch(`${API_URL}/admin/countries/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!res.ok) throw new Error('Failed to fetch country');

      const data = await res.json();
      return data.country;
    },

    async createCountry(countryData: any) {
      console.log('Creating new country:', countryData.name);
      const res = await fetch(`${API_URL}/admin/countries`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(countryData)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create country');
      }

      const data = await res.json();
      console.log('Country created successfully');
      return data.country;
    },

    async updateCountry(id: string, countryData: any) {
      console.log('Updating country:', id);
      const res = await fetch(`${API_URL}/admin/countries/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(countryData)
      });

      if (!res.ok) throw new Error('Failed to update country');

      const data = await res.json();
      console.log('Country updated successfully');
      return data.country;
    },

    async deleteCountry(id: string) {
      console.log('Deleting country:', id);
      const res = await fetch(`${API_URL}/admin/countries/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!res.ok) throw new Error('Failed to delete country');

      const data = await res.json();
      console.log('Country deleted successfully');
      return data;
    },

    async toggleCountryStatus(id: string) {
      console.log('Toggling country status:', id);
      const res = await fetch(`${API_URL}/admin/countries/${id}/toggle`, {
        method: 'PATCH',
        headers: getHeaders()
      });

      if (!res.ok) throw new Error('Failed to toggle country status');

      const data = await res.json();
      console.log('Country status toggled successfully');
      return data.country;
    },

    async generateCountryData(countryName: string) {
      console.log('Generating country data for:', countryName);
      const res = await fetch(`${API_URL}/admin/countries/generate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ countryName })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to generate country data');
      }

      const data = await res.json();
      console.log('Country data generated successfully');
      return data.countryData;
    }
  }
};
