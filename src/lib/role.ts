import { UserRole } from '@/domain/model/user';
import { User } from '@/domain/model/user';
import { User as NextUser } from 'next-auth';

export const role = {
  admin: 'admin' as UserRole,
  procurement: 'procurement' as UserRole,
  cashier: 'cashier' as UserRole,
  checker: 'checker' as UserRole,
};

export function roleLabel(role: string) {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'procurement':
      return 'Pengadaan';
    case 'cashier':
      return 'Kasir';
    case 'checker':
      return 'Checker';
    default:
      return 'Unknown';
  }
}

export function isAdmin(user: User | NextUser | null | undefined) {
  return user?.role === 'admin';
}

export function isCashier(user: User | NextUser | null | undefined) {
  return user?.role === 'cashier';
}

export function isProcurement(user: User | NextUser | null | undefined) {
  return user?.role === 'procurement';
}

export function isChecker(user: User | NextUser | null | undefined) {
  return user?.role === 'checker';
}
