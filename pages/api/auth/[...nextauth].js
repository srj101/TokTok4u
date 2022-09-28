import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import bcrypt from "bcrypt";
import { prisma } from "../../../prisma/prisma";
// import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
  site: process.env.NEXTAUTH_URL,
  providers: [
    /* EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
    }), */
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID_SECRET,
      clientSecret: process.env.TWITTER_SECRET_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req, res) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) throw new Error("No user found");

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) throw new Error("Password is not valid");

          return {
            email: user.email,
            id: user.id,
            name: user.name,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  secret: "yudjXHbqE5VH4LkwZ4srgsdL2EZrjp",
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },

  database: process.env.DATABASE_URL,
       pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },  
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);

      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.id = token.user.id;
      session.user.isAdmin = token.user.isAdmin;
      session.user.id = token.user.id;
      return session;
    },
  },
  debug: true,
};

export default (req, res) => NextAuth(req, res, options);
