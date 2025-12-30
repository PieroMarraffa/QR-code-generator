/**
 * Componente principale per la generazione di QR code.
 * 
 * Orchestra tutti i componenti e funzionalità per permettere all'utente di:
 * - Inserire testo/URL da codificare
 * - Caricare un'icona personalizzata
 * - Configurare parametri del QR code
 * - Generare e scaricare il risultato
 * 
 * Utilizza l'hook useQRGenerator per la logica di business.
 */

'use client';

import { useQRGenerator } from '@/hooks/useQRGenerator';
import { IconUploader } from './IconUploader';
import { QRPreview } from './QRPreview';

export function QRGenerator() {
  const {
    data,
    config,
    icon,
    generatedQR,
    isLoading,
    error,
    updateData,
    updateConfig,
    loadIcon,
    removeIcon,
    generateQR,
    downloadQR,
  } = useQRGenerator();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Generatore QR Code
        </h1>
        <p className="text-gray-600">
          Crea QR code personalizzati con icona centrale
        </p>
      </div>

      {/* Form di input */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Input testo/URL */}
        <div>
          <label
            htmlFor="qr-data"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Testo o URL da codificare *
          </label>
          <input
            id="qr-data"
            type="text"
            value={data}
            onChange={(e) => updateData(e.target.value)}
            placeholder="https://example.com o qualsiasi testo"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            aria-required="true"
            aria-label="Inserisci testo o URL per il QR code"
          />
        </div>

        {/* Upload icona */}
        <IconUploader
          icon={icon}
          onLoadIcon={loadIcon}
          onRemoveIcon={removeIcon}
        />

        {/* Configurazioni avanzate (collassabili) */}
        <details className="border border-gray-200 rounded-lg p-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
            Configurazioni Avanzate
          </summary>
          <div className="mt-4 space-y-4">
            {/* Box Size */}
            <div>
              <label
                htmlFor="box-size"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Dimensione Box: {config.boxSize}px
              </label>
              <input
                id="box-size"
                type="range"
                min="5"
                max="20"
                value={config.boxSize}
                onChange={(e) =>
                  updateConfig({ boxSize: parseInt(e.target.value, 10) })
                }
                className="w-full"
                aria-label="Dimensione box QR code"
              />
            </div>

            {/* Border */}
            <div>
              <label
                htmlFor="border"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bordo: {config.border} moduli
              </label>
              <input
                id="border"
                type="range"
                min="1"
                max="10"
                value={config.border}
                onChange={(e) =>
                  updateConfig({ border: parseInt(e.target.value, 10) })
                }
                className="w-full"
                aria-label="Spessore bordo QR code"
              />
            </div>

            {/* Error Correction Level */}
            <div>
              <label
                htmlFor="error-correction"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Livello Correzioni Errore
              </label>
              <select
                id="error-correction"
                value={config.errorCorrectionLevel}
                onChange={(e) =>
                  updateConfig({
                    errorCorrectionLevel: e.target.value as typeof config.errorCorrectionLevel,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                aria-label="Livello correzione errore"
              >
                <option value="L">L - Basso (~7%)</option>
                <option value="M">M - Medio (~15%)</option>
                <option value="Q">Q - Quartile (~25%)</option>
                <option value="H">H - Alto (~30%)</option>
              </select>
            </div>

            {/* Colori */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fill-color"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Colore QR Code
                </label>
                <input
                  id="fill-color"
                  type="color"
                  value={config.fillColor}
                  onChange={(e) => updateConfig({ fillColor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  aria-label="Colore QR code"
                />
              </div>
              <div>
                <label
                  htmlFor="back-color"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Colore Sfondo
                </label>
                <input
                  id="back-color"
                  type="color"
                  value={config.backColor}
                  onChange={(e) => updateConfig({ backColor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  aria-label="Colore sfondo"
                />
              </div>
            </div>
          </div>
        </details>

        {/* Messaggio errore */}
        {error && (
          <div
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        {/* Pulsante generazione */}
        <button
          type="button"
          onClick={generateQR}
          disabled={isLoading || !data.trim()}
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          aria-label="Genera QR code"
        >
          {isLoading ? 'Generazione...' : 'Genera QR Code'}
        </button>
      </div>

      {/* Preview e download */}
      <QRPreview
        qrDataURL={generatedQR}
        onDownload={downloadQR}
        isLoading={isLoading}
      />
    </div>
  );
}

