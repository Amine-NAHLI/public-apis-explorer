import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Public APIs Explorer - The Definitive Directory",
  description: "Integrate the best public APIs into your next project. Zero friction, instant search, and unified specifications. 1,742 APIs indexed & verified.",
  keywords: ["APIs", "Public API", "Developer tools", "API Directory", "Integration"],
  authors: [{ name: "Amine NAHLI" }],
  openGraph: {
    title: "Public APIs Explorer",
    description: "The definitive directory to find and integrate the best public APIs.",
    url: "https://public-apis-explorer.vercel.app",
    siteName: "Public APIs Explorer",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Public APIs Explorer",
    description: "The definitive directory to find and integrate the best public APIs.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
