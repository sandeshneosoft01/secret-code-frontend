import { Metadata } from "next";
import { Open_Sans, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/store/provider";
import UserProfile from "@/components/user-profile";
import Providers from "@/components/Providers";
import AuthGuard from "@/components/AuthGuard";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import "../globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secret Message - Secure & Self-Destructing Messages",
  description: "Safely share sensitive information with encrypted, self-destructing messages.",
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
        className={`${openSans.variable} ${geistMono.variable} antialiased bg-[url('/assets/images/background.png')] bg-no-repeat dark:bg-none transition-colors duration-300`}
      >
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
