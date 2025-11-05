"use client";

import { useState, useEffect } from "react";

/**
 * Loading spinner component
 * @returns {JSX.Element} A spinning loader
 */
function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-600 dark:border-zinc-800 dark:border-t-zinc-400" />
      </div>
    </div>
  );
}

/**
 * Client component that generates website content based on URL slug using OpenRouter.ai
 * Shows a loading spinner immediately while content is being generated
 * @param {Object} props - Component props
 * @param {string} props.topicSlug - The topic slug from the URL
 * @returns {JSX.Element} The rendered content or loading state
 */
export default function SlugContentGenerator({
  topicSlug,
}: {
  topicSlug: string;
}) {
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const generateContent = async () => {
      try {
        const response = await fetch("/api/generate-slug", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topicSlug,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate content");
        }

        const data = await response.json();
        setGeneratedContent(data.content);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to generate content"
        );
      } finally {
        setIsLoading(false);
      }
    };

    generateContent();
  }, [topicSlug]);

  if (isLoading) {
    return <LoadingSpinner />;
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
