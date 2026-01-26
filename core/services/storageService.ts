
import { User } from '../types';

const USERS_DB_KEY = 'globalvisa_users_db';
const SESSION_KEY = 'globalvisa_current_session';

/**
 * Gets the simulated database of all users
 */
const getUsersDb = (): User[] => {
  const data = localStorage.getItem(USERS_DB_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as User[];
  } catch (e) {
    console.error("Failed to parse users database", e);
    return [];
  }
};

/**
 * Saves or updates a user in the persistent database
 */
export const saveUserToDb = (user: User): void => {
  const db = getUsersDb();
  const index = db.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  
  if (index !== -1) {
    db[index] = user;
  } else {
    db.push(user);
  }
  
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
  // Also update active session
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

/**
 * Retrieves a user from the database by email
 */
export const getUserByEmail = (email: string): User | null => {
  const db = getUsersDb();
  return db.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

/**
 * Persists the currently logged-in user session
 */
export const saveCurrentSession = (user: User | null): void => {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    // Always sync session user back to DB to ensure persistence
    const db = getUsersDb();
    const index = db.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (index !== -1) {
      db[index] = user;
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
    }
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

/**
 * Retrieves the active session user from storage
 */
export const getCurrentSession = (): User | null => {
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as User;
  } catch (e) {
    return null;
  }
};
