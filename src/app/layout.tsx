import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Movie Scene Generator',
  description: 'Transform your creative ideas into stunning cinematic experiences with AI-generated scripts and videos.',
  keywords: ['AI', 'movie', 'video generation', 'script writing', 'cinema'],
  authors: [{ name: 'AI Movie Scene Generator' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}