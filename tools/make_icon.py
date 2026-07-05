from PIL import Image
import sys

src = Image.open(r"C:\Users\arnal\Downloads\USMLE1.png").convert("RGBA")
w, h = src.size
px = src.load()

# The corners are pure/near-black (the rounded-square badge sits on a black
# canvas). Flood-fill from the 4 corners so we only clear the connected
# background, not any dark pixels that are part of the badge artwork itself.
BLACK_THRESH = 40  # max channel value to be considered "background black"

def is_bg(r, g, b, a):
    return r <= BLACK_THRESH and g <= BLACK_THRESH and b <= BLACK_THRESH

visited = bytearray(w * h)
stack = []
for x in range(w):
    stack.append((x, 0)); stack.append((x, h - 1))
for y in range(h):
    stack.append((0, y)); stack.append((w - 1, y))

while stack:
    x, y = stack.pop()
    if x < 0 or y < 0 or x >= w or y >= h:
        continue
    idx = y * w + x
    if visited[idx]:
        continue
    r, g, b, a = px[x, y]
    if not is_bg(r, g, b, a):
        continue
    visited[idx] = 1
    px[x, y] = (0, 0, 0, 0)
    stack.append((x + 1, y)); stack.append((x - 1, y))
    stack.append((x, y + 1)); stack.append((x, y - 1))

src.save(r"C:\Users\arnal\Desktop\Documentos\IA\USMLE-Step-1\app\icons\icon-source-transparent.png")
print("done", src.size)
