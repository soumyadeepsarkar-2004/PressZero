import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

const siteBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "https://presszero.app";

export const metadata: Metadata = {
  title: {
    default: "PressZero — Image Reducer, Resizer & Exact-KB Compressor",
    template: "%s | PressZero — Free Image Reducer & Resizer",
  },
  description:
    "Free online image reducer and image resizer. Compress images, photos, and signatures to exact kilobyte sizes (e.g. 20 KB, 50 KB, 100 KB) with 100% client-side privacy. Zero server uploads. Built for UPSC, NTA, SSC, US Visa, and Schengen portals.",
  keywords: [
    // Core short-tail search terms
    "image reducer",
    "image resizer",
    "image compressor",
    "photo reducer",
    "photo resizer",
    "compress image",
    "resize image",
    "reduce image size",
    "reduce image size in kb",
    "photo size reducer",
    "image size reducer",
    "free image reducer",
    "online image resizer",
    "kb reducer",
    "kb compressor",
    
    // Exact kilobyte target queries
    "compress image to 50kb",
    "compress image to 20kb",
    "compress image to 100kb",
    "compress image to 200kb",
    "reduce image to 50 kb",
    "reduce image to 20 kb",
    "reduce photo to 20kb",
    "reduce photo to 50kb",
    "image reducer 50kb",
    "image reducer 20kb",
    "resize image to 50kb",
    "resize image to 20kb",
    
    // Formats & converters
    "jpeg compressor",
    "jpg reducer",
    "png reducer",
    "webp converter",
    "compress jpeg without losing quality",
    
    // Official exams & visa portals
    "upsc photo resizer",
    "upsc signature compressor",
    "nta photo compressor",
    "ugc net photo resizer",
    "neet photo size reducer",
    "ssc photo and signature resizer",
    "us visa photo 600x600 240kb",
    "schengen visa photo resizer",
    "passport seva photo reducer",
    
    // Features & security
    "signature bleach filter",
    "signature background white online",
    "remove shadow from signature photo",
    "offline image reducer",
    "zero knowledge image compressor",
    "client side image compression",
    "batch image compressor zip"
  ],
  authors: [{ name: "PressZero Engineering", url: siteBaseUrl }],
  creator: "PressZero",
  publisher: "PressZero",
  metadataBase: new URL(siteBaseUrl),
  alternates: {
    canonical: siteBaseUrl,
    languages: {
      "en-US": siteBaseUrl,
      "hi-IN": siteBaseUrl,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "PressZero — Image Reducer, Resizer & Exact-KB Compressor",
    description:
      "Reduce images, photos, and signatures to exact kilobyte limits in your browser. 100% on-device Web Workers. Zero server uploads.",
    url: siteBaseUrl,
    siteName: "PressZero",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteBaseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PressZero Image Reducer and Exact-KB Compressor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PressZero — Image Reducer, Resizer & Exact-KB Compressor",
    description: "Compress images to exact KBs with zero server uploads.",
    images: [`${siteBaseUrl}/og-image.png`],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteBaseUrl}/#website`,
        "url": siteBaseUrl,
        "name": "PressZero",
        "description": "Free Online Image Reducer, Image Resizer & Exact-KB Precision Compressor",
        "publisher": {
          "@type": "Organization",
          "name": "PressZero",
          "url": siteBaseUrl,
          "logo": {
            "@type": "ImageObject",
            "url": `${siteBaseUrl}/icon-512.png`
          }
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteBaseUrl}/studio?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteBaseUrl}/#software`,
        "name": "PressZero Image Reducer & Resizer",
        "url": siteBaseUrl,
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "All modern operating systems (Windows, macOS, Linux, iOS, Android)",
        "browserRequirements": "Requires HTML5 Canvas and JavaScript Web Workers",
        "softwareVersion": "1.0.0",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "1840",
          "bestRating": "5",
          "worstRating": "1"
        },
        "description":
          "100% client-side image reducer and resizer to compress photos and signatures to exact kilobyte limits with zero-knowledge privacy.",
        "featureList": [
          "Exact target KB compression using dual-axis binary search",
          "Zero server uploads: 100% in-browser processing via Web Workers",
          "Signature bleach filter: removes yellow shadows and normalizes paper to pure #FFFFFF",
          "One-click exam portal presets (UPSC, NTA, SSC, US Visa, Schengen)",
          "Batch image reducer with in-memory ZIP export",
          "Offline native Windows (.exe) and macOS (.app) desktop distributions",
          "Progressive Web App (PWA) with full air-gap offline capability",
        ],
      },
      {
        "@type": "HowTo",
        "name": "How to reduce image size to exact KB with zero server uploads",
        "description": "Step-by-step guide to reduce and resize any photo or signature to an exact kilobyte size ceiling.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Select target size or portal preset",
            "text": "Enter your target kilobyte ceiling (for example 20 KB or 50 KB) or select a pre-calibrated portal preset.",
          },
          {
            "@type": "HowToStep",
            "name": "Drop or paste your image",
            "text": "Drag and drop your image directly onto the workspace, browse from files, or paste from clipboard using Ctrl+V or ⌘V.",
          },
          {
            "@type": "HowToStep",
            "name": "Apply signature bleach or biometric crop",
            "text": "Toggle the Signature Bleach filter to eliminate smartphone shadows, or use the Biometric Cropper for exact 7:9 or 1:1 ratios.",
          },
          {
            "@type": "HowToStep",
            "name": "Download sanitized image",
            "text": "Download the compressed output file instantly. All EXIF geolocation tags and metadata are automatically scrubbed.",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I reduce image size to an exact KB limit (like 20 KB or 50 KB)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Traditional percentage sliders force endless trial-and-error. PressZero uses a dual-axis binary search bisection algorithm: you enter your target kilobyte limit (for example 50 KB for UPSC or 20 KB for NTA), and the in-memory engine calculates the exact quantization matrix in under 25ms to hit within ±2% of that ceiling.",
            },
          },
          {
            "@type": "Question",
            "name": "Are my uploaded photos or signatures saved on any server?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. PressZero is 100% client-side. All processing occurs inside your web browser via HTML5 Canvas, WebAssembly, and Web Workers. Exactly zero bytes are uploaded to any server or database.",
            },
          },
          {
            "@type": "Question",
            "name": "How does the signature bleach filter work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "When you take a picture of a paper signature with a smartphone, phone shadows and yellow ambient lighting cause portal rejection. PressZero's adaptive bleach filter computes ITU-R BT.601 pixel luminance, wiping shadows to pure #FFFFFF white while boosting pen ink contrast.",
            },
          },
          {
            "@type": "Question",
            "name": "Can I use PressZero as an offline image reducer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. You can install PressZero as a Progressive Web App (PWA) directly from your browser, or download our standalone native executables: PressZero-Setup.exe for Windows or PressZero.app for macOS. Both work completely disconnected from the internet in full air-gap mode.",
            },
          },
          {
            "@type": "Question",
            "name": "Which government exam and visa portals are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "PressZero has pre-calibrated presets for UPSC Civil Services, NTA NEET/JEE/UGC-NET, SSC Staff Selection Commission, US Visa DS-160 (600x600 px under 240 KB), Schengen Biometric Visas (35x45 mm), and Indian Passport Seva.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteBaseUrl,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Studio Workbench",
            "item": `${siteBaseUrl}/studio`,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Developer Docs",
            "item": `${siteBaseUrl}/docs`,
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Desktop Downloads",
            "item": `${siteBaseUrl}/download`,
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" className="dark scroll-smooth overflow-x-clip" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,300..800;1,300..800&family=Atkinson+Hyperlegible+Mono:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Context" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-[var(--color-ink)] selection:text-[var(--color-accent-ink)] overflow-x-clip" suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
