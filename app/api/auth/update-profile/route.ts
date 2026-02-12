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
    const { email, name, fitnessLevel, goal, age, weight, height } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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

    // Update user profile
    if (name) user.name = name;
    if (fitnessLevel) user.fitnessLevel = fitnessLevel;
    if (goal) user.goal = goal;
    if (age) user.age = age;
    if (weight) user.weight = weight;
    if (height) user.height = height;

    await saveUsers(users);

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          fitnessLevel: user.fitnessLevel,
          goal: user.goal,
          age: user.age,
          weight: user.weight,
          height: user.height,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
