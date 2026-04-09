import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { FeatureGatedWidgets } from "@/components/feature-gated-widgets";
import { LocaleProvider } from "@/components/locale-provider";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spacehole Tech | Mrsan - Portfolio and Info",
  description:
    "Full-stack developer portfolio and micro-learning platform. Explore projects, browse code snippets, and learn modern web development.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <meta name="google-adsense-account" content="ca-pub-3325323133144165" />
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${ibmPlexMono.variable} antialiased`}>
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
        <LocaleProvider>
          <FeatureGatedWidgets />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
