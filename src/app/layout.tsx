import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { DM_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Nnamdi Obi',
  description:
    "Nigerian entrepreneur, founder, and writer. Building the infrastructure of Africa's future.",
  openGraph: {
    title: 'Nnamdi Obi',
    description: 'Founder. Writer. Builder.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#0a0a0a] text-[#f0ede8]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
