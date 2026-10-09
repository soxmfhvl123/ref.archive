import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ref. archive',
  description: '아카이브는 침묵하고, 레퍼런스만 말하게 합니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full bg-white text-black antialiased">
      <body className="min-h-full bg-white text-black font-sans selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
