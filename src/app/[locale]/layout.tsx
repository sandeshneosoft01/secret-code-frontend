import { Metadata } from "next";
import { Open_Sans, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/store/provider";
import UserProfile from "@/components/user-profile";
import Providers from "@/components/Providers";
import AuthGuard from "@/components/AuthGuard";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Secret Message - Secure & Self-Destructing Messages",
    template: "%s | Secret Message",
  },
  description: "Safely share sensitive information with encrypted, self-destructing messages. End-to-end encrypted, secure, and privacy-focused.",
  keywords: ["secret message", "encrypted chat", "self-destructing messages", "secure sharing", "privacy", "ephemeral messaging"],
  authors: [{ name: "Secret Message Team" }],
  creator: "Secret Message Team",
  publisher: "Secret Message Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://secret-code-v1.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "hi-IN": "/hi",
    },
  },
  openGraph: {
    title: "Secret Message - Secure & Self-Destructing Messages",
    description: "Safely share sensitive information with encrypted, self-destructing messages.",
    url: "https://secret-code-v1.vercel.app",
    siteName: "Secret Message",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Secret Message Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Secret Message - Secure & Self-Destructing Messages",
    description: "Safely share sensitive information with encrypted, self-destructing messages.",
    images: ["/icon.png"],
    creator: "@secretmessage",
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
  icons: {
    icon: [
      {
        url: "/icon-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: "/icon-light.svg",
    apple: "/icon-light.svg",
  },
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'hi' }];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${openSans.variable} ${geistMono.variable} antialiased dark:bg-none transition-colors duration-300`}
      >
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none dark:hidden">
          <Image
            src="/assets/images/background.png"
            alt="Background"
            fill
            className="object-cover"
            priority={false}
          />
        </div>
        <NextTopLoader
          showSpinner={false}
          easing="ease"
          color="#fff"
          height={3}
        />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <StoreProvider>
              <AuthGuard>
                {children}
                <UserProfile />
              </AuthGuard>
            </StoreProvider>
          </Providers>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
