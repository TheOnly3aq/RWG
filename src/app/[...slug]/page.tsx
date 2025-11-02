import { CohereClient } from "cohere-ai";
import {
  stripMarkdown,
  generateRandomColors,
  replaceLinksWithRandomSearches,
} from "../../lib/websiteUtils";

export const dynamic = "force-dynamic";

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
 * Server component that generates website content based on the URL slug
 * @param {Object} props - Component props
 * @param {Object} props.params - Route parameters
 * @param {string[]} props.params.slug - The slug array from the URL
 * @returns {Promise<JSX.Element>} The rendered page component
 */
export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugString = slug.join("/");
  const topicSlug = slug[slug.length - 1];

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
  const selectedPrompt = generatePromptFromSlug(topicSlug);

  try {
    const cohere = new CohereClient({
      token: apiKey,
    });

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
      "- IMPORTANT: All links (anchor tags with href) must point to random Google search URLs. Use href=\"https://www.google.com/search?q=random+topic\" format for all links\n\n" +
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
    generatedContent = replaceLinksWithRandomSearches(generatedContent);
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

