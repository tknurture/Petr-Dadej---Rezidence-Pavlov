import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rezidence Pavlov 163 | Petr Dadej',
  description: 'Výjimečná rezidence nad Mohelnicí s výhledem na Bouzov a Praděd. 10 000 m² pozemku, absolutní soukromí. Hektar vlastního světa.',
  openGraph: {
    title: 'Rezidence Pavlov 163',
    description: 'Výjimečná rezidence nad Mohelnicí. Hektar vlastního světa.',
    images: ['/images/zasilka/DJI_20260305151656_0025_D-HDR.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
