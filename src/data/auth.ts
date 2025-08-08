import { fetchJSON } from "@/lib/fetch";
import { apiBaseURL } from "@/config/api";
import { IAuthData, LoginResponse, RotateTokenResponse } from "@/domain/data/auth";

async function login(username: string, password: string): Promise<LoginResponse | null> {
  try {
    const response = await fetchJSON(`${apiBaseURL}/apis/auth/login`, {
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
  } catch (e) {
    return null;
  }
}

async function rotateToken(refreshToken: string): Promise<RotateTokenResponse | null> {
  try {
    const response = await fetchJSON(`${apiBaseURL}/apis/auth/token/refresh`, {
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
  } catch (e) {
    return null;
  }
}

async function loginWithGoogle(accessToken: string): Promise<LoginResponse | null> {
  try {
    const response = await fetchJSON(`${apiBaseURL}/apis/auth/google`, {
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
  } catch (e) {
    return null;
  }
}

const authData: IAuthData = {
  login,
  loginWithGoogle,
  rotateToken
}

export default authData;
