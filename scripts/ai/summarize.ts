import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { CollectedItem } from "../collect/index.js";
import type { NewsItem } from "../types.js";
import { SYSTEM_PROMPT } from "./prompt.js";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";

const AnalysisSchema = z.object({
  summary: z.string(),
  relevance_score: z.number().int().min(1).max(5),
  relevant_tags: z.array(z.string()),
});

const ANALYSIS_TOOL: Anthropic.Tool = {
  name: "submit_analysis",
  description: "기사 요약, 관련도 점수, 태그를 구조화된 형태로 제출한다.",
  input_schema: {
    type: "object",
    properties: {
      summary: { type: "string", description: "2~3문장 한글 요약" },
      relevance_score: {
        type: "integer",
        minimum: 1,
        maximum: 5,
        description: "공정기술 직무 관점 관련도 (1~5)",
      },
      relevant_tags: {
        type: "array",
        items: { type: "string" },
        description: "공정/소자/장비/시장/정책 등 태그",
      },
    },
    required: ["summary", "relevance_score", "relevant_tags"],
  },
};

function fallback(item: CollectedItem): NewsItem {
  return {
    title: item.title,
    url: item.url,
    source: item.source,
    category: item.category,
    published_at: item.published_at,
    summary: null,
    relevance_score: null,
    relevant_tags: [],
    ai_processed: false,
  };
}

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

export async function summarizeAndScore(item: CollectedItem): Promise<NewsItem> {
  const anthropic = getClient();
  if (!anthropic) return fallback(item);

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      tools: [ANALYSIS_TOOL],
      tool_choice: { type: "tool", name: "submit_analysis" },
      messages: [
        {
          role: "user",
          content: `제목: ${item.title}\n설명: ${item.description}\n출처: ${item.source}`,
        },
      ],
    });

    const toolUse = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
    );
    if (!toolUse) return fallback(item);

    const parsed = AnalysisSchema.parse(toolUse.input);

    return {
      title: item.title,
      url: item.url,
      source: item.source,
      category: item.category,
      published_at: item.published_at,
      summary: parsed.summary,
      relevance_score: parsed.relevance_score,
      relevant_tags: parsed.relevant_tags,
      ai_processed: true,
    };
  } catch (error) {
    console.error(`[AI 처리 실패] ${item.title}:`, error);
    return fallback(item);
  }
}
