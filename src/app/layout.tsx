import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import "./globals.css";
import FluidCanvas from "@/components/fluid/FluidCanvas";
import { LocaleProvider } from "@/contexts/LocaleContext";
import IntlProvider from "@/components/IntlProvider";

const montserratAlternates = localFont({
  src: [
    { path: "../../public/fonts/montserrat-alternates-400.woff2", weight: "400" },
    { path: "../../public/fonts/montserrat-alternates-600.woff2", weight: "600" },
    { path: "../../public/fonts/montserrat-alternates-700.woff2", weight: "700" },
  ],
  variable: "--font-montserrat-alt",
  display: "swap",
});

const orbitron = localFont({
  src: [
    { path: "../../public/fonts/orbitron-400-700.woff2", weight: "400" },
    { path: "../../public/fonts/orbitron-400-700.woff2", weight: "700" },
  ],
  variable: "--font-orbitron",
  display: "swap",
});

const SITE_URL = "https://wesleyramalho.com";
const SITE_TITLE = "Wesley Ramalho — Senior Software Engineer & AI Specialist";
const SITE_DESCRIPTION =
  "Portfolio of Wesley Ramalho — Senior Software Engineer with 9+ years in React, JavaScript, and AI-powered web applications. Frontend specialist & AI consultant.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Wesley Ramalho",
  },
  description: SITE_DESCRIPTION,
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
  authors: [{ name: "Wesley Ramalho", url: SITE_URL }],
  creator: "Wesley Ramalho",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_TITLE,
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
    title: SITE_TITLE,
    description:
      "Frontend specialist with 9+ years building scalable web applications.",
    images: ["/opengraph-image"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <html
      lang="en"
      className={`${montserratAlternates.variable} ${orbitron.variable}`}
    >
      <body className="antialiased bg-background text-foreground">
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Wesley Ramalho",
              url: SITE_URL,
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
        <LocaleProvider>
          <IntlProvider>
            <FluidCanvas />
            <main id="main-content">{children}</main>
          </IntlProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
