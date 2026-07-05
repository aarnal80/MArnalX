from PIL import Image

base = "C:/Users/arnal/Desktop/Documentos/IA/USMLE-Step-1/app/icons/"
src = Image.open(base + "icon-source-transparent.png").convert("RGBA")

for size in (512, 192, 32, 16):
    im = src.resize((size, size), Image.LANCZOS)
    im.save(base + f"icon-{size}.png")

# favicon.ico with multiple embedded sizes (resized from the full-res source for quality)
src.save(base + "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

print("ok")
