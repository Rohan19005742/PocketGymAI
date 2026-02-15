# AI Coach RAG - Quick Reference

## 🚀 Quick Start (5 minutes)

### 1. Add Environment Variable
```bash
export OPENAI_API_KEY="sk_your_key_here"
# Or add to .env.local
```

### 2. Install Dependencies  
```bash
npm install
```

### 3. Run Dev Server
```bash
npm run dev
```

### 4. Test
- Go to `http://localhost:3000/auth/signin`
- Login → `/chat` → Ask a fitness question

---

## 📊 System Overview

| Component | Purpose | File |
|-----------|---------|------|
| **Knowledge Base** | 75 research papers | `data/fitness-research-knowledge-base.json` |
| **Vector Store** | Semantic search | `lib/rag-agent.ts` |
| **Agent** | Tool selection & reasoning | `lib/ai-coach-agent.ts` |
| **API Endpoint** | Chat interface | `app/api/chat/ai-coach/route.ts` |
| **UI** | Chat component | `app/chat/page.tsx` |

---

## 🛠️ Core Functions

### Retrieve Research
```typescript
import { searchKnowledgeBase } from '@/lib/rag-agent';

const results = await searchKnowledgeBase(
  "protein intake muscle gain", 
  k=5  // Return 5 results
);
```

### Create Agent
```typescript
import { createAICoachAgent } from '@/lib/ai-coach-agent';

const agent = await createAICoachAgent();
const response = await agent.invoke({
  input: "User question",
  chat_history: "Previous messages"
});
```

### Call API from Frontend
```typescript
const response = await fetch('/api/chat/ai-coach', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'User message' })
});
const data = await response.json();
console.log(data.message); // AI Coach response
```

---

## 🧠 Agent Tools

| Tool | Trigger | Input | Output |
|------|---------|-------|--------|
| **Research Retrieval** | General questions | Query string | Research findings |
| **Workout Generator** | "Create program" | Goal, level, days, equipment | Customized split |
| **Nutrition Advisor** | "How much eat?" | Goal, weight, restrictions | Macro targets |
| **Injury Prevention** | "Form help" "Pain" | Exercise, concern | Form cues, alternatives |
| **Recovery Advisor** | "Overtraining?" | Frequency, sleep, stress | Deload plan, tips |

---

## 📝 Example Queries

### Beginner
```
"I'm new to fitness. I'm 25, weigh 70kg, want to build muscle, 
and can train 3 days/week at home with dumbbells."
```

### Intermediate  
```
"My bench press plateaued. I'm at 100kg x 5 reps. 
What programming should I try?"
```

### Advanced
```
"I'm cutting at a 25% deficit. How do I maintain strength
and minimize muscle loss with 5 days/week training?"
```

### Specific Issue
```
"My lower back hurts when deadlifting. 
I think it's my form. How do I fix it?"
```

---

## 🔧 Customization

### Change LLM Model
```typescript
// In lib/ai-coach-agent.ts
const llm = new ChatOpenAI({
  modelName: "gpt-4-turbo", // Faster, cheaper
  temperature: 0.7,
});
```

### Change Embedding Model
```typescript
// In lib/rag-agent.ts
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large", // More powerful
});
```

### Add Custom Tool
```typescript
const myTool = tool(
  async (input: { param: string }) => {
    // Tool logic
    return "Result";
  },
  {
    name: "my_tool",
    description: "What it does",
    schema: z.object({
      param: z.string().describe("Parameter"),
    }),
  }
);

// Add to tools array in createAICoachAgent()
```

### Modify System Prompt
```typescript
// In lib/ai-coach-agent.ts
const systemPrompt = `You are...`
```

---

## 📦 Knowledge Base Structure

**13 Categories, 75 Papers**

```
Resistance Training (8)
├── Progressive Overload
├── Hypertrophy Mechanisms  
├── Periodization
└── ...

Nutrition (7)
├── Protein Requirements
├── Carb Timing
├── Supplementation
└── ...

Recovery (5)
├── Sleep
├── Overtraining
├── Stress Management
└── ...

[9 more categories...]
```

---

## 🔍 Debugging

### Enable Verbose Logging
```typescript
const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: true, // See all tool calls
});
```

### Clear Vector Store (if corrupted)
```typescript
// Delete from memory (next init loads fresh)
vectorStore = null;
```

### Test Vector Search
```typescript
import { searchKnowledgeBase } from '@/lib/rag-agent';

const results = await searchKnowledgeBase("test query");
console.log(results); // Should return documents
```

### Check API Connectivity
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

---

## ⚠️ Common Issues

### "API key not found"
**Fix**: Add `OPENAI_API_KEY` to `.env.local` and restart dev server

### "Knowledge base failed to load"
**Fix**: Verify `data/fitness-research-knowledge-base.json` exists and is valid JSON

### "Vector store initialization hangs"
**Fix**: Check OpenAI API status, increase timeout in code to 30s

### "Responses are generic"
**Fix**: Check console logs for tool invocation, verify retrieval is working

### "Chat history grows too large"
**Fix**: Messages trimmed to last 100, or set `cleanupOldConversations()`

---

## 🚀 Deployment Checklist

- [ ] `OPENAI_API_KEY` set in production
- [ ] `NEXTAUTH_SECRET` set to random 32-byte string
- [ ] `DATABASE_URL` points to prod database
- [ ] Vector store persisted (Pinecone/SQLite)
- [ ] Monitoring & error logging enabled
- [ ] Rate limiting on `/api/chat/ai-coach`
- [ ] Conversation cleanup job scheduled
- [ ] Test all major user flows

---

## 📊 Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| First response | 5-10s | Vector store init |
| Subsequent | 1-3s | Just API latency |
| Knowledge base init | <10s | One-time on startup |
| Memory usage | <200MB | ~75 papers + embeddings |
| Vector search | <500ms | k=5 documents |

---

## 🧪 Testing

### Quick Unit Test
```typescript
const results = await searchKnowledgeBase("protein requirements");
expect(results.length).toBeGreaterThan(0);
expect(results[0].metadata.category).toBeDefined();
```

### Test API Endpoint
```bash
curl -X POST http://localhost:3000/api/chat/ai-coach \
  -H "Content-Type: application/json" \
  -d '{"message":"How much protein should I eat?"}'
```

### Load Test
```bash
# Test with 10 concurrent requests
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/chat/ai-coach \
    -H "Content-Type: application/json" \
    -d '{"message":"Test query"}' &
done
wait
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [RAG_SETUP.md](./RAG_SETUP.md) | Full setup & configuration |
| [AI_COACH_USER_GUIDE.md](./AI_COACH_USER_GUIDE.md) | Usage examples & conversations |
| [AI_COACH_DEVELOPER_GUIDE.md](./AI_COACH_DEVELOPER_GUIDE.md) | Advanced customization |
| [AI_COACH_SUMMARY.md](./AI_COACH_SUMMARY.md) | Project overview |
| **.env.example** | Required env vars |

---

## 🔗 Useful Links

- **OpenAI API**: https://platform.openai.com
- **LangChain Docs**: https://js.langchain.com
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Vector DBs**: Pinecone, Weaviate, Milvus

---

## 💡 Pro Tips

1. **Start simple**: Test with basic queries before complex ones
2. **Check console**: Most issues visible in browser/server logs
3. **Use verbose mode**: Set `verbose: true` in agent to see tool calls
4. **Cache vectors**: Vector store persists in memory until app restart
5. **Monitor costs**: Token counting helps track OpenAI API costs
6. **Regular updates**: Update knowledge base quarterly with new research
7. **User feedback**: Collect which tools/advice help users most

---

## 🤝 Contributing

To add new research papers:

1. Edit `data/fitness-research-knowledge-base.json`
2. Add new paper to appropriate category:
   ```json
   {
     "id": "CAT###",
     "title": "Paper Title",
     "authors": "Author Names",
     "year": 2024,
     "keyFindings": ["Finding 1", "Finding 2"],
     "practical_applications": ["App 1", "App 2"]
   }
   ```
3. Restart dev server (vector store reloads)
4. Test retrieval: `searchKnowledgeBase("relevant query")`

---

## 📞 Support

- **Issues**: Check documentation first
- **OpenAI Issues**: Check https://status.openai.com
- **LangChain Issues**: See https://github.com/langchain-ai/langchainjs/issues
- **General Help**: Review error messages in console

---

## 🎯 Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm build

# Start production server
npm start

# Lint code
npm run lint

# Run tests
npm test

# Reset database
npx prisma migrate reset

# View database GUI
npx prisma studio

# Check environment variables
cat .env.local
```

---

**Last Updated**: February 15, 2026  
**Version**: 1.0  
**Status**: Production Ready ✅
