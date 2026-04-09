import "./globals.css";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StoreProvider } from "@/store/provider";
import UserProfile from "@/components/user-profile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secret Message - Secure & Self-Destructing Messages",
  description: "Safely share sensitive information with encrypted, self-destructing messages. Create a secret message and share it with a secure link that expires after it is read.",
  keywords: ["secret message", "encrypted messaging", "self-destructing messages", "secure sharing", "privacy", "secure notes"],
  authors: [{ name: "Secret Message Team" }],
  openGraph: {
    title: "Secret Message - Secure & Self-Destructing Messages",
    description: "Safely share sensitive information with encrypted, self-destructing messages.",
    url: "https://secret-message.vercel.app",
    siteName: "Secret Message",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Secret Message - Secure & Self-Destructing Messages",
    description: "Safely share sensitive information with encrypted, self-destructing messages.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Providers from "@/components/Providers";
import AuthGuard from "@/components/AuthGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  bg-[url('/assets/images/background.png')] bg-no-repeat light`}
      >
        <NextTopLoader
          showSpinner={false}
          easing="ease"
          color="#fff"
          height={3}
        />
        <Providers>
          <StoreProvider>
            <AuthGuard>
              {children}
              <UserProfile />
            </AuthGuard>
          </StoreProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
