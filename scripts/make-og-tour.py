"""
Builds the /visdom-tour Open Graph card.

The page used to unfurl the generic platform card: right brand, nothing about
the tour. What a reader wants from a shared tour link is where we will be, so
the card leads with that and carries the map itself as the thumbnail.

Cities come from src/data/tour.ts, so the card cannot advertise a stop the
schedule no longer has. Brand assets are the real ones: the crest from
src/icons/visdom-crest.svg, Geist for the type, and the site's dark palette.

    python3 scripts/make-og-tour.py

Rerun it when the schedule or the map changes. The output is committed.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = sys.argv[1] if len(sys.argv) > 1 else str(ROOT / 'public' / 'og-visdom-tour.png')
MAP = ROOT / 'public' / 'tour-map.webp'

# Read the schedule the page renders from. Parsed rather than imported because
# this is Python reading TypeScript; the pattern is narrow and fails loudly.
TOUR = (ROOT / 'src' / 'data' / 'tour.ts').read_text()
BLOCK = TOUR[TOUR.index('export const TOUR_EVENTS'):TOUR.index('export type PastAppearance')]
CITIES = []
for m in re.finditer(r"city:\s*'([^']+)'", BLOCK):
    city = m.group(1)
    if city not in CITIES and city != 'Online':
        CITIES.append(city)
if len(CITIES) < 4:
    raise SystemExit(f'make-og-tour: parsed only {len(CITIES)} cities from src/data/tour.ts')

KINDS = set(re.findall(r"kind:\s*'(\w+)'", BLOCK))
STOPS = len(re.findall(r"\bcity:\s*'", BLOCK))

W, H = 1200, 630
BG = (6, 7, 9)
TEXT = (229, 232, 235)
SECONDARY = (180, 185, 190)
EMERALD = (52, 211, 153)
PAD = 72

F = str(ROOT / 'node_modules/geist/dist/fonts/geist-sans/Geist-%s.ttf')
M = str(ROOT / 'node_modules/geist/dist/fonts/geist-mono/GeistMono-%s.ttf')
def sans(style, size): return ImageFont.truetype(F % style, size)
def mono(style, size): return ImageFont.truetype(M % style, size)

# The crest carries currentColor, so it is recoloured for a dark card before
# rasterising.
_svg = (ROOT / 'src' / 'icons' / 'visdom-crest.svg').read_text().replace('currentColor', '#e5e8eb')
_tmp = Path(tempfile.mkdtemp())
(_tmp / 'crest.svg').write_text(_svg)
subprocess.run(['rsvg-convert', '-h', '120', str(_tmp / 'crest.svg'), '-o', str(_tmp / 'crest.png')], check=True)

img = Image.new('RGB', (W, H), BG)

# Ambient emerald glow, the same gesture the page uses behind its hero.
glow = Image.new('RGB', (W, H), BG)
gd = ImageDraw.Draw(glow)
gd.ellipse((-300, 120, 660, 1080), fill=(10, 40, 30))
gd.ellipse((780, -320, 1520, 420), fill=(9, 30, 24))
img = Image.blend(img, glow.filter(ImageFilter.GaussianBlur(150)), 0.9)
d = ImageDraw.Draw(img)

def tracked(draw, xy, text, font, fill, tracking=0):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x

# ── Lockup: crest + wordmark ────────────────────────────────────────────────
crest = Image.open(f'{_tmp}/crest.png').convert('RGBA')
ch = 62
crest = crest.resize((max(1, round(crest.width * ch / crest.height)), ch), Image.LANCZOS)
img.paste(crest, (PAD, PAD - 6), crest)
wx = PAD + crest.width + 18
d.text((wx, PAD + 6), 'Visdom', font=sans('Bold', 44), fill=TEXT)
wend = wx + d.textlength('Visdom', font=sans('Bold', 44))
bf = mono('Medium', 20)
bw = d.textlength('2.0', font=bf) + 22
d.rounded_rectangle((wend + 16, PAD + 16, wend + 16 + bw, PAD + 48), 8,
                    fill=(13, 40, 32), outline=(52, 211, 153, 60))
d.text((wend + 27, PAD + 21), '2.0', font=bf, fill=EMERALD)

# ── The map, as the thumbnail ───────────────────────────────────────────────
# Right half, on white, because the artwork is drawn on a white ground. Placed
# first so the text column knows how much room it has left.
MAP_X, MAP_W = 636, W - 636 - PAD
card_top, card_bottom = 214, 470
if MAP.exists():
    m = Image.open(MAP).convert('RGB')
    inner = MAP_W - 28
    m = m.resize((inner, round(m.height * inner / m.width)), Image.LANCZOS)
    card_h = m.height + 28
    card_top = round((H - card_h) / 2) + 46
    card = Image.new('RGB', (MAP_W, card_h), (255, 255, 255))
    card.paste(m, (14, 14))
    rounded = Image.new('L', card.size, 0)
    ImageDraw.Draw(rounded).rounded_rectangle((0, 0, card.width - 1, card.height - 1), 18, fill=255)
    img.paste(card, (MAP_X, card_top), rounded)
    card_bottom = card_top + card_h
else:
    print('make-og-tour: public/tour-map.webp is missing, the card ships without it')

# ── Eyebrow, title, stops ───────────────────────────────────────────────────
col = MAP_X - PAD - 40
y = 214
tracked(d, (PAD, y), 'VISDOM ON TOUR', mono('Bold', 22), EMERALD, tracking=3.2)

def wrap(text, font, width):
    lines, line = [], ''
    for word in text.split():
        probe = f'{line} {word}'.strip()
        if d.textlength(probe, font=font) <= width:
            line = probe
        else:
            lines.append(line)
            line = word
    return lines + [line] if line else lines

title = 'Where to meet us in 2026'
size = 62
while size > 38:
    tf = sans('Bold', size)
    if max(d.textlength(l, font=tf) for l in wrap(title, tf, col)) <= col:
        break
    size -= 2
ty = y + 46
for line in wrap(title, tf, col):
    d.text((PAD, ty), line, font=tf, fill=TEXT)
    ty += round(size * 1.12)

sub = f'{STOPS} stops: conferences, roundtables and one online session.'
sf = sans('Medium', 25)
ty += 10
for line in wrap(sub, sf, col):
    d.text((PAD, ty), line, font=sf, fill=SECONDARY)
    ty += 34

# The cities themselves, which is the one thing a tour card has to say. As many
# as fit on two lines, in schedule order, so the nearest stops are never the
# ones dropped.
cf = mono('Medium', 22)
ty += 18
line = ''
lines = []
for cityname in CITIES:
    probe = f'{line} · {cityname}' if line else cityname
    if d.textlength(probe, font=cf) <= col:
        line = probe
    else:
        lines.append(line)
        line = cityname
    if len(lines) == 2:
        break
if line and len(lines) < 2:
    lines.append(line)
for line in lines[:2]:
    d.text((PAD, ty), line, font=cf, fill=EMERALD)
    ty += 32

img.save(OUT, quality=92, optimize=True)
print('zapisano', OUT, img.size, f'{Path(OUT).stat().st_size // 1024} kB')
