import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createAICoachAgent, initializeAICoach } from "@/lib/ai-coach-agent";
import { authOptions } from "../../auth/[...nextauth]/route";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { BufferMemory } from "langchain/memory";

// Store conversation history per user (in production, use a database)
const conversationHistories = new Map<
  string,
  { messages: Array<{ role: "user" | "ai"; content: string }>; timestamp: Date }
>();

// Initialize memory for the agent
async function getOrCreateMemory(userId: string) {
  if (!conversationHistories.has(userId)) {
    conversationHistories.set(userId, {
      messages: [],
      timestamp: new Date(),
    });
  }

  const history = conversationHistories.get(userId)!;

  // Create memory for the agent
  const memory = new BufferMemory({
    returnMessages: true,
  });

  return { memory, history };
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.email;
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    // Initialize AI Coach if not already done
    try {
      await initializeAICoach();
    } catch (error) {
      // Already initialized or initialization error
      console.log("AI Coach initialization check:", error);
    }

    // Get or create conversation memory
    const { memory, history } = await getOrCreateMemory(userId);

    // Add user message to history
    history.messages.push({
      role: "user",
      content: message,
    });

    // Create agent with conversation memory
    const agent = await createAICoachAgent();

    // Format chat history for the agent
    let chatHistoryText = "";
    if (history.messages.length > 1) {
      chatHistoryText = history.messages
        .slice(-10) // Keep last 10 messages for context
        .map((msg) => `${msg.role === "user" ? "User" : "Coach"}: ${msg.content}`)
        .join("\n");
    }

    // Invoke agent with context
    const response = await agent.invoke(
      {
        input: message,
        chat_history: chatHistoryText,
      },
      {
        runName: "AICoachChat",
      }
    );

    const aiResponse =
      response.output || "I'm thinking about the best way to help you...";

    // Add AI response to history
    history.messages.push({
      role: "ai",
      content: aiResponse,
    });

    // Update timestamp
    history.timestamp = new Date();

    // Keep history manageable (last 50 exchanges)
    if (history.messages.length > 100) {
      history.messages = history.messages.slice(-100);
    }

    // Log conversation for debugging
    console.log(`[${userId}] User: ${message.substring(0, 100)}...`);
    console.log(
      `[${userId}] Coach: ${aiResponse.substring(0, 100)}...`
    );

    return NextResponse.json({
      success: true,
      message: aiResponse,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("AI Coach API Error:", error);

    // Check if it's an OpenAI API key error
    if (
      error instanceof Error &&
      error.message.includes("API key")
    ) {
      return NextResponse.json(
        {
          error: "AI Coach not configured. Please ensure OPENAI_API_KEY is set.",
          message:
            "I'm currently unavailable. Please try again later or contact support.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to get AI Coach response",
        message:
          "I encountered an issue processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Optional: Clean up old conversations (could be run periodically)
export function cleanupOldConversations(maxAgeMinutes: number = 1440) {
  const now = new Date();
  const maxAge = maxAgeMinutes * 60 * 1000;

  for (const [userId, data] of conversationHistories.entries()) {
    if (now.getTime() - data.timestamp.getTime() > maxAge) {
      conversationHistories.delete(userId);
      console.log(`Cleaned up conversation history for ${userId}`);
    }
  }
}
