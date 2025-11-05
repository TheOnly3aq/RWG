import SlugContentGenerator from "../components/SlugContentGenerator";

/**
 * Server component that renders the slug-based content generator client component
 * This allows the page to load instantly while content generates in the background
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
  const topicSlug = slug[slug.length - 1];

  return <SlugContentGenerator topicSlug={topicSlug} />;
}
