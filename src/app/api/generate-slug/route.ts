import { NextRequest, NextResponse } from "next/server";
import {
  stripMarkdown,
  generateRandomColors,
  replaceLinksWithRandomSearches,
} from "../../../lib/websiteUtils";

/**
 * Converts a slug string to a readable topic name
 * @param {string} slug - The URL slug
 * @returns {string} A human-readable topic name
 */
function slugToTopic(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generates a website prompt based on the slug
 * @param {string} slug - The URL slug/topic
 * @returns {string} A website prompt for the given topic
 */
function generatePromptFromSlug(slug: string): string {
  const topic = slugToTopic(slug);
  return `Create a complete, standalone, full-width web page about ${topic}. This must be a comprehensive ${topic} website with detailed content, engaging visuals, and all the features you would expect from a real ${topic} website. Make it specific, detailed, and focused on ${topic}.`;
}

/**
 * POST handler for generating website content based on slug
 * @param {NextRequest} request - The incoming request with slug in body
 * @returns {Promise<NextResponse>} The generated content or error
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.API_KEY;
  const apiModel = process.env.API_MODEL || "openai/gpt-4.1-nano";

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "API Key Missing. Please set the API_KEY environment variable.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { topicSlug } = body;

    if (!topicSlug || typeof topicSlug !== "string") {
      return NextResponse.json(
        { error: "topicSlug is required" },
        { status: 400 }
      );
    }

    const selectedPrompt = generatePromptFromSlug(topicSlug);
    const colors = generateRandomColors();

    const messageContent =
      `${selectedPrompt}\n\n` +
      "CRITICAL REQUIREMENTS - READ CAREFULLY:\n" +
      "- You MUST respond with ONLY HTML code - NO markdown syntax whatsoever\n" +
      "- DO NOT use markdown like #, ##, **, *, _, [], (), ```, -, >, etc.\n" +
      "- Use ONLY HTML tags like <h1>, <h2>, <p>, <div>, <span>, <ul>, <li>, <a>, etc.\n" +
      "- This must be a FULL PAGE design that uses 100% width and height of the browser\n" +
      "- Use bright, vibrant, random colors throughout the design - be bold and creative with color choices\n" +
      "- Include inline CSS styles directly in your HTML for colors, backgrounds, fonts, spacing, and layout\n" +
      "- Make the design visually striking and completely different from typical websites\n" +
      "- Generate the full HTML content including a title, body content with proper HTML structure (headings, paragraphs, lists, etc.)\n" +
      "- Use creative layouts - sidebars, grids, asymmetric designs, or any unique arrangement\n" +
      "- Add colorful backgrounds, gradients, or patterns\n" +
      "- Make it feel like a real, complete website with its own unique visual identity\n" +
      "- Be creative and make each generation completely different and unrelated to any previous content\n" +
      '- IMPORTANT: All links (anchor tags with href) must point to random Google search URLs. Use href="https://www.google.com/search?q=random+topic" format for all links\n\n' +
      "IMPORTANT: Output format must be pure HTML only. Use <style> tag for CSS. Do NOT include <html> or <body> tags - just the content with <style> tag and HTML elements. Absolutely NO markdown formatting.\n\n" +
      `Here are some suggested color themes you can use (but feel free to create your own): ${colors.color1}, ${colors.color2}, ${colors.color3}\n\n` +
      "Respond with ONLY HTML code - no explanations, no markdown, just pure HTML.";

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: apiModel,
          messages: [
            {
              role: "user",
              content: messageContent,
            },
          ],
          max_tokens: 4000,
          temperature: 1.5,
          top_p: 0.95,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `OpenRouter API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const rawContent =
      data.choices?.[0]?.message?.content || "No content generated.";

    let content = stripMarkdown(rawContent);
    content = replaceLinksWithRandomSearches(content);

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate content",
      },
      { status: 500 }
    );
  }
}
