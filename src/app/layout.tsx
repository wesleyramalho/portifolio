import type { Metadata } from "next";
import { Montserrat_Alternates, Orbitron } from "next/font/google";
import "./globals.css";
import FluidCanvas from "@/components/fluid/FluidCanvas";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat-alt",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
});

const siteUrl = "https://wesleyramalho.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Wesley Ramalho — Senior Software Engineer & AI Specialist",
    template: "%s | Wesley Ramalho",
  },
  description:
    "Portfolio of Wesley Ramalho — Senior Software Engineer with 9+ years in React, JavaScript, and AI-powered web applications. Frontend specialist & AI consultant.",
  keywords: [
    "Wesley Ramalho",
    "Senior Software Engineer",
    "AI Specialist",
    "React Developer",
    "Frontend Engineer",
    "JavaScript",
    "TypeScript",
    "Next.js",
  ],
  authors: [{ name: "Wesley Ramalho", url: siteUrl }],
  creator: "Wesley Ramalho",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Wesley Ramalho — Senior Software Engineer & AI Specialist",
    description:
      "Frontend specialist with 9+ years building scalable web applications with React, TypeScript, and AI-powered tools.",
    siteName: "Wesley Ramalho Portfolio",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Wesley Ramalho — Senior Software Engineer",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wesley Ramalho — Senior Software Engineer & AI Specialist",
    description:
      "Frontend specialist with 9+ years building scalable web applications.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserratAlternates.variable} ${orbitron.variable}`}
    >
      <body className="antialiased bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Wesley Ramalho",
              url: siteUrl,
              jobTitle: "Senior Software Engineer",
              description:
                "Senior Software Engineer & AI Specialist with 9+ years of experience in React, JavaScript, and web applications.",
              knowsAbout: [
                "React",
                "JavaScript",
                "TypeScript",
                "Next.js",
                "AI",
                "Frontend Engineering",
              ],
              alumniOf: [
                {
                  "@type": "CollegeOrUniversity",
                  name: "PUC Minas",
                },
                {
                  "@type": "CollegeOrUniversity",
                  name: "IFSP - Instituto Federal de Educação, Ciência e Tecnologia de São Paulo",
                },
              ],
            }),
          }}
        />
        <FluidCanvas />
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
