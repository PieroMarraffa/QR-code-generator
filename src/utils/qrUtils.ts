/**
 * Utility functions per la generazione e manipolazione di QR code.
 * Converte la logica Python in JavaScript utilizzando Canvas API e libreria qrcode.
 */

import QRCode from 'qrcode';
import type { QRCodeConfig, ErrorCorrectionLevel } from '@/types/qr.types';

/**
 * Converte il livello di correzione d'errore da stringa a formato qrcode.
 * Mapping: 'H' → ERROR_CORRECT_H (alta correzione, come nel codice Python).
 */
export function getErrorCorrectionLevel(level: ErrorCorrectionLevel): QRCode.QRCodeErrorCorrectionLevel {
  const mapping: Record<ErrorCorrectionLevel, QRCode.QRCodeErrorCorrectionLevel> = {
    L: 'L',
    M: 'M',
    Q: 'Q',
    H: 'H',
  };
  return mapping[level];
}

/**
 * Genera un QR code come canvas element.
 * Equivalente a qrcode.QRCode().make_image() in Python.
 * 
 * @param data - Testo o URL da codificare
 * @param config - Configurazione del QR code
 * @returns Promise che risolve con il canvas del QR code generato
 */
export async function generateQRCodeCanvas(
  data: string,
  config: QRCodeConfig
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  
  const qrOptions: QRCode.QRCodeRenderersOptions = {
    errorCorrectionLevel: getErrorCorrectionLevel(config.errorCorrectionLevel),
    width: config.boxSize * 100, // Dimensione approssimativa basata su boxSize
    margin: config.border,
    color: {
      dark: config.fillColor,
      light: config.backColor,
    },
  };

  // Se version è specificato, lo includiamo
  if (config.version) {
    qrOptions.version = config.version;
  }

  await QRCode.toCanvas(canvas, data, qrOptions);
  return canvas;
}

/**
 * Carica un'immagine da File e la converte in Image element.
 * Equivalente a PIL.Image.open() in Python.
 * 
 * @param file - File immagine da caricare
 * @returns Promise che risolve con l'elemento Image
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Ridimensiona un'immagine mantenendo le proporzioni.
 * Equivalente a Image.resize() con LANCZOS in Python.
 * 
 * @param image - Immagine da ridimensionare
 * @param targetSize - Dimensione target (larghezza e altezza)
 * @returns Canvas con l'immagine ridimensionata
 */
export function resizeImage(
  image: HTMLImageElement,
  targetSize: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Impossibile ottenere contesto canvas');
  }

  // Usa imageSmoothingEnabled per qualità simile a LANCZOS
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0, targetSize, targetSize);
  
  return canvas;
}

/**
 * Compone l'icona al centro del QR code.
 * Equivalente a qr_img.paste(icon, pos, icon) in Python.
 * 
 * @param qrCanvas - Canvas del QR code generato
 * @param iconCanvas - Canvas dell'icona ridimensionata
 * @returns Canvas con QR code e icona composti
 */
export function composeIconOnQR(
  qrCanvas: HTMLCanvasElement,
  iconCanvas: HTMLCanvasElement
): HTMLCanvasElement {
  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = qrCanvas.width;
  resultCanvas.height = qrCanvas.height;
  const ctx = resultCanvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Impossibile ottenere contesto canvas');
  }

  // Disegna il QR code come sfondo
  ctx.drawImage(qrCanvas, 0, 0);
  
  // Calcola la posizione centrale (equivalente a Python: (qr_width - icon_size) // 2)
  const x = (qrCanvas.width - iconCanvas.width) / 2;
  const y = (qrCanvas.height - iconCanvas.height) / 2;
  
  // Disegna l'icona al centro (con supporto trasparenza)
  ctx.drawImage(iconCanvas, x, y);
  
  return resultCanvas;
}

/**
 * Converte un canvas in data URL PNG.
 * Equivalente a qr_img.save() in Python.
 * 
 * @param canvas - Canvas da convertire
 * @param quality - Qualità (0-1), non applicabile per PNG
 * @returns Data URL del PNG
 */
export function canvasToDataURL(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}

/**
 * Triggera il download di un'immagine dal canvas.
 * 
 * @param canvas - Canvas da scaricare
 * @param filename - Nome del file da salvare
 */
export function downloadCanvas(canvas: HTMLCanvasElement, filename: string = 'qrcode.png'): void {
  canvas.toBlob((blob) => {
    if (!blob) {
      throw new Error('Impossibile creare blob dal canvas');
    }
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

