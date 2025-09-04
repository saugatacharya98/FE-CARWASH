import { User, CarWashCode } from '../types';

const USERS_KEY = 'carwash_users';
const CODES_KEY = 'carwash_codes';
const CURRENT_USER_KEY = 'carwash_current_user';

export const storageUtils = {
  // User management
  saveUser: (user: User): void => {
    const users = storageUtils.getUsers();
    const existingIndex = users.findIndex(u => u.email === user.email);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getUsers: (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  getUserByEmail: (email: string): User | null => {
    const users = storageUtils.getUsers();
    return users.find(u => u.email === email) || null;
  },

  // Current user session
  setCurrentUser: (user: User): void => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  clearCurrentUser: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Car wash codes
  saveCarWashCode: (code: CarWashCode): void => {
    const codes = storageUtils.getCarWashCodes();
    codes.push(code);
    localStorage.setItem(CODES_KEY, JSON.stringify(codes));
  },

  getCarWashCodes: (): CarWashCode[] => {
    const codes = localStorage.getItem(CODES_KEY);
    return codes ? JSON.parse(codes) : [];
  },

  getCodeByUserAndCar: (userId: string, carRegistration: string): CarWashCode | null => {
    const codes = storageUtils.getCarWashCodes();
    return codes.find(c => c.userId === userId && c.carRegistration === carRegistration) || null;
  },

  markCodeAsUsed: (code: string): void => {
    const codes = storageUtils.getCarWashCodes();
    const codeIndex = codes.findIndex(c => c.code === code);
    
    if (codeIndex >= 0) {
      codes[codeIndex].isUsed = true;
      localStorage.setItem(CODES_KEY, JSON.stringify(codes));
    }
  }
};