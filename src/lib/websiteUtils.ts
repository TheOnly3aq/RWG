/**
 * Removes markdown formatting and converts to clean HTML
 * @param {string} content - The markdown content to strip
 * @returns {string} Clean HTML content without markdown syntax
 */
export function stripMarkdown(content: string): string {
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
export function generateRandomColors() {
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
 * Generates a random Google search URL
 * @returns {string} A Google search URL with random search terms
 */
export function getRandomGoogleSearchUrl(): string {
  const randomWords = [
    "quantum physics",
    "ancient civilizations",
    "underwater photography",
    "space exploration",
    "neural networks",
    "tropical fruits",
    "vintage cars",
    "meditation techniques",
    "cooking recipes",
    "wildlife conservation",
    "artificial intelligence",
    "mountain climbing",
    "jazz music",
    "sustainable energy",
    "ocean depths",
    "forest ecosystems",
    "architecture design",
    "historical events",
    "creative writing",
    "digital art",
  ];
  const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
  const encoded = encodeURIComponent(randomWord);
  return `https://www.google.com/search?q=${encoded}`;
}

/**
 * Replaces all href attributes in HTML with random Google search URLs
 * @param {string} html - The HTML content to process
 * @returns {string} HTML with all links replaced with random Google searches
 */
export function replaceLinksWithRandomSearches(html: string): string {
  return html.replace(/href=["']([^"']+)["']/gi, () => {
    return `href="${getRandomGoogleSearchUrl()}"`;
  });
}

