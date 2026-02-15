# PocketGymAI - RAG Agent Setup Guide

## Overview

The AI Coach is powered by a **Retrieval-Augmented Generation (RAG)** agent leveraging 75+ research papers in exercise science. This guide covers setup, configuration, and usage.

## Architecture

```
┌─────────────────┐
│  User Interface │ (app/chat/page.tsx)
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  AI Coach API Endpoint  │ (app/api/chat/ai-coach/route.ts)
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  LangChain Agent        │ (lib/ai-coach-agent.ts)
│  - Tool Functions       │
│  - Memory Management    │
│  - Tool Router          │
└────────┬────────────────┘
         │
    ┌────┴────┬──────────┬──────────┬─────────┐
    │          │          │          │         │
    ▼          ▼          ▼          ▼         ▼
 Research  Workout   Nutrition  Injury    Recovery
 Retrieval  Generator Advisor   Prevention Advice
    │          │          │          │         │
    └────┬─────┴──────┬───┴──────────┴────┬────┘
         │            │                    │
         ▼            ▼                    ▼
   ┌──────────────────────────┐     ┌─────────────┐
   │  Vector Store (Memory)   │     │  OpenAI API │
   │  + Embeddings            │     │  (GPT-4)    │
   └──────────────────────────┘     └─────────────┘
         │
         ▼
   ┌──────────────────────────┐
   │  Knowledge Base          │
   │  (75 Research Papers)    │
   │  fitness-research-kb.json│
   └──────────────────────────┘
```

## Prerequisites

1. **Node.js 18+** and npm
2. **OpenAI API Key** (GPT-4 access required)
3. **Environment Variables** configured

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `langchain` - Core LangChain framework
- `@langchain/openai` - OpenAI integration
- `@langchain/core` - Core abstractions
- `@langchain/community` - Community tools
- `zod` - Data validation
- All existing dependencies

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk_... # Your OpenAI API key

# Other existing environment variables
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
DATABASE_URL=file:./prisma/dev.db
```

### 3. Initialize Database

If not already done:

```bash
npx prisma migrate dev
npx prisma generate
```

## Features

### 1. **Research Retrieval Tool**
- Searches 75+ research papers
- Returns relevant findings and applications
- Grounds responses in evidence

**Usage**: Agent automatically uses this to answer fitness questions

### 2. **Workout Plan Generator**
- Creates personalized plans based on:
  - Training goal (strength, hypertrophy, weight loss)
  - Experience level (beginner, intermediate, advanced)
  - Frequency (1-7 days/week)
  - Available equipment
- Returns research-backed structure and recommendations

**Example Query**:
```
"Generate a 4-day upper/lower split for hypertrophy. 
I'm intermediate and train in a full gym."
```

### 3. **Nutrition Advisor**
- Calculates personalized macros
- Considers bodyweight, goal, and dietary restrictions
- Provides supplement recommendations
- References research on protein timing, meal frequency, etc.

**Example Query**:
```
"I weigh 85kg and want to gain muscle. I'm vegan. 
What should I eat daily?"
```

### 4. **Injury Prevention Tool**
- Provides exercise-specific form cues
- Common mistakes to avoid
- Injury prevention strategies
- When to modify or skip exercises

**Example Query**:
```
"I have lower back pain. How should I modify my deadlifts?"
```

### 5. **Recovery Advisor**
- Analyzes training frequency, sleep, and stress
- Recommends deload protocols
- Provides recovery optimization tips
- Identifies overtraining risks

**Example Query**:
```
"I train 5 days/week, sleep 6 hours, and work 50+ hour weeks. 
Am I overtraining?"
```

## API Endpoint

### POST `/api/chat/ai-coach`

**Request**:
```json
{
  "message": "How should I structure my workout?"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Based on research...",
  "timestamp": "2026-02-15T10:30:00Z"
}
```

**Error Handling**:
- 401: User not authenticated
- 400: Invalid message format
- 503: OpenAI API not configured
- 500: Processing error

## Knowledge Base Structure

The knowledge base (`data/fitness-research-knowledge-base.json`) contains:

### Categories (13 total):
1. **Resistance Training** (8 papers) - Progressive overload, dose-response
2. **Hypertrophy** (4 papers) - Muscle growth mechanisms
3. **Nutrition** (7 papers) - Protein, macros, supplementation
4. **Cardiovascular** (4 papers) - Aerobic training, HIIT
5. **Fat Loss** (5 papers) - Deficit strategies, muscle preservation
6. **Recovery** (5 papers) - Sleep, overtraining, deloads
7. **Mobility** (5 papers) - Flexibility, injury prevention
8. **Injury Prevention** (5 papers) - Form cues, rehab
9. **Programming** (4 papers) - Program design, periodization
10. **Female Training** (4 papers) - Hormonal considerations
11. **Age-Specific** (3 papers) - Youth to seniors
12. **Accessory Exercises** (4 papers) - Exercise variations
13. **Performance** (4 papers) - Supplements, optimization

### Quick Reference Data:
- Protein recommendations
- Training frequency guidelines
- Rest period recommendations
- Sleep requirements
- Caloric deficits/surpluses
- And more...

## Testing the Agent

### Local Testing

1. Start the dev server:
```bash
npm run dev
```

2. Login at `http://localhost:3000/auth/signin`

3. Navigate to `/chat`

4. Try sample queries:

**Test Query 1 - Basic Training**:
```
"I'm a beginner wanting to build muscle. 
How many days per week should I train?"
```

**Test Query 2 - Specific Exercise**:
```
"I have tight shoulders. How can I improve my mobility for bench press?"
```

**Test Query 3 - Nutrition**:
```
"I weigh 90kg. How much protein should I eat to build muscle?"
```

**Test Query 4 - Programming**:
```
"Create a 4-day workout split for someone who wants to build muscle. 
I work out in a gym with all equipment."
```

## Performance Considerations

### Vector Store
- **Type**: In-memory (MemoryVectorStore)
- **Size**: ~75 papers × 5 chunks = ~375 documents
- **Load Time**: ~5-10 seconds on first initialization
- **Memory**: ~50-100MB

### API Response Time
- First message: 3-5 seconds (includes vector store init)
- Subsequent: 1-3 seconds per response
- Tool invocation: +0.5-1 second per tool call

### Optimization Tips
1. **Caching**: vector store initializes once, persists in memory
2. **History**: conversations trimmed to last 100 messages per user
3. **Cleanup**: old conversations cleaned up after 24 hours

## Troubleshooting

### "API key not found"
- Ensure `OPENAI_API_KEY` is set in `.env.local`
- Restart dev server after adding env vars

### "Knowledge base failed to load"
- Check `data/fitness-research-knowledge-base.json` exists
- Verify JSON is valid: `node -e "JSON.parse(require('fs').readFileSync('./data/fitness-research-knowledge-base.json'))"`

### "Vector store initialization timeout"
- First run takes longer (~10 seconds)
- Check console for embedding errors

### "Chat returns generic responses"
- Verify RAG tools are being invoked in console logs
- Check vector search is retrieving relevant documents
- Ensure OpenAI API has sufficient quota

## Advanced Configuration

### Change Embedding Model
In `lib/rag-agent.ts`:
```typescript
embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: "text-embedding-3-large", // Change here
});
```

### Change LLM Model
In `lib/ai-coach-agent.ts`:
```typescript
const llm = new ChatOpenAI({
  modelName: "gpt-4-turbo", // Change here
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});
```

### Adjust Tool Complexity
In `lib/ai-coach-agent.ts`, modify tool definitions to call with different parameters.

### Database Integration
For production, replace in-memory conversation history:

```typescript
// In app/api/chat/ai-coach/route.ts
// Add Prisma model for ChatHistory
const history = await prisma.chatHistory.findUnique({
  where: { userId },
  include: { messages: true },
});
```

## Best Practices

1. **User Context**: Collect user info (age, goal, level) early
2. **Progressive Queries**: Simple → Complex over conversation
3. **Validation**: Always verify advice with qualified professionals
4. **Feedback Loop**: Track which advice helps users most
5. **Regular Updates**: Update knowledge base as new research emerges

## Future Enhancements

- [ ] Persistent conversation history (PostgreSQL)
- [ ] User profile for personalization
- [ ] Multi-modal input (voice, images)
- [ ] Real-time form checking with computer vision
- [ ] Integration with wearables (Apple Watch, Fitbit)
- [ ] PDF research paper parsing
- [ ] Workout video library with form checking
- [ ] Community features (share workouts, progress)

## Support

For issues or questions:
1. Check console logs for error messages
2. Verify all environment variables are set
3. Test API endpoint directly with curl/Postman
4. Check OpenAI API status
5. Review LangChain documentation

---

**Last Updated**: February 15, 2026
**Version**: 1.0
