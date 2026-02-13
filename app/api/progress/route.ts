import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// GET /api/progress - Get user's progress data
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workoutProgress: {
          orderBy: { date: "desc" },
          take: 50,
        },
        weightProgress: {
          orderBy: { date: "desc" },
          take: 100,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        completedWorkouts: user.completedWorkouts,
        streakDays: user.streakDays,
      },
      workoutProgress: user.workoutProgress,
      weightProgress: user.weightProgress,
    });
  } catch (error) {
    console.error("Progress fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

// POST /api/progress - Add new workout or weight entry
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { type, workoutName, duration, calories, weight, notes } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (type === "workout") {
      if (!workoutName || !duration) {
        return NextResponse.json(
          { error: "Missing required fields (workoutName, duration)" },
          { status: 400 }
        );
      }

      const workoutEntry = await prisma.workoutProgress.create({
        data: {
          userId: user.id,
          workoutName,
          duration: parseInt(duration),
          calories: calories ? parseInt(calories) : null,
          notes: notes || null,
        },
      });

      // Update completed workouts count
      await prisma.user.update({
        where: { id: user.id },
        data: { completedWorkouts: { increment: 1 } },
      });

      return NextResponse.json(workoutEntry, { status: 201 });
    } else if (type === "weight") {
      if (!weight) {
        return NextResponse.json(
          { error: "Missing required field (weight)" },
          { status: 400 }
        );
      }

      const weightEntry = await prisma.weightProgress.create({
        data: {
          userId: user.id,
          weight: parseFloat(weight),
          notes: notes || null,
        },
      });

      return NextResponse.json(weightEntry, { status: 201 });
    } else {
      return NextResponse.json(
        { error: "Invalid type (must be 'workout' or 'weight')" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Progress add error:", error);
    return NextResponse.json(
      { error: "Failed to add progress" },
      { status: 500 }
    );
  }
}
