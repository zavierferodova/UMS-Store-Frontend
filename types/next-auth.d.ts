// next-auth.d.ts
import NextAuth from "next-auth";
import { User as BaseUser } from "@/domain/model/user";

declare module "next-auth" {
  interface Session {
    user: BaseUser;
    access_token: string;
  }

  interface User extends BaseUser {
    id: number;
    access_token: string;
    refresh_token: string;
    access_expiration: string;
    refresh_expiration: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: BaseUser;
    access_token: string;
    refresh_token: string;
    access_expiration: string;
    refresh_expiration: string;
    accessToken?: string;
  }
}
