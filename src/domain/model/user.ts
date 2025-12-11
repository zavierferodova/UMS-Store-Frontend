export interface User {
  id: string;
  profile_image: string;
  name: string;
  email: string;
  username: string | null;
  role: UserRole | null;
  gender: string | null;
  phone: string | null;
  address: string | null;
  last_login: string | null;
}

export enum UserRole {
  ADMIN = 'admin',
  PROCUREMENT = 'procurement',
  CASHIER = 'cashier',
  CHECKER = 'checker',
}
