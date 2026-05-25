export interface LoginRequest{
  username: string;
  password: string;
}

export interface LoginResponse{
  token: string;
  username: string;
  role: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE  = 'EMPLOYEE'
}

export interface AuthUser {
  username: string;
  role: UserRole;
}
