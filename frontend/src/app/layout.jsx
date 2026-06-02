import './globals.css';

export const metadata = {
  title: "EKOPIX — India's Anime Music Experience",
  description: "India's first anime music band — blending original Hindi and English songs with anime-style animation and storytelling.",
  keywords: 'EKOPIX, anime music, India, Hindi songs, anime band',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning style={{ margin: 0, backgroundColor: '#000000', color: '#f0f0f0', overflowX: 'clip' }}>
        {children}
      </body>
    </html>
  );
}
