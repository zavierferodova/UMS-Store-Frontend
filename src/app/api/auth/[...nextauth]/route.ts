import authData from "@/data/auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

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
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        const data = await authData.loginWithGoogle(account.access_token!)

        if (data) {
          token.user = {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            name: data.user.name,
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
  
        if (Date.now() > new Date(access_expiration).getTime()) {
          const newToken = await authData.rotateToken(token.refresh_token);
  
          if (newToken) {
            token.access_token = newToken.access_token;
            token.access_expiration = newToken.access_expiration;
          }
        }
        
        return token;
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
