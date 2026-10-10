import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://soxmfhvl123.github.io/ref.archive';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'ref. archive',
  description: '디자이너를 위한 웹·그래픽·인터랙티브 레퍼런스 아카이브',
  openGraph: {
    title: 'ref. archive',
    description: '디자이너를 위한 웹·그래픽·인터랙티브 레퍼런스 아카이브',
    url: siteUrl,
    siteName: 'ref. archive',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'ref. archive — arranged by studiofluxus™',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ref. archive',
    description: '디자이너를 위한 웹·그래픽·인터랙티브 레퍼런스 아카이브',
    images: [`${siteUrl}/og-image.png`],
  },
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
