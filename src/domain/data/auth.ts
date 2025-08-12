import { Token } from "@/domain/model/token";
import { User } from "@/domain/model/user";

export type LoginResponse = Token & {
    user: User;
}

export type RotateTokenResponse = Omit<Token, "refresh_token" | "refresh_expiration">;

export type UpdateUserParam = {
    name?: string;
    email?: string;
    username?: string;
    profile_image?: null;
    gender?: string;
    phone?: string;
    address?: string;
}

export interface IAuthData {
    login: (username: string, password: string) => Promise<LoginResponse | null>;
    loginWithGoogle: (accessToken: string) => Promise<LoginResponse | null>;
    rotateToken: (refreshToken: string) => Promise<RotateTokenResponse | null>;
    getUser(accessToken: string): Promise<User | null>;
    updateUser(user: UpdateUserParam): Promise<User | null>
    uploadProfileImage(image: File): Promise<User | null>
    updatePassword(newPassword: string, passwordConfirm: string): Promise<boolean>
}