/**
 * Componente per la preview del QR code generato.
 * 
 * Mostra l'anteprima del QR code e permette il download del risultato finale.
 * 
 * @param qrDataURL - Data URL del QR code generato
 * @param onDownload - Callback per il download del QR code
 * @param isLoading - Stato di caricamento durante la generazione
 */

'use client';

interface QRPreviewProps {
  qrDataURL: string | null;
  onDownload: () => void;
  isLoading: boolean;
}

export function QRPreview({ qrDataURL, onDownload, isLoading }: QRPreviewProps) {
  if (isLoading) {
    return (
      <div className="w-full border-2 border-gray-300 rounded-lg p-8 bg-gray-50 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-sm text-gray-600">Generazione QR code in corso...</p>
        </div>
      </div>
    );
  }

  if (!qrDataURL) {
    return (
      <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-500">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm">Il QR code generato apparirà qui</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border-2 border-gray-300 rounded-lg p-6 bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <img
            src={qrDataURL}
            alt="QR Code generato"
            className="max-w-full h-auto"
            style={{ maxWidth: '400px' }}
          />
        </div>
        <button
          type="button"
          onClick={onDownload}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          aria-label="Scarica QR code"
        >
          <span className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Scarica PNG
          </span>
        </button>
      </div>
    </div>
  );
}

