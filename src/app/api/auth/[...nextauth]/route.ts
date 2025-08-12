import authData from "@/data/auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET } from "@/config/env";
import { publicRoutes } from "@/routes/route";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        const response = await authData.login(credentials.username, credentials.password);
        if (!response) return null;

        return {
          id: response.user.id,
          profile_image: response.user.profile_image,
          name: response.user.name,
          email: response.user.email,
          username: response.user.username,
          role: response.user.role,
          gender: response.user.gender,
          phone: response.user.phone,
          address: response.user.address,
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          access_expiration: response.access_expiration,
          refresh_expiration: response.refresh_expiration,
        };
      }
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: publicRoutes.login,
  },
  callbacks: {
    async jwt({ token, user, account, session, trigger }) {
      if (account?.provider === "google") {
        const data = await authData.loginWithGoogle(account.access_token!)

        if (data) {
          token.user = {
            id: data.user.id,
            profile_image: data.user.profile_image,
            name: data.user.name,
            username: data.user.username,
            email: data.user.email,
            role: data.user.role,
            gender: data.user.gender,
            phone: data.user.phone,
            address: data.user.address,
          };
          token.access_token = data.access_token;
          token.refresh_token = data.refresh_token;
          token.access_expiration = data.access_expiration;
          token.refresh_expiration = data.refresh_expiration;
        }
      } else if (user) {
        const { access_token, refresh_token, access_expiration, refresh_expiration, ...userData } = user;
        token.user = {
          id: Number(userData.id),
          profile_image: userData.profile_image,
          name: userData.name!,
          email: userData.email!,
          username: userData.username,
          role: userData.role,
          gender: userData.gender,
          phone: userData.phone,
          address: userData.address,
        };

        token.access_token = access_token;
        token.refresh_token = refresh_token;
        token.access_expiration = access_expiration;
        token.refresh_expiration = refresh_expiration;
        
        return token;
      } else if (token) {
        const { refresh_token, access_expiration } = token;

        if (Date.now() > new Date(access_expiration).getTime()) {
          const newToken = await authData.rotateToken(refresh_token);
  
          if (newToken) {
            token.access_token = newToken.access_token;
            token.access_expiration = newToken.access_expiration;
          }
        }

        const user = await authData.getUser(token.access_token);
        if (user) {
          token.user = {
            id: Number(user.id),
            profile_image: user.profile_image,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            gender: user.gender,
            phone: user.phone,
            address: user.address,
          }
        }
      }

      if (trigger === "update") {
        token.user = session.user
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.access_token = token.access_token;
      return session;
    },
  }
});

export { handler as GET, handler as POST };
