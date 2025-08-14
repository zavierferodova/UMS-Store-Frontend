import { User } from "@/domain/model/user"
import { User as NextUser } from "next-auth"

export function roleLabel(role: string) {
  switch (role) {
    case "admin":
      return "Administrator"
    case "procurement":
      return "Pengadaan"
    case "cashier":
      return "Kasir"
    default:
      return "Unknown"
  }
}

export function isAdmin(user: User | NextUser | null | undefined) {
  return user?.role === "admin"
}

export function isCashier(user: User | NextUser | null | undefined) {
  return user?.role === "cashier"
}
  
export function isProcurement(user: User | NextUser | null | undefined) {
  return user?.role === "procurement"
}
