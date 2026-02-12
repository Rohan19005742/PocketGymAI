import { hash } from "bcryptjs";
import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const DB_PATH = path.join(process.cwd(), "data", "users.json");

async function ensureDbExists() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    try {
      await fs.access(DB_PATH);
    } catch {
      await fs.writeFile(DB_PATH, JSON.stringify([]));
    }
  } catch (error) {
    console.error("DB error:", error);
  }
}

async function getUsers() {
  await ensureDbExists();
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveUsers(users: any[]) {
  await ensureDbExists();
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const users = await getUsers();

    // Check if user exists
    if (users.find((u: any) => u.email === email)) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      avatar: "👤",
      fitnessLevel: "Beginner",
      goal: "Build Muscle",
      completedWorkouts: 0,
      streakDays: 0,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await saveUsers(users);

    return NextResponse.json(
      { message: "User created successfully", user: { id: newUser.id, email, name } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Signup failed" },
      { status: 500 }
    );
  }
}
