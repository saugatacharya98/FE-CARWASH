export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  registrationToken?: string;
}

export interface CarWashCode {
  code: string;
  carRegistration: string;
  userId: string;
  isUsed: boolean;
  createdAt: string;
}