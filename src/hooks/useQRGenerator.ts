/**
 * Hook personalizzato per la gestione della generazione di QR code.
 * 
 * Gestisce lo stato completo del generatore, inclusi input utente, configurazione,
 * caricamento icona e generazione del QR code finale con icona centrale.
 * 
 * @returns Oggetto con stato e funzioni per gestire la generazione QR code
 */

import { useState, useCallback } from 'react';
import type { QRGeneratorState, QRCodeConfig, IconConfig } from '@/types/qr.types';
import {
  generateQRCodeCanvas,
  loadImageFromFile,
  resizeImage,
  composeIconOnQR,
  canvasToDataURL,
  downloadCanvas,
} from '@/utils/qrUtils';

/**
 * Configurazione di default per il QR code.
 * Replica i parametri del codice Python originale.
 * La versione viene calcolata automaticamente dalla libreria in base alla quantità di dati.
 */
const defaultQRConfig: QRCodeConfig = {
  // version non specificata: la libreria calcola automaticamente la versione necessaria
  errorCorrectionLevel: 'H',
  boxSize: 10,
  border: 4,
  fillColor: '#000000', // Nero in formato hex
  backColor: '#ffffff', // Bianco in formato hex
};

/**
 * Configurazione di default per l'icona.
 */
const defaultIconConfig: IconConfig = {
  file: null,
  previewUrl: null,
  sizePercent: 25, // 25% del QR code (equivalente a // 4 in Python)
};

/**
 * Hook principale per la generazione di QR code.
 */
export function useQRGenerator() {
  const [data, setData] = useState<string>('');
  const [config, setConfig] = useState<QRCodeConfig>(defaultQRConfig);
  const [icon, setIcon] = useState<IconConfig>(defaultIconConfig);
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Aggiorna il testo/URL da codificare nel QR code.
   */
  const updateData = useCallback((newData: string) => {
    setData(newData);
    setError(null);
  }, []);

  /**
   * Aggiorna la configurazione del QR code.
   */
  const updateConfig = useCallback((newConfig: Partial<QRCodeConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
    setError(null);
  }, []);

  /**
   * Carica un'icona da file e crea la preview.
   * Valida il formato e la dimensione del file.
   */
  const loadIcon = useCallback(async (file: File) => {
    try {
      // Validazione formato
      if (!file.type.startsWith('image/')) {
        throw new Error('Il file deve essere un\'immagine');
      }

      // Validazione dimensione (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('L\'immagine è troppo grande (max 5MB)');
      }

      const previewUrl = URL.createObjectURL(file);
      setIcon({
        file,
        previewUrl,
        sizePercent: defaultIconConfig.sizePercent,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento dell\'icona');
      throw err;
    }
  }, []);

  /**
   * Rimuove l'icona caricata.
   */
  const removeIcon = useCallback(() => {
    if (icon.previewUrl) {
      URL.revokeObjectURL(icon.previewUrl);
    }
    setIcon(defaultIconConfig);
    setError(null);
  }, [icon.previewUrl]);

  /**
   * Genera il QR code con eventuale icona centrale.
   * Replica la logica del codice Python:
   * 1. Crea il QR code
   * 2. Carica e ridimensiona l'icona (se presente)
   * 3. Compone icona al centro
   * 4. Converte in data URL per preview
   */
  const generateQR = useCallback(async () => {
    if (!data.trim()) {
      setError('Inserisci un testo o URL da codificare');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Genera il QR code base
      const qrCanvas = await generateQRCodeCanvas(data, config);

      let finalCanvas = qrCanvas;

      // 2. Se c'è un'icona, comporla al centro
      if (icon.file) {
        // Carica l'icona
        const iconImage = await loadImageFromFile(icon.file);
        
        // Calcola la dimensione dell'icona (percentuale del QR code)
        const iconSize = Math.floor((qrCanvas.width * icon.sizePercent) / 100);
        
        // Ridimensiona l'icona
        const resizedIcon = resizeImage(iconImage, iconSize);
        
        // Compone icona sul QR code
        finalCanvas = composeIconOnQR(qrCanvas, resizedIcon);
      }

      // 3. Converte in data URL per preview
      const dataURL = canvasToDataURL(finalCanvas);
      setGeneratedQR(dataURL);
    } catch (err) {
      let errorMessage = 'Errore nella generazione del QR code';
      
      if (err instanceof Error) {
        // Gestione specifica per errori di versione QR code
        if (err.message.includes('version') || err.message.includes('Minimum version')) {
          errorMessage = `La versione del QR code specificata (${config.version || 'non specificata'}) non è sufficiente per i dati inseriti. ` +
            'Lascia il campo "Versione QR Code" vuoto nelle configurazioni avanzate per calcolare automaticamente la versione corretta.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setGeneratedQR(null);
    } finally {
      setIsLoading(false);
    }
  }, [data, config, icon]);

  /**
   * Scarica il QR code generato come file PNG.
   */
  const downloadQR = useCallback(() => {
    if (!generatedQR) {
      setError('Nessun QR code generato da scaricare');
      return;
    }

    try {
      // Ricrea il canvas dal data URL per il download
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Impossibile ottenere contesto canvas');
      }

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        downloadCanvas(canvas, 'qrcode.png');
      };
      img.onerror = () => {
        setError('Errore nel caricamento dell\'immagine per il download');
      };
      img.src = generatedQR;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel download');
    }
  }, [generatedQR]);

  return {
    // Stato
    data,
    config,
    icon,
    generatedQR,
    isLoading,
    error,
    // Funzioni
    updateData,
    updateConfig,
    loadIcon,
    removeIcon,
    generateQR,
    downloadQR,
  };
}

