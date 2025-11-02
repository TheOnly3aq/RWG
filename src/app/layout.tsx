import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Random Site",
  description: "Discover something new",
};

/**
 * Root layout component that wraps all pages
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The root layout with HTML structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={{ margin: 0, padding: 0, width: "100%", height: "100%" }}
    >
      <body style={{ margin: 0, padding: 0, width: "100%", height: "100%" }}>
        {children}
      </body>
    </html>
  );
}
