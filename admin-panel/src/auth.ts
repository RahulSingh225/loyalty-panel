import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { userMaster } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { handleError } from "@/utils/errorHandler";

// Extend the default User type to include role
declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

// Extend the JWT type to include role
// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     role?: string;
//   }
// }

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Credentials received:", credentials);

          return {id: "1", name: "Admin", role: "admin"}; // Temporary return for testing
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Username and password are required");
          }

          const user = await db
            .select()
            .from(userMaster)
            .where(eq(userMaster.username, String(credentials.username)))
            .limit(1);
          console.log("User found:", user);

          if (user.length === 0) {
            throw new Error("User not found");
          }

          if (!user[0].password) {
            throw new Error("Password not found for user");
          }

          const isValid = await bcrypt.compare(
            String(credentials.password),
            String(user[0].password)
          );

          if (!isValid) {
            throw new Error("Invalid credentials");
          }

         

          return {
            id: user[0].userId.toString(),
            name: user[0].username,
            //role: user[0].roleId ? String(user[0].roleId) : undefined,
          };
        } catch (error) {
          const { message } = handleError(error, "Authorize");
          console.error("Authorize error:", message);
          throw new Error(message); // Pass error to NextAuth
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = String(token.id);
        session.user.role = typeof token.role === "string" ? token.role : undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});