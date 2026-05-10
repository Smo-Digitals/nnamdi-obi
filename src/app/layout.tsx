import type { Metadata } from 'next';
import { Montserrat, DM_Mono } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

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
    <html lang="en" className={`${montserrat.variable} ${dmMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#0a0a0a] text-[#f0ede8]">
        {children}
      </body>
    </html>
  );
}
