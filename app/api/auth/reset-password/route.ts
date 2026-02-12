import { hash } from "bcryptjs";
import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

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
    const { token, email, password } = body;

    if (!token || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const users = await getUsers();
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Validate reset token
    if (user.resetToken !== token) {
      return NextResponse.json(
        { error: "Invalid reset token" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (!user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 }
      );
    }

    // Hash new password and update user
    const hashedPassword = await hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await saveUsers(users);

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
