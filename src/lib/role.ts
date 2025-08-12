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