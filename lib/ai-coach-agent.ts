import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";
import { getFitnessRetriever, initializeEmbeddings } from "./rag-agent";
import { RunnablePassthrough } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";

// Tool Definitions
const retrieveResearchTool = tool(
  async (input: { query: string }) => {
    const retriever = await getFitnessRetriever();
    const docs = await retriever.invoke(input.query);
    const formattedDocs = docs
      .map(
        (doc) =>
          `[${doc.metadata.category}] ${doc.metadata.title || "General Info"}\n${doc.pageContent.substring(0, 500)}...`
      )
      .join("\n\n");

    return formattedDocs;
  },
  {
    name: "retrieve_fitness_research",
    description:
      "Retrieves relevant fitness research papers, training principles, and guidelines based on a query. Use this to answer questions about training, nutrition, recovery, and fitness science.",
    schema: z.object({
      query: z
        .string()
        .describe("The fitness question or topic to search for research on"),
    }),
  }
);

const generateWorkoutPlanTool = tool(
  async (input: {
    goal: string;
    level: string;
    daysPerWeek: number;
    equipment: string;
  }) => {
    const retriever = await getFitnessRetriever();

    // Search for relevant training methodology
    const msTechnology = await retriever.invoke(
      `${input.level} ${input.goal} training program ${input.daysPerWeek} days`
    );

    const baseContext = msTechnology
      .map((doc) => doc.pageContent)
      .join("\n");

    return `
Based on research principles for ${input.level} level training with goal: ${input.goal}

${baseContext}

This plan follows evidence-based training principles from the knowledge base.
    `.trim();
  },
  {
    name: "generate_workout_plan",
    description:
      "Generates a customized workout plan based on user goals, experience level, and availability",
    schema: z.object({
      goal: z
        .string()
        .describe('Training goal (e.g., "muscle gain", "fat loss", "strength")'),
      level: z
        .string()
        .describe('Experience level (e.g., "beginner", "intermediate", "advanced")'),
      daysPerWeek: z
        .number()
        .describe("Number of training days per week"),
      equipment: z
        .string()
        .describe('Available equipment (e.g., "gym", "dumbbell", "bodyweight")'),
    }),
  }
);

const nutritionAdviceTool = tool(
  async (input: {
    goal: string;
    weight: number;
    dietaryRestrictions?: string;
  }) => {
    const retriever = await getFitnessRetriever();

    // Search for relevant nutrition research
    const docs = await retriever.invoke(
      `protein intake ${input.goal} nutrition macros${
        input.dietaryRestrictions ? ` ${input.dietaryRestrictions}` : ""
      }`
    );

    const nutritionInfo = docs
      .map(
        (doc) =>
          `[${doc.metadata.category}] ${doc.pageContent.substring(0, 400)}`
      )
      .join("\n");

    const proteinGrams = Math.round(input.weight * 1.8);
    const caloricsContext = `
Based on ${input.weight}kg bodyweight:
- Recommended daily protein: ${proteinGrams}g (1.6-2.2g per kg)
- Track macros and adjust based on progress
${input.dietaryRestrictions ? `- Considering ${input.dietaryRestrictions} dietary preferences` : ""}

Research insights:
${nutritionInfo}
    `.trim();

    return caloricsContext;
  },
  {
    name: "get_nutrition_advice",
    description:
      "Provides personalized nutrition advice based on goals, bodyweight, and dietary preferences",
    schema: z.object({
      goal: z
        .string()
        .describe('Training goal (e.g., "muscle gain", "fat loss")'),
      weight: z.number().describe("Bodyweight in kilograms"),
      dietaryRestrictions: z
        .string()
        .optional()
        .describe("Dietary restrictions (e.g., vegan, keto)"),
    }),
  }
);

const injuryPreventionTool = tool(
  async (input: { exercise: string; injuryConcern: string }) => {
    const retriever = await getFitnessRetriever();

    // Search for injury prevention specific to the exercise
    const docs = await retriever.invoke(
      `${input.exercise} injury prevention form technique ${input.injuryConcern}`
    );

    const preventionAdvice = docs
      .map((doc) => doc.pageContent)
      .join("\n\n");

    return `
Injury Prevention & Form Tips for ${input.exercise}:

${preventionAdvice}

Remember: Proper form > heavy weight. Always listen to your body and stop if you feel sharp pain.
    `.trim();
  },
  {
    name: "get_injury_prevention",
    description:
      "Provides exercise-specific injury prevention tips, proper form cues, and what to avoid",
    schema: z.object({
      exercise: z
        .string()
        .describe("The exercise in question (e.g., squat, deadlift, bench press)"),
      injuryConcern: z
        .string()
        .describe("Specific injury concern or area of pain"),
    }),
  }
);

const recoveryAdviceTool = tool(
  async (input: {
    trainingFrequency: number;
    sleepHours: number;
    stressLevel: string;
  }) => {
    const retriever = await getFitnessRetriever();

    // Search for recovery protocols
    const docs = await retriever.invoke(
      "recovery sleep deload rest training frequency overtraining"
    );

    const recoveryInfo = docs
      .map((doc) => doc.pageContent)
      .join("\n\n");

    return `
Recovery & Adaptation Guidelines:

Training Frequency: ${input.trainingFrequency} days/week
Current Sleep: ${input.sleepHours} hours/night
Stress Level: ${input.stressLevel}

${recoveryInfo}

${
  input.sleepHours < 7
    ? "⚠️ Try to increase sleep to 7-9 hours for optimal recovery"
    : "✓ Sleep is adequate"
}
${
  input.trainingFrequency > 4
    ? "Consider a deload week (50% volume) every 4-6 weeks"
    : ""
}
    `.trim();
  },
  {
    name: "get_recovery_advice",
    description:
      "Provides personalized recovery recommendations based on training volume, sleep, and stress",
    schema: z.object({
      trainingFrequency: z.number().describe("Number of training days per week"),
      sleepHours: z.number().describe("Average sleep hours per night"),
      stressLevel: z
        .string()
        .describe('Stress level (low, moderate, high)'),
    }),
  }
);

// Create the AI Coach Agent
export async function createAICoachAgent() {
  const llm = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const tools = [
    retrieveResearchTool,
    generateWorkoutPlanTool,
    nutritionAdviceTool,
    injuryPreventionTool,
    recoveryAdviceTool,
  ];

  const systemPrompt = `You are PocketGymAI's advanced AI Coach - an expert fitness coach grounded in exercise science research. You have access to a comprehensive knowledge base of 75+ research papers covering training, nutrition, recovery, and injury prevention.

Your approach:
1. Always back up advice with research from the knowledge base
2. Ask clarifying questions if user information is incomplete
3. Provide specific, actionable advice tailored to the user's goals and level
4. Consider the whole picture: training, nutrition, recovery, and mobility
5. Emphasize proper form and safety over ego lifting
6. Use research-backed numbers and recommendations

Key principles to emphasize:
- Progressive overload is essential for adaptation
- Total training volume matters most (not just intensity)
- Consistency beats perfection
- Recovery is when growth happens, not during training
- Nutrition quality and total macros more than meal timing
- Individual variation exists - listen to your body

Stay conversational but authoritative. Use specific numbers from research when relevant.
Always cite which research area or principle you're drawing from.

Never claim personal training replaces professional medical advice for injuries.`;

  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPrompt),
    new MessagesPlaceholder("chat_history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  const agent = await createOpenAIToolsAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
    maxIterations: 10,
  });

  return agentExecutor;
}

// Initialize vector store on startup
export async function initializeAICoach() {
  try {
    await initializeEmbeddings();
    console.log("✓ AI Coach system initialized successfully");
  } catch (error) {
    console.error("Failed to initialize AI Coach:", error);
    throw error;
  }
}
