import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "PressZero: Zero-Knowledge Exact-KB Image Compressor",
  description:
    "Compress images to exact target KBs (e.g. 20 KB, 50 KB, 4 KB) with 100% client-side zero-knowledge privacy. Built for NTA UGC-NET, UPSC, US Visa, signatures, and web vitals.",
  keywords: [
    "image compressor to kb",
    "reduce image size in kb",
    "compress image to 50kb",
    "compress image to 20kb",
    "signature compressor nta",
    "ugc net signature compressor",
    "zero knowledge image compressor",
    "client side image compression",
    "upsc photo signature resize",
    "us visa photo 600x600 240kb",
    "exact kb reducer online",
    "free image compression without upload",
  ],
  authors: [{ name: "PressZero Engineering" }],
  creator: "PressZero",
  metadataBase: new URL("https://presszero.app"),
  alternates: {
    canonical: "https://presszero.app",
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
    title: "PressZero — Zero-Knowledge Exact-KB Image Reducer",
    description:
      "Target any exact size in KBs. 100% on-device WebAssembly & Canvas engine. Zero server uploads. Perfect for exam and visa portals.",
    url: "https://presszero.app",
    siteName: "PressZero",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PressZero — Zero-Knowledge Exact-KB Image Compressor",
    description: "Compress images to exact KBs with zero server uploads.",
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
        "@type": "WebApplication",
        "name": "PressZero",
        "url": "https://presszero.app",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "All modern browsers (WebAssembly, Canvas, Web Workers)",
        "browserRequirements": "Requires HTML5 Canvas and JavaScript",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "100% client-side image compression tool to reduce images to exact KB sizes with zero-knowledge privacy.",
        "featureList": [
          "Exact target KB compression using dual-axis binary search",
          "Zero server uploads: 100% in-browser processing via Web Workers",
          "Signature and scanned document contrast enhancer",
          "One-click exam portal presets (NTA, UPSC, US Visa)",
          "Batch processing with in-memory ZIP export",
          "Offline Progressive Web App (PWA) support",
        ],
      },
      {
        "@type": "HowTo",
        "name": "How to compress an image to exact KB with zero server uploads",
        "description": "Step-by-step guide to compress any photo or signature to an exact file size ceiling in kilobytes without uploading files to remote servers.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Set target size or choose a portal preset",
            "text": "Choose your exact target kilobyte limit (such as 20 KB for UPSC or 50 KB for NTA) or click a calibrated portal preset.",
          },
          {
            "@type": "HowToStep",
            "name": "Drop or paste your image",
            "text": "Drag and drop your image directly onto the canvas, browse from your local device, or paste from clipboard using Ctrl+V.",
          },
          {
            "@type": "HowToStep",
            "name": "Compare quality with split wipe or 800% loupe",
            "text": "Drag the interactive split wipe to compare compression quality side-by-side or launch the 800% pixel loupe.",
          },
          {
            "@type": "HowToStep",
            "name": "Save sanitized image",
            "text": "Download the compressed output file instantly. All GPS metadata, camera identifiers, and EXIF traces are purged by default.",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Are my uploaded photos or signatures saved on any server?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. PressZero is 100% client-side. All processing occurs inside your web browser via HTML5 Canvas, WebAssembly, and Web Workers. Zero bytes are uploaded to any server or database.",
            },
          },
          {
            "@type": "Question",
            "name": "How does PressZero achieve exact file sizes like 20 KB or 50 KB?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "PressZero uses a dual-axis binary search algorithm that bisects quality and adaptively downscales resolution to achieve the exact target byte limit within 1% tolerance.",
            },
          },
          {
            "@type": "Question",
            "name": "Can multiple users use PressZero at the same time without server lag?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Because PressZero uses decentralized client compute, all image processing occurs on each user's local device hardware (CPU/GPU). The server only delivers static bundles, enabling infinite concurrent scalability with zero server bottlenecks.",
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
            "item": "https://presszero.app",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Studio Workbench",
            "item": "https://presszero.app/#studio",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Portal Specifications",
            "item": "https://presszero.app/#portal-matrix",
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
