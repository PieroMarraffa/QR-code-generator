/**
 * Type definitions per il generatore di QR code.
 * Definisce le interfacce e i tipi utilizzati nell'applicazione.
 */

/**
 * Livelli di correzione d'errore per il QR code.
 * Equivalente a qrcode.constants.ERROR_CORRECT_* in Python.
 */
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/**
 * Configurazione per la generazione del QR code.
 * Mappa i parametri del generatore Python in formato TypeScript.
 */
export interface QRCodeConfig {
  /** Versione del QR code (1-40). Version=4 nel codice Python originale. */
  version?: number;
  /** Livello di correzione d'errore. Default: 'H' (alta correzione). */
  errorCorrectionLevel: ErrorCorrectionLevel;
  /** Dimensione di ogni box/modulo del QR code in pixel. Default: 10. */
  boxSize: number;
  /** Spessore del bordo in moduli. Default: 4. */
  border: number;
  /** Colore di riempimento del QR code. Default: 'black'. */
  fillColor: string;
  /** Colore di sfondo del QR code. Default: 'white'. */
  backColor: string;
}

/**
 * Configurazione per l'icona centrale.
 */
export interface IconConfig {
  /** File immagine caricato dall'utente. */
  file: File | null;
  /** URL dell'immagine per preview. */
  previewUrl: string | null;
  /** Dimensione dell'icona come percentuale del QR code (20-25%). */
  sizePercent: number;
}

/**
 * Stato completo del generatore QR code.
 */
export interface QRGeneratorState {
  /** Testo o URL da codificare nel QR code. */
  data: string;
  /** Configurazione del QR code. */
  config: QRCodeConfig;
  /** Configurazione dell'icona. */
  icon: IconConfig;
  /** Data URL del QR code generato (per preview e download). */
  generatedQR: string | null;
  /** Stato di caricamento durante la generazione. */
  isLoading: boolean;
  /** Eventuale messaggio di errore. */
  error: string | null;
}

