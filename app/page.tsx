import { QRGenerator } from '@/components/QRGenerator';

/**
 * Pagina principale dell'applicazione.
 * 
 * Renderizza il componente QRGenerator che contiene tutta la logica
 * per la generazione di QR code personalizzati.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <QRGenerator />
    </main>
  );
}

