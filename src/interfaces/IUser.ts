export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
  needVerification: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerify: boolean;
  avatar: string;
  streak: number;
  lives: number;
  xp: number;
  userLevel: number;
  level: string;
}
