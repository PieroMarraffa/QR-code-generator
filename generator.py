import qrcode
from PIL import Image

# URL del QR
data = "https://docs.google.com/forms/d/e/1FAIpQLSfzFHtZOu-X2-D2T1jkaa3mFSyXJ2KH8LgpbgreEGpfnc4g-A/viewform?pli=1"

# 1️⃣ Crea il QR con alta correzione d'errore
qr = qrcode.QRCode(
    version=4,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)
qr.add_data(data)
qr.make(fit=True)

qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGBA")

# 2️⃣ Carica l'icona
icon = Image.open("image.png").convert("RGBA")

# 3️⃣ Ridimensiona l'icona (20–25% del QR)
qr_width, qr_height = qr_img.size
icon_size = qr_width // 4
icon = icon.resize((icon_size, icon_size), Image.LANCZOS)

# 4️⃣ Calcola la posizione centrale
pos = (
    (qr_width - icon_size) // 2,
    (qr_height - icon_size) // 2
)

# 5️⃣ Incolla l'icona al centro
qr_img.paste(icon, pos, icon)

# 6️⃣ Salva
qr_img.save("qrcode_google_docs.png")

print("QR code generato con icona centrale ✅")