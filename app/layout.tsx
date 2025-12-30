import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Generatore QR Code',
  description: 'Crea QR code personalizzati con icona centrale',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

