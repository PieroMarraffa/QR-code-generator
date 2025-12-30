/**
 * Componente per il caricamento dell'icona personalizzata.
 * 
 * Permette all'utente di caricare un'immagine che verrà posizionata al centro
 * del QR code generato. Supporta drag & drop e validazione del file.
 * 
 * @param icon - Configurazione icona corrente
 * @param onLoadIcon - Callback quando un'icona viene caricata
 * @param onRemoveIcon - Callback per rimuovere l'icona
 */

'use client';

import { useCallback, useRef, useState } from 'react';
import type { IconConfig } from '@/types/qr.types';

interface IconUploaderProps {
  icon: IconConfig;
  onLoadIcon: (file: File) => Promise<void>;
  onRemoveIcon: () => void;
}

export function IconUploader({ icon, onLoadIcon, onRemoveIcon }: IconUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Gestisce il caricamento del file selezionato.
   */
  const handleFileSelect = useCallback(
    async (file: File | null) => {
      if (!file) return;
      try {
        await onLoadIcon(file);
      } catch (err) {
        // Errore già gestito nello hook
      }
    },
    [onLoadIcon]
  );

  /**
   * Gestisce il click sul pulsante di upload.
   */
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Gestisce la selezione file dall'input.
   */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      handleFileSelect(file);
    },
    [handleFileSelect]
  );

  /**
   * Gestisce il drag over per evidenziare l'area di drop.
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  /**
   * Gestisce il drag leave.
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  /**
   * Gestisce il drop del file.
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Icona Centrale (opzionale)
      </label>

      {icon.previewUrl ? (
        // Preview icona caricata
        <div className="relative border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <img
                src={icon.previewUrl}
                alt="Icona caricata"
                className="w-20 h-20 object-contain rounded"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                {icon.file?.name || 'Icona caricata'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Dimensione: {icon.sizePercent}% del QR code
              </p>
            </div>
            <button
              type="button"
              onClick={onRemoveIcon}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
              aria-label="Rimuovi icona"
            >
              Rimuovi
            </button>
          </div>
        </div>
      ) : (
        // Area di upload
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
            }
          `}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
          aria-label="Carica icona"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Seleziona file icona"
          />
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Clicca per caricare</span> o trascina qui
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF fino a 5MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

