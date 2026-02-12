import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "users.json");

async function getUsers() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveUsers(users: any[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const users = await getUsers();
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json(
        { message: "If this email exists, you'll receive a reset link shortly" },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;

    await saveUsers(users);

    // In production, you'd send an email here with the reset link
    // For now, we'll just return the token for testing
    // EMAIL WOULD CONTAIN: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}&email=${email}

    return NextResponse.json(
      {
        message: "Password reset link sent to email",
        // For testing only - remove in production
        testLink: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}&email=${email}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
