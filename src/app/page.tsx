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
 * Array of predefined website prompts for random generation
 */
const WEBSITE_PROMPTS = [
  "Create a full-page blog post about futuristic space travel and colonization of Mars. Include sections about propulsion technology, life support systems, and the challenges of living on another planet.",
  "Design a landing page for a modern coffee subscription service. Highlight unique coffee origins, brewing methods, and monthly delivery options.",
  "Build a portfolio website for a digital artist specializing in surrealist fantasy illustrations. Showcase artwork galleries, about section, and contact information.",
  "Create a tutorial page explaining how to build a neural network from scratch. Include step-by-step instructions, code examples, and visual diagrams.",
  "Design a product page for a revolutionary smart home device that learns user behavior patterns. Include features, specifications, and customer testimonials.",
  "Build a recipe website page featuring a unique fusion cuisine dish combining Asian and Mediterranean flavors. Include ingredients list, step-by-step instructions, and cooking tips.",
  "Create a travel guide page for an underrated destination. Include stunning locations, local culture highlights, best times to visit, and hidden gems.",
  "Design a tech startup landing page for an AI-powered fitness app. Highlight workout personalization, progress tracking, and integration with wearable devices.",
  "Build a photography showcase page displaying abstract architectural photography. Include galleries organized by style, techniques used, and artist statement.",
  "Create an educational page explaining quantum computing principles to beginners. Include analogies, visual representations, and real-world applications.",
  "Design a fashion e-commerce page for sustainable clothing brand. Highlight eco-friendly materials, ethical manufacturing, and seasonal collections.",
  "Build a music producer's portfolio page featuring electronic music. Include track previews, production techniques, collaborations, and upcoming releases.",
  "Create a cooking class booking page for a gourmet culinary school. Include course descriptions, chef bios, schedule, and pricing tiers.",
  "Design a health and wellness blog post about the benefits of meditation and mindfulness. Include scientific research, personal stories, and practice guides.",
  "Build a real estate listing page for a luxury waterfront property. Include virtual tour, amenities, neighborhood information, and financing options.",
  "Create a gaming review page for an indie video game. Include gameplay analysis, graphics assessment, storyline review, and final rating.",
  "Design a yoga studio website page with class schedules, instructor profiles, membership options, and wellness resources.",
  "Build a vintage car collector's showcase page. Display rare automobiles with detailed histories, specifications, and restoration stories.",
  "Create a scientific research page presenting breakthrough discoveries in renewable energy. Include methodology, findings, and potential impact.",
  "Design a pet adoption center page featuring available animals. Include photos, personality descriptions, adoption process, and success stories.",
  "Build a cultural events calendar page for a major city. Include festivals, concerts, exhibitions, and community gatherings with dates and venues.",
  "Create a DIY home improvement tutorial page for building a custom bookshelf. Include material lists, tools needed, measurements, and safety tips.",
  "Design a food truck business page with menu, location schedule, catering options, and customer reviews.",
  "Build a historical timeline page documenting a significant era. Include key events, influential figures, and cultural movements.",
  "Create a podcast landing page with episode library, host bios, show descriptions, and subscription options.",
  "Design a nonprofit organization page for environmental conservation. Include mission statement, ongoing projects, volunteer opportunities, and donation options.",
  "Build a wedding planning resource page with vendor recommendations, timeline templates, budget calculators, and inspiration galleries.",
  "Create a sports analytics page breaking down team performance statistics. Include player comparisons, game analysis, and predictive models.",
  "Design a book recommendation website page featuring science fiction novels. Include reviews, reading lists, author spotlights, and discussion forums.",
  "Build a home gardening guide page for growing exotic plants. Include climate requirements, care instructions, propagation methods, and troubleshooting.",
  "Create a cryptocurrency education page explaining blockchain technology. Include wallet setup guides, trading basics, and market analysis.",
  "Design a luxury spa retreat booking page. Include treatment menus, package deals, wellness programs, and resort amenities.",
  "Build a film festival page showcasing independent movies. Include screening schedules, director interviews, award winners, and ticketing information.",
  "Create a language learning platform page for an uncommon language. Include lesson structure, cultural context, pronunciation guides, and progress tracking.",
  "Design a craft beer brewery page featuring unique brews. Include tasting notes, brewing process, taproom information, and merchandise.",
  "Build a mountain climbing expedition planning page. Include route maps, equipment lists, safety protocols, and booking information.",
  "Create a vintage fashion marketplace page. Include curated collections, authentication process, size guides, and style guides.",
  "Design a meditation retreat center page. Include program offerings, teacher profiles, accommodation options, and testimonials.",
  "Build a competitive gaming tournament page. Include bracket information, player profiles, prize pools, and streaming schedules.",
  "Create a sustainable living blog post about zero-waste lifestyle. Include practical tips, product recommendations, and success stories.",
  "Design a wildlife photography portfolio page. Include animal behavior documentation, conservation messages, and expedition stories.",
  "Build a vintage record store page with rare vinyl collections. Include album reviews, turntable recommendations, and listening parties.",
  "Create a urban planning case study page analyzing a city's transit system. Include maps, efficiency metrics, and proposed improvements.",
  "Design a personal finance education page for young adults. Include budgeting tools, investment basics, debt management, and savings strategies.",
  "Build a street art tour page for a major city. Include artist spotlights, mural locations, walking routes, and guided tour options.",
  "Create a sustainable architecture showcase page. Include eco-friendly building designs, renewable energy integration, and green certification details.",
  "Design a specialty tea shop page. Include tea varieties, brewing guides, health benefits, and subscription boxes.",
  "Build a vintage watch collector's page. Include timepiece histories, rarity ratings, authentication services, and restoration work.",
  "Create a space exploration history page. Include milestone missions, astronaut profiles, technological achievements, and future plans.",
  "Design a minimalist interior design portfolio page. Include project galleries, design philosophy, consultation services, and client testimonials.",
  "Build a local farmers market directory page. Include vendor listings, seasonal produce guides, recipes, and market schedules.",
  "Create a psychology research page about sleep and dreams. Include study findings, sleep hygiene tips, and dream interpretation resources.",
  "Design a surf school booking page. Include lesson packages, instructor credentials, equipment rental, and beach location information.",
  "Build a vintage camera collector's showcase page. Include camera specifications, photography tips, restoration guides, and buying advice.",
  "Create a marine biology education page about coral reefs. Include ecosystem information, conservation efforts, and diving guide recommendations.",
  "Design a board game cafe page. Include game library, event calendar, membership options, and snack menu.",
  "Build a hiking trail guide page for national parks. Include difficulty ratings, trail maps, safety tips, and seasonal recommendations.",
  "Create a vintage furniture restoration tutorial page. Include techniques, tool recommendations, before/after galleries, and sourcing tips.",
  "Design a astronomy observation guide page. Include star charts, planet visibility, telescope recommendations, and stargazing locations.",
  "Build a local food tour page. Include restaurant stops, cultural stories, tasting menus, and booking information.",
  "Create a vintage typewriter collector's page. Include typewriter models, typing tips, restoration guides, and typewriter art examples.",
  "Design a sustainable fashion marketplace page. Include ethical brands, material information, and circular economy concepts.",
  "Build a kayaking adventure booking page. Include tour options, skill levels, equipment provided, and safety information.",
  "Create a neuroscience research page about memory formation. Include study findings, practical applications, and memory improvement techniques.",
  "Design a vintage motorcycle enthusiast page. Include bike showcases, maintenance guides, riding stories, and community events.",
  "Build a local theater production page. Include show schedule, cast bios, ticket information, and behind-the-scenes content.",
  "Create a permaculture farming guide page. Include design principles, crop rotation, companion planting, and sustainable practices.",
  "Design a vintage comic book collector's page. Include rare issues, grading information, investment tips, and convention calendars.",
  "Build a rock climbing gym page. Include membership options, route difficulty ratings, classes, and safety protocols.",
  "Create a marine conservation volunteer page. Include project descriptions, skill requirements, application process, and impact stories.",
  "Design a specialty chocolate shop page. Include bean origins, flavor profiles, pairing suggestions, and gift box options.",
  "Build a vintage toy museum page. Include collection highlights, historical context, interactive exhibits, and donation information.",
  "Create a urban farming guide page. Include container gardening, rooftop setups, composting, and crop recommendations.",
  "Design a competitive chess platform page. Include rankings, tournaments, training resources, and master game analyses.",
  "Build a local artisanal cheese shop page. Include cheese varieties, pairing guides, tasting notes, and subscription boxes.",
  "Create a vintage radio restoration page. Include technical guides, component sourcing, broadcasting history, and collector communities.",
  "Design a sustainable transportation advocacy page. Include bike infrastructure proposals, public transit improvements, and car-free initiatives.",
  "Build a pottery workshop booking page. Include class schedules, technique demonstrations, firing information, and studio access.",
  "Create a vintage stamp collector's page. Include rare stamps, historical significance, valuation guides, and trading forums.",
  "Design a specialty olive oil shop page. Include origin information, flavor profiles, health benefits, and recipe suggestions.",
  "Build a birdwatching guide page. Include species identification, migration patterns, observation tips, and best locations.",
  "Create a vintage sewing machine collector's page. Include machine history, restoration techniques, pattern resources, and sewing tutorials.",
  "Design a local maker space page. Include equipment available, membership tiers, workshop schedules, and project showcases.",
  "Build a sustainable seafood guide page. Include fishing practices, species recommendations, ocean conservation, and cooking techniques.",
  "Create a vintage postcard collection page. Include historical significance, geographical coverage, preservation tips, and trading information.",
  "Design a specialty spice market page. Include spice origins, flavor profiles, health benefits, and culinary applications.",
  "Build a local community garden page. Include plot availability, growing guidelines, workshops, and harvest sharing programs.",
  "Create a vintage film camera enthusiast page. Include camera models, film recommendations, developing guides, and photo galleries.",
  "Design a sustainable packaging solutions page. Include biodegradable materials, reduction strategies, and corporate case studies.",
  "Build a local artisan market page. Include vendor profiles, product categories, event calendar, and online shop links.",
  "Create a vintage record player restoration page. Include technical guides, component replacement, maintenance tips, and sound quality optimization.",
];

/**
 * Gets a random website prompt from the predefined list
 * @returns {string} A randomly selected website prompt
 */
function getRandomWebsitePrompt(): string {
  const randomIndex = Math.floor(Math.random() * WEBSITE_PROMPTS.length);
  return WEBSITE_PROMPTS[randomIndex];
}

/**
 * Server component that generates random website content using Cohere
 * Selects from a predefined list of website prompts
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
  const selectedPrompt = getRandomWebsitePrompt();

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
