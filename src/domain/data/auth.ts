import { Token } from "@/domain/model/token";
import { User } from "@/domain/model/user";

export type LoginResponse = Token & {
    user: User;
}

export type RotateTokenResponse = Omit<Token, "refresh_token" | "refresh_expiration">;

export interface IAuthData {
    login: (username: string, password: string) => Promise<LoginResponse | null>;
    loginWithGoogle: (accessToken: string) => Promise<LoginResponse | null>;
    rotateToken: (refreshToken: string) => Promise<RotateTokenResponse | null>;
}