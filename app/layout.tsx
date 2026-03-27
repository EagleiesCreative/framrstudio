import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Syne, Outfit } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Framr Studio — Photobooth Software for Modern Businesses',
  description:
    'The all-in-one platform for startups and studios launching, growing, and automating photobooth services.',
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable}`}>
      <body>
        {clerkEnabled ? <ClerkProvider>{children}</ClerkProvider> : children}
      </body>
    </html>
  );
}
