
import { User, UserProfile, AssessmentResult } from '../types';
import * as db from './storageService';

/**
 * GlobalVisa AI Simulated Backend API
 * This layer abstracts the underlying storage (localStorage) to behave like 
 * a real-world asynchronous database connection.
 */

const LATENCY = 400; // Simulate network delay

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated in-memory store for verification codes
const verificationCodes = new Map<string, string>();

export const api = {
  auth: {
    async login(email: string): Promise<User | null> {
      await delay(LATENCY);
      const user = db.getUserByEmail(email);
      if (user) {
        db.saveCurrentSession(user);
      }
      return user;
    },

    async register(userData: Partial<User>): Promise<User> {
      await delay(LATENCY);
      const newUser: User = {
        id: userData.id || `user-${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email || '',
        fullName: userData.fullName || 'Anonymous User',
        provider: userData.provider || 'email',
        avatar: userData.avatar,
        isVerified: userData.provider === 'google', // Google users are pre-verified
        assessmentHistory: [],
        ...userData
      };
      db.saveUserToDb(newUser);
      db.saveCurrentSession(newUser);
      return newUser;
    },

    async sendVerificationCode(email: string): Promise<string> {
      await delay(LATENCY * 1.5);
      // In a real app, this sends an email. Here we return the code for UI simulation.
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      verificationCodes.set(email.toLowerCase(), code);
      console.log(`[SIMULATED EMAIL] Verification code for ${email}: ${code}`);
      return code;
    },

    async verifyCode(email: string, code: string): Promise<boolean> {
      await delay(LATENCY);
      const storedCode = verificationCodes.get(email.toLowerCase());
      if (storedCode === code) {
        const user = db.getUserByEmail(email);
        if (user) {
          user.isVerified = true;
          db.saveUserToDb(user);
          db.saveCurrentSession(user);
        }
        verificationCodes.delete(email.toLowerCase());
        return true;
      }
      return false;
    },

    async logout() {
      await delay(LATENCY / 2);
      db.saveCurrentSession(null);
    },

    async getCurrentSession(): Promise<User | null> {
      return db.getCurrentSession();
    }
  },

  profile: {
    async update(email: string, profile: UserProfile): Promise<User> {
      await delay(LATENCY);
      const user = db.getUserByEmail(email);
      if (!user) throw new Error("User not found in database");
      
      const updatedUser = { ...user, profile };
      db.saveUserToDb(updatedUser);
      return updatedUser;
    }
  },

  assessments: {
    async save(email: string, assessment: AssessmentResult): Promise<User> {
      await delay(LATENCY);
      const user = db.getUserByEmail(email);
      if (!user) throw new Error("User not found in database");

      const updatedUser = {
        ...user,
        assessmentHistory: [assessment, ...(user.assessmentHistory || [])]
      };
      db.saveUserToDb(updatedUser);
      return updatedUser;
    },

    async getAll(email: string): Promise<AssessmentResult[]> {
      await delay(LATENCY);
      const user = db.getUserByEmail(email);
      return user?.assessmentHistory || [];
    }
  }
};
