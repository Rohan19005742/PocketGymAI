import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          const response = await fetch(
            `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Login failed");
          }

          const user = await response.json();
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatar,
            fitnessLevel: user.fitnessLevel,
            goal: user.goal,
            onboardingComplete: user.onboardingComplete,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "Login failed"
          );
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.fitnessLevel = user.fitnessLevel;
        token.goal = user.goal;
        token.onboardingComplete = user.onboardingComplete;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.fitnessLevel = token.fitnessLevel as string;
        session.user.goal = token.goal as string;
        session.user.onboardingComplete = token.onboardingComplete as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secret-key-change-in-production",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
