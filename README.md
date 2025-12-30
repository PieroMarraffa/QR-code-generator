# Generatore QR Code Web

Applicazione web React/TypeScript per generare QR code personalizzati con icona centrale, convertita dal generatore Python originale.

## Caratteristiche

- ✅ Generazione QR code da testo o URL
- ✅ Icona personalizzata al centro del QR code
- ✅ Configurazioni avanzate (dimensione, bordo, correzione errori, colori)
- ✅ Download del risultato in formato PNG
- ✅ Interfaccia responsive e accessibile
- ✅ Generazione completamente client-side (nessun server richiesto)

## Stack Tecnologico

- **Framework**: Next.js 14 con App Router
- **Linguaggio**: TypeScript
- **Styling**: Tailwind CSS
- **QR Code**: Libreria `qrcode` (npm)
- **Image Processing**: Canvas API nativo del browser
- **Deployment**: Compatibile con EAS, Vercel, Netlify

## Struttura Progetto

```
qr-code-generator-web/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Pagina principale
│   ├── layout.tsx         # Layout base
│   └── globals.css        # Stili globali Tailwind
├── src/
│   ├── components/
│   │   ├── QRGenerator.tsx    # Componente principale
│   │   ├── QRPreview.tsx      # Preview QR code
│   │   └── IconUploader.tsx    # Upload icona
│   ├── hooks/
│   │   └── useQRGenerator.ts  # Hook logica generazione
│   ├── utils/
│   │   └── qrUtils.ts         # Utility funzioni
│   └── types/
│       └── qr.types.ts         # TypeScript types
├── public/
│   └── image.png          # Icona di default (opzionale)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── eas.json               # Configurazione EAS
```

## Installazione

1. **Clona o naviga nella directory del progetto**

```bash
cd "QR-code generator"
```

2. **Installa le dipendenze**

```bash
npm install
```

## Sviluppo Locale

Avvia il server di sviluppo:

```bash
npm run dev
```

L'applicazione sarà disponibile su [http://localhost:3000](http://localhost:3000)

## Build per Produzione

### Build Standard Next.js

```bash
npm run build
npm start
```

### Build con EAS (Expo Application Services)

Per deploy su EAS, assicurati di avere EAS CLI installato:

```bash
npm install -g eas-cli
eas login
eas build --platform web --profile production
```

## Deployment

### Opzione 1: Vercel (Consigliato per Next.js)

1. Push del codice su GitHub
2. Importa il progetto su [Vercel](https://vercel.com)
3. Vercel rileverà automaticamente Next.js e configurerà il deploy

### Opzione 2: Netlify

1. Push del codice su GitHub
2. Crea un nuovo sito su [Netlify](https://netlify.com)
3. Configura il build command: `npm run build`
4. Publish directory: `.next`

### Opzione 3: EAS

1. Installa EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Build: `eas build --platform web --profile production`
4. Deploy: Segui le istruzioni EAS per l'hosting

## Utilizzo

1. **Inserisci il testo o URL** da codificare nel QR code
2. **Carica un'icona** (opzionale) che verrà posizionata al centro
3. **Configura i parametri** avanzati se necessario:
   - Dimensione box
   - Spessore bordo
   - Livello correzione errori
   - Colori personalizzati
4. **Clicca "Genera QR Code"**
5. **Scarica il risultato** in formato PNG

## Conversione da Python

Questa applicazione web replica la funzionalità del generatore Python originale:

| Python | JavaScript/TypeScript |
|--------|----------------------|
| `qrcode.QRCode()` | `qrcode.toCanvas()` |
| `PIL.Image` | Canvas API |
| `Image.resize()` | `canvas.drawImage()` con scaling |
| `paste()` | Composizione su canvas |
| `save()` | `canvas.toBlob()` + download |

### Parametri Default

- **Version**: 4
- **Error Correction**: H (alta correzione ~30%)
- **Box Size**: 10px
- **Border**: 4 moduli
- **Icona**: 25% del QR code (equivalente a `// 4` in Python)

## Architettura

### Separazione Responsabilità

- **Components**: UI pura, presentazione
- **Hooks**: Logica di business e stato
- **Utils**: Funzioni pure, manipolazione dati
- **Types**: Definizioni TypeScript centralizzate

### Flusso Generazione

1. Utente inserisce dati e configurazione
2. `useQRGenerator` hook gestisce lo stato
3. `qrUtils` genera QR code su canvas
4. Se presente icona, viene caricata e composta
5. Risultato convertito in data URL per preview
6. Download triggerato via canvas.toBlob()

## Compatibilità Browser

- Chrome/Edge (ultime 2 versioni)
- Firefox (ultime 2 versioni)
- Safari (ultime 2 versioni)

Richiede supporto per:
- Canvas API
- File API
- ES6+ JavaScript

## Limitazioni

- Generazione client-side: limitata dalla memoria del browser
- Dimensioni canvas: alcuni browser hanno limiti (tipicamente 16k x 16k pixel)
- File icona: max 5MB

## Troubleshooting

### Errore "Cannot find module '@/...'"

Verifica che `tsconfig.json` abbia la configurazione corretta per i path aliases:

```json
"paths": {
  "@/*": ["./*"]
}
```

### QR code non si genera

- Verifica che il testo/URL non sia vuoto
- Controlla la console del browser per errori
- Assicurati che le dipendenze siano installate correttamente

### Icona non appare

- Verifica che il file sia un'immagine valida (PNG, JPG, GIF)
- Controlla che la dimensione del file non superi 5MB
- Verifica supporto trasparenza per PNG

## Licenza

Questo progetto è stato creato come conversione del generatore Python originale.

## Supporto

Per problemi o domande, apri una issue sul repository GitHub.

