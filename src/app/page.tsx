import { CohereClient } from "cohere-ai";

export const dynamic = "force-dynamic";

/**
 * Removes markdown formatting and converts to clean HTML
 * @param {string} content - The markdown content to strip
 * @returns {string} Clean HTML content without markdown syntax
 */
function stripMarkdown(content: string): string {
  let cleaned = content;

  cleaned = cleaned.replace(/```[\s\S]*?```/g, "");
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1");
  cleaned = cleaned.replace(/^#{1,6}\s+(.+)$/gm, "$1");
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, "$1");
  cleaned = cleaned.replace(/\*([^*]+)\*/g, "$1");
  cleaned = cleaned.replace(/__([^_]+)__/g, "$1");
  cleaned = cleaned.replace(/_([^_]+)_/g, "$1");
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^\)]+\)/g, "");
  cleaned = cleaned.replace(/^[\s]*[-*+]\s+(.+)$/gm, "$1");
  cleaned = cleaned.replace(/^\d+\.\s+(.+)$/gm, "$1");
  cleaned = cleaned.replace(/^>\s+(.+)$/gm, "$1");
  cleaned = cleaned.replace(/^---$/gm, "");
  cleaned = cleaned.replace(/^\*\*\*$/gm, "");

  return cleaned.trim();
}

/**
 * Generates random colors for each page load
 * @returns {Object} Object containing color1, color2, color3, bgColor, and textColor
 */
function generateRandomColors() {
  const hue1 = Math.floor(Math.random() * 360);
  const hue2 = Math.floor(Math.random() * 360);
  const hue3 = Math.floor(Math.random() * 360);

  const color1 = `hsl(${hue1}, ${50 + Math.random() * 30}%, ${
    40 + Math.random() * 30
  }%)`;
  const color2 = `hsl(${hue2}, ${50 + Math.random() * 30}%, ${
    40 + Math.random() * 30
  }%)`;
  const color3 = `hsl(${hue3}, ${50 + Math.random() * 30}%, ${
    40 + Math.random() * 30
  }%)`;
  const bgColor = `hsl(${Math.floor(Math.random() * 360)}, ${
    30 + Math.random() * 20
  }%, ${85 + Math.random() * 10}%)`;
  const textColor = `hsl(${Math.floor(Math.random() * 360)}, ${
    40 + Math.random() * 30
  }%, ${20 + Math.random() * 15}%)`;

  return { color1, color2, color3, bgColor, textColor };
}

/**
 * Server component that generates completely random website content using Cohere
 * The AI model has complete freedom to decide what kind of website/page to create
 * @returns {Promise<JSX.Element>} The rendered page component
 */
export default async function Home() {
  const apiKey = process.env.API_KEY;
  const apiModel = process.env.API_MODEL || "command-r-plus";

  if (!apiKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              API Key Missing
            </h1>
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Please set the API_KEY environment variable to use this
              application.
            </p>
          </div>
        </main>
      </div>
    );
  }

  let generatedContent = "";
  let errorMessage = "";
  const colors = generateRandomColors();

  try {
    const cohere = new CohereClient({
      token: apiKey,
    });

    const messageContent =
      "Create a complete, standalone, full-width web page that uses the entire browser window. You decide what kind of website or page this is - it could be a blog post, a product page, a portfolio, a tutorial, a story, a guide, an article, a landing page, or anything else you imagine.\n\n" +
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
      "- Be creative and make each generation completely different and unrelated to any previous content\n\n" +
      "IMPORTANT: Output format must be pure HTML only. Use <style> tag for CSS. Do NOT include <html> or <body> tags - just the content with <style> tag and HTML elements. Absolutely NO markdown formatting.\n\n" +
      `Here are some suggested color themes you can use (but feel free to create your own): ${colors.color1}, ${colors.color2}, ${colors.color3}\n\n` +
      "Respond with ONLY HTML code - no explanations, no markdown, just pure HTML.";

    const response = await cohere.chat({
      model: apiModel,
      message: messageContent,
      maxTokens: 6000,
      temperature: 1.5,
      p: 0.95,
      k: 0,
    });

    const rawContent = response.text || "No content generated.";

    generatedContent = stripMarkdown(rawContent);
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to generate content";
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-red-600 dark:text-red-400">
              Error
            </h1>
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              {errorMessage}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full"
      dangerouslySetInnerHTML={{ __html: generatedContent }}
    />
  );
}
