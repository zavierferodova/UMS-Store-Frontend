import { fetchJSON } from "@/lib/fetch";
import { IAuthData, LoginResponse, RotateTokenResponse, UpdateUserParams } from "@/domain/data/auth";
import { APP_URL } from "@/config/env";
import { User } from "@/domain/model/user";
import { getSession } from "next-auth/react"
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

class AuthData implements IAuthData {
  constructor(private readonly serverside: boolean) {
    // pass
  }
  
  private getAuthSession(): Promise<Session | null> {
    if (this.serverside) {
      return getServerSession(authOptions);
    } else {
      return getSession();
    }
  }
  
  async login(username: string, password: string): Promise<LoginResponse | null> {
    try {
      const response = await fetchJSON(`${APP_URL}/apis/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      if (response) {
        const { data } = response;
    
        return {
          access_token: data.access,
          refresh_token: data.refresh,
          access_expiration: data.access_expiration,
          refresh_expiration: data.refresh_expiration,
          user: data.user,
        }
      }
    
      return null;
    } catch {
      return null;
    }
  }
  
  async rotateToken(refreshToken: string): Promise<RotateTokenResponse | null> {
    try {
      const response = await fetchJSON(`${APP_URL}/apis/auth/token/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });
    
      if (response) {
        const { data } = response;
    
        return {
          access_token: data.access,
          access_expiration: data.access_expiration,
        };
      }
    
      return null; 
    } catch {
      return null;
    }
  }
  
  async loginWithGoogle(accessToken: string): Promise<LoginResponse | null> {
    try {
      const response = await fetchJSON(`${APP_URL}/apis/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: accessToken,
        }),
      });
  
  
      if (response) {
        const { data } = response;
  
        return {
          access_token: data.access,
          refresh_token: data.refresh,
          access_expiration: data.access_expiration,
          refresh_expiration: data.refresh_expiration,
          user: data.user,
        }
      }
  
      return null;
    } catch {
      return null;
    }
  }
  
  async getUser(accessToken: string): Promise<User | null> {
    try {
      const response = await fetchJSON(`${APP_URL}/apis/auth/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response) {
        const { data } = response;
        return data;
      }
  
      return null;
    } catch {
      return null;
    }
  }
  
  async updateUser(
    user: UpdateUserParams,
  ): Promise<User | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/auth/user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(user),
      });
  
      if (response) {
        const { data } = response;
        return data;
      }
  
      return null;
    } catch {
      return null;
    }
  }
  
  async updatePassword(
    newPassword: string,
    passwordConfirm: string
  ): Promise<boolean> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/auth/password/change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          new_password1: newPassword,
          new_password2: passwordConfirm
        }),
      });
  
      if (response) {
        return true;
      }
  
      return false;
    } catch {
      return false;
    }
  }
  
  async uploadProfileImage(image: File): Promise<User | null> {
    try {
      const formData = new FormData();
      formData.append("profile_image", image);
      const session = await getServerSession();
      const response = await fetchJSON(`${APP_URL}/apis/auth/user/profile-image`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: formData,
      });
  
      if (response) {
        const { data } = response;
        return data;
      }
  
      return null;
    } catch {
      return null;
    }
  }
}

export const authData: IAuthData = new AuthData(false);
export const authDataServer: IAuthData = new AuthData(true);
export default authData;
