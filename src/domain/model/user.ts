export interface User {
    id: number;
    profile_image: string;
    name: string;
    email: string;
    username: string | null;
    role: "admin" | "procurement" | "cashier" | null;
    gender: string | null;
    phone: string | null;
    address: string | null;
    last_login: string | null;
}