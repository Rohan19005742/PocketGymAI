import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Simple in-memory user store (demo only - use database in production)
const users: any[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("password123", 10),
    avatar: "🏋️",
    fitnessLevel: "Intermediate",
    goal: "Build Muscle",
    completedWorkouts: 15,
    streakDays: 7,
  },
];

const handler = NextAuth({
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

        const user = users.find((u) => u.email === credentials.email);
        
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = bcrypt.compareSync(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar,
        };
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        const fullUser = users.find((u) => u.email === session.user?.email);
        if (fullUser) {
          session.user.avatar = fullUser.avatar;
          session.user.fitnessLevel = fullUser.fitnessLevel;
          session.user.goal = fullUser.goal;
          session.user.completedWorkouts = fullUser.completedWorkouts;
          session.user.streakDays = fullUser.streakDays;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secret-key-change-in-production",
});

// Export handler and add signup handler
export { handler as GET, handler as POST };

// Export users array for demo signup
export { users };
