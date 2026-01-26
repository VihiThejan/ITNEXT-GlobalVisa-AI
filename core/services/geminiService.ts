import { UserProfile, AssessmentResult } from "../types";
import { api } from "./api"; // Assuming we can use the base URL from here or just hardcode for now if api.ts doesn't expose url directly.
// Actually, let's just use the API helper if possible, or fetch directly.
// api.assessments.save exists, but we need 'generate'. 
// I'll implement 'generate' here using fetch to the backend.

const API_URL = import.meta.env.VITE_API_URL || 'https://itnext-global-visa-ai.vercel.app/api';

export const generateAssessment = async (profile: UserProfile, countryName: string): Promise<AssessmentResult> => {
  try {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    // Get current user ID if available to log activity
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const response = await fetch(`${API_URL}/assessments/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        profile,
        countryName,
        userId: user?.id
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Assessment generation failed');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Backend Assessment Error:", error);
    throw error;
  }
};
