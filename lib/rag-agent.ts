import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import fs from "fs";
import path from "path";

// Initialize embeddings (using OpenAI)
let embeddings: OpenAIEmbeddings | null = null;
let vectorStore: MemoryVectorStore | null = null;

export async function initializeEmbeddings() {
  if (!embeddings) {
    embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      model: "text-embedding-3-small",
    });
  }
  return embeddings;
}

export async function loadAndProcessKnowledgeBase() {
  try {
    const knowledgeBasePath = path.join(
      process.cwd(),
      "data",
      "fitness-research-knowledge-base.json"
    );
    const fileContent = fs.readFileSync(knowledgeBasePath, "utf-8");
    const knowledgeBase = JSON.parse(fileContent);

    const documents: Document[] = [];

    // Process each category
    for (const [categoryKey, categoryData] of Object.entries(
      knowledgeBase.categories
    )) {
      const category = categoryData as any;

      if (category.papers && Array.isArray(category.papers)) {
        category.papers.forEach((paper: any) => {
          const content = `
Category: ${category.name}
Paper: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}

Key Findings:
${paper.keyFindings.map((finding: string) => `- ${finding}`).join("\n")}

Practical Applications:
${paper.practical_applications.map((app: string) => `- ${app}`).join("\n")}
          `.trim();

          documents.push(
            new Document({
              pageContent: content,
              metadata: {
                id: paper.id,
                title: paper.title,
                authors: paper.authors,
                year: paper.year,
                category: category.name,
                categoryKey: categoryKey,
              },
            })
          );
        });
      }
    }

    // Add quick reference as a document
    const quickRefContent = `
Quick Reference Guide for Fitness:
${JSON.stringify(knowledgeBase.quick_reference, null, 2)}
    `.trim();

    documents.push(
      new Document({
        pageContent: quickRefContent,
        metadata: {
          id: "quick-ref",
          title: "Quick Reference Guide",
          category: "Quick Reference",
        },
      })
    );

    // Split documents
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splits = await splitter.splitDocuments(documents);

    // Initialize embeddings and create vector store
    const embeddings = await initializeEmbeddings();
    vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);

    console.log(`Knowledge base loaded: ${splits.length} document chunks`);
    return vectorStore;
  } catch (error) {
    console.error("Error loading knowledge base:", error);
    throw error;
  }
}

export async function getVectorStore(): Promise<MemoryVectorStore> {
  if (!vectorStore) {
    vectorStore = await loadAndProcessKnowledgeBase();
  }
  return vectorStore;
}

export async function searchKnowledgeBase(query: string, k: number = 5) {
  const store = await getVectorStore();
  const results = await store.similaritySearch(query, k);
  return results;
}

// Create a fitness-specific retriever
export async function getFitnessRetriever() {
  const store = await getVectorStore();
  return store.asRetriever({
    k: 5,
    searchType: "similarity",
  });
}
