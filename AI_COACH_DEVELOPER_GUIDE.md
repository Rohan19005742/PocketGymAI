# AI Coach RAG - Developer Guide

## Architecture Overview

The RAG (Retrieval-Augmented Generation) system consists of 4 main components:

```
Input (User Query)
    ↓
┌───────────────────────────────────────┐
│ Agent with Tool Selection (LangChain) │
└───────────┬───────────────────────────┘
            ↓
    ┌───────────────────────────────┐
    │ Tool Selection & Execution    │
    ├───────────────────────────────┤
    │ - retrieve_fitness_research   │
    │ - generate_workout_plan       │
    │ - get_nutrition_advice        │
    │ - get_injury_prevention       │
    │ - get_recovery_advice         │
    └───────────┬───────────────────┘
                ↓
    ┌───────────────────────────────┐
    │ Vector Store Query & Retrieval│
    └───────────┬───────────────────┘
                ↓
    ┌───────────────────────────────┐
    │ Knowledge Base Documents      │
    │ (75 Research Papers)          │
    └───────────────────────────────┘
                ↓
    ┌───────────────────────────────┐
    │ LLM Response Generation       │
    │ (GPT-4)                       │
    └───────────┬───────────────────┘
                ↓
            Output (AI Coach Response)
```

---

## Core Components

### 1. **lib/rag-agent.ts** - Knowledge Base Management

```typescript
// Initialize embeddings
await initializeEmbeddings()

// Load and process knowledge base
await loadAndProcessKnowledgeBase()

// Get vector store instance
const vectorStore = await getVectorStore()

// Search knowledge base
const results = await searchKnowledgeBase(query, k=5)

// Get retriever for agent
const retriever = await getFitnessRetriever()
```

**Key Functions**:

| Function | Purpose |
|----------|---------|
| `initializeEmbeddings()` | Create OpenAI embeddings instance |
| `loadAndProcessKnowledgeBase()` | Parse JSON, chunk documents, create vector store |
| `getVectorStore()` | Get or create vector store (singleton) |
| `searchKnowledgeBase(query, k)` | Retrieve k similar documents for query |
| `getFitnessRetriever()` | Get retriever for agent tools |

**Customization**:

```typescript
// Change embedding model
embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large", // More powerful
});

// Change chunk size
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 2000, // Larger chunks = less retrieval calls
  chunkOverlap: 500, // More context bleed
});

// Change retrieval count
vector.asRetriever({
  k: 10, // Return 10 instead of 5 results
  searchType: "similarity", // or "mmr" (maximal marginal relevance)
});
```

---

### 2. **lib/ai-coach-agent.ts** - Agent & Tools Definition

```typescript
// Main function to create agent
const agent = await createAICoachAgent()

// Agent executor returns: { output: string, ...metadata }
const response = await agent.invoke({
  input: "User query",
  chat_history: "Previous conversation context"
})
```

**Tool Architecture**:

Each tool uses `tool()` helper from `@langchain/core/tools`:

```typescript
const customTool = tool(
  async (input: { param1: string; param2: number }) => {
    // Tool logic here
    return "Tool output";
  },
  {
    name: "tool_name",
    description: "What this tool does and when to use it",
    schema: z.object({
      param1: z.string().describe("Parameter description"),
      param2: z.number().describe("Parameter description"),
    }),
  }
);
```

**Available Tools**:

| Tool | Purpose | When Used |
|------|---------|-----------|
| `retrieve_fitness_research` | Search knowledge base | General fitness questions |
| `generate_workout_plan` | Create customized programs | "Create a workout plan for..." |
| `get_nutrition_advice` | Personalized nutrition | "How much should I eat?" |
| `get_injury_prevention` | Form & safety tips | "My knees hurt when..." |
| `get_recovery_advice` | Recovery optimization | "Am I overtraining?" |

**Add a New Tool**:

```typescript
const newTool = tool(
  async (input: { userParam: string }) => {
    const retriever = await getFitnessRetriever();
    const docs = await retriever.invoke(input.userParam);
    
    // Process docs and generate response
    return processedResponse;
  },
  {
    name: "new_tool_name",
    description: "When to use this tool",
    schema: z.object({
      userParam: z.string().describe("What user provides"),
    }),
  }
);

// Add to tools array before creating agent
const tools = [
  retrieveResearchTool,
  generateWorkoutPlanTool,
  // ... other tools
  newTool, // Add here
];
```

---

### 3. **app/api/chat/ai-coach/route.ts** - API Endpoint

```typescript
POST /api/chat/ai-coach
Headers:
  Authorization: NextAuth session (automatic)
  Content-Type: application/json

Request:
{
  "message": "User message"
}

Response:
{
  "success": true,
  "message": "AI Coach response",
  "timestamp": "2026-02-15T10:00:00Z"
}
```

**Conversation Memory**:

```typescript
// In-memory store per user
const conversationHistories = new Map<
  string, 
  { messages: Array<{role, content}>; timestamp }
>()

// Kept to last 100 messages for efficiency
if (history.messages.length > 100) {
  history.messages = history.messages.slice(-100);
}

// Cleaned up after 24 hours
cleanupOldConversations(1440)
```

**Persistence (Production)**:

```typescript
// Add Prisma model
model ChatHistory {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  messages  Message[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Message {
  id            String      @id @default(cuid())
  chatHistoryId String
  chatHistory   ChatHistory @relation(fields: [chatHistoryId], references: [id])
  role          String      // "user" or "ai"
  content       String
  createdAt     DateTime    @default(now())
}

// Query from database
const history = await prisma.chatHistory.findUnique({
  where: { userId },
  include: { messages: { orderBy: { createdAt: 'desc' }, take: 100 } }
});
```

---

## Advanced Customization

### 1. Custom LLM Model

```typescript
// In lib/ai-coach-agent.ts
const llm = new ChatOpenAI({
  modelName: "gpt-4-turbo", // Faster, cheaper than GPT-4
  temperature: 0.7, // 0=deterministic, 1=creative
  openAIApiKey: process.env.OPENAI_API_KEY,
  maxTokens: 2000, // Limit response length
});

// Or use Anthropic Claude
import { ChatAnthropic } from "@langchain/anthropic";
const llm = new ChatAnthropic({
  modelName: "claude-3-opus",
  temperature: 0.7,
});
```

### 2. Enhanced Vector Store

**Use Persistent Vector Store** (SQLite via LangChain):

```typescript
import { SQLiteVectorStore } from "langchain/vectorstores/sqlite";
import Database from "better-sqlite3";

const db = new Database("./vectorstore.db");

vectorStore = await SQLiteVectorStore.fromDocuments(
  splits,
  embeddings,
  {
    db,
    tableName: "fitness_vectors",
  }
);
```

**Use Cloud Vector Store** (Pinecone):

```typescript
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index(process.env.PINECONE_INDEX);

vectorStore = await PineconeStore.fromDocuments(
  splits,
  embeddings,
  { pineconeIndex: index }
);
```

### 3. Document Chunking Strategy

```typescript
// Multi-level chunking
const strategies = [
  // Full papers
  new CharacterTextSplitter({
    chunkSize: 5000, // Large context
    chunkOverlap: 500,
  }),
  // Key points
  new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  }),
  // Micro summaries
  new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 50,
  }),
];

// Use metadata to query different levels
documents.forEach((doc) => {
  doc.metadata.chunkLevel = "full"; // or "summary" or "micro"
});

// Filter during retrieval
vectorStore.similaritySearch(query, k, {
  chunkLevel: "summary", // Prefer summaries
});
```

### 4. Hybrid Retrieval (Semantic + Keyword)

```typescript
import { BM25Retriever } from "langchain/retrievers/bm25";

// Keyword-based retriever
const keyword = BM25Retriever.fromDocuments(docs);

// Combine semantic + keyword
const ensemble = await getEnsembleRetriever([
  vectorStore.asRetriever(),  // Semantic search
  keyword.asRetriever(),      // BM25 keyword search
], {
  weights: [0.7, 0.3], // 70% semantic, 30% keyword
});

const results = await ensemble.invoke(query);
```

### 5. Custom System Prompt

```typescript
const systemPrompt = `You are an expert AI Coach with PhD-level knowledge in:
- Exercise Science & Physiology
- Biomechanics & Movement Science
- Sports Nutrition & Biochemistry
- Psychology of Habit Change

Your unique personality:
- Conversational but authoritative
- Passionate about evidence-based training
- Adaptive to user fitness level
- Encouraging but realistic
- Always cite research backing recommendations

Your constraints:
- Do NOT provide medical diagnoses
- Direct to medical professionals for severe issues
- Acknowledge uncertainty ("I'm less confident about...")
- Update advice as user provides more context
- Consider individual variation explicitly
`;
```

### 6. Multi-turn Agent with Memory

```typescript
import { ConversationSummaryMemory } from "langchain/memory";

const memory = new ConversationSummaryMemory({
  llm: new ChatOpenAI({ modelName: "gpt-3.5-turbo" }),
  returnMessages: true,
  maxTokenLimit: 2000,
});

// Agent automatically manages conversation memory
const agentWithMemory = new AgentExecutor({
  agent,
  tools,
  memory,
  verbose: true,
});
```

---

## Performance Optimization

### 1. Implement Caching

```typescript
import { InMemoryCache } from "langchain/cache";
import { RedisCache } from "langchain/cache";

// In-memory for development
const cache = new InMemoryCache();

// Redis for production
const cache = new RedisCache(
  new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  })
);

// Apply to LLM
const llm = new ChatOpenAI({
  modelName: "gpt-4",
  cache, // Add cache
});
```

### 2. Batch Processing

```typescript
// Instead of sequential queries
const responses = await Promise.all(
  queries.map(q => agent.invoke({ input: q }))
);
```

### 3. Tool Dependency Optimization

```typescript
// Only call expensive tools when needed
const cheapTools = [retrieveResearchTool];
const expensiveTools = [generateWorkoutPlanTool];

// Create agent with filtered tools based on query
if (query.includes("program") || query.includes("plan")) {
  agentTools = [...cheapTools, ...expensiveTools];
} else {
  agentTools = cheapTools;
}
```

---

## Testing the Integration

### Unit Test Example

```typescript
import { describe, it, expect } from "vitest";
import { searchKnowledgeBase } from "@/lib/rag-agent";

describe("RAG Agent", () => {
  it("retrieves relevant fitness research", async () => {
    const results = await searchKnowledgeBase(
      "protein intake muscle growth",
      3
    );
    
    expect(results.length).toBe(3);
    expect(results[0].metadata.category).toContain("Nutrition");
  });

  it("handles no matches gracefully", async () => {
    const results = await searchKnowledgeBase("xyz12345", 5);
    expect(results.length).toBeLessThanOrEqual(5);
  });
});
```

### Integration Test Example

```typescript
describe("AI Coach Endpoint", () => {
  it("responds to user query with research", async () => {
    const response = await fetch("/api/chat/ai-coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "How much protein should I eat?"
      }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.message).toContain("protein");
  });
});
```

---

## Monitoring & Debugging

### Enable Verbose Logging

```typescript
// In AI Coach agent creation
const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: true, // Enable detailed logging
  maxIterations: 10,
});

// In environment
process.env.DEBUG = "langchain:*"; // Very detailed
```

### Track Token Usage

```typescript
const response = await agent.invoke({ input });

console.log(`
  Tokens used: ${response.totalTokens || "unknown"}
  Cost: ${response.totalTokens * 0.00003} // GPT-4 pricing
`);
```

### Log Tool Invocation

```typescript
// Wrap tools with logging
const loggingTool = tool(
  async (input) => {
    console.log(`[TOOL] Tool called with:`, input);
    const result = await originalTool(input);
    console.log(`[TOOL] Tool result:`, result.substring(0, 100));
    return result;
  },
  schema
);
```

---

## Future Enhancements

### Phase 1 (Current)
- ✅ Basic RAG with research papers
- ✅ Tool-based agent
- ✅ Conversation memory
- ✅ Multi-turn support

### Phase 2
- [ ] Database persistence for conversations
- [ ] User profile personalization
- [ ] Workout video library
- [ ] Progress tracking integration
- [ ] Real-time form checking (computer vision)

### Phase 3
- [ ] Mobile app with offline support
- [ ] Wearable integration (Apple Watch, Fitbit)
- [ ] Social features (share workouts)
- [ ] AI video form analysis
- [ ] Nutrition planning with grocery integration

### Phase 4
- [ ] Multi-language support
- [ ] Advanced biometric integration
- [ ] Predictive coaching (prevent injuries)
- [ ] AI-generated workout videos
- [ ] Enterprise coaching tools

---

## Resources

- [LangChain Documentation](https://js.langchain.com)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
- [LangChain Agents](https://js.langchain.com/docs/modules/agents/)
- [Vector Databases](https://js.langchain.com/docs/modules/data_connection/vectorstores/)

---

**Last Updated**: February 15, 2026
**Version**: 1.0
