import { Role } from "./role";

export interface User {
    id: string;
    profile_image: string;
    name: string;
    email: string;
    username: string | null;
    role: Role | null;
    gender: string | null;
    phone: string | null;
    address: string | null;
    last_login: string | null;
}