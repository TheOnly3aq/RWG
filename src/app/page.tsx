import ContentGenerator from "./components/ContentGenerator";

/**
 * Server component that renders the content generator client component
 * This allows the page to load instantly while content generates in the background
 * @returns {JSX.Element} The rendered page component
 */
export default function Home() {
  return <ContentGenerator />;
}
