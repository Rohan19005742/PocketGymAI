import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, fitnessLevel, goal, age, weight, height } = body;

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(name && { name }),
        ...(fitnessLevel && { fitnessLevel }),
        ...(goal && { goal }),
        ...(age && { age: parseInt(age) }),
        ...(weight && { weight: parseFloat(weight) }),
        ...(height && { height: parseFloat(height) }),
      },
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          fitnessLevel: updatedUser.fitnessLevel,
          goal: updatedUser.goal,
          age: updatedUser.age,
          weight: updatedUser.weight,
          height: updatedUser.height,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
