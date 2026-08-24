"""
Builds the /webinar Open Graph card.

A shared link is often the first thing anyone sees of this session, and until now
it unfurled the generic platform card: right brand, nothing about the webinar.
What sells a webinar is who is on it and when, so the card leads with the title
and puts the three faces and the date where a thumbnail-sized crop still shows
them.

Brand assets are the real ones: the crest from src/icons/visdom-crest.svg (the
official lockup), Geist for the wordmark and headings, and the site's own dark
palette, so the card and the page it links to look like the same product.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = sys.argv[1] if len(sys.argv) > 1 else str(ROOT / 'public' / 'og-webinar.png')

# Title, date and roster are read from the same file the page renders from, so
# the card cannot drift from the page. Parsed rather than imported because this
# is Python reading TypeScript; the patterns are narrow and fail loudly.
WEB = (ROOT / 'src' / 'data' / 'webinar.ts').read_text()
def one(pattern, what):
    m = re.search(pattern, WEB)
    if not m:
        raise SystemExit(f'make-og-webinar: could not read {what} from src/data/webinar.ts')
    return m.group(1)

TITLE = one(r"title:\s*'([^']+)'", 'the webinar title')
STARTS_AT = one(r"startsAt:\s*'([^']+)'", 'the start time')
TZ = one(r"timezone:\s*'([^']+)'", 'the timezone')
TZ_LABEL = one(r"timezoneLabel:\s*'([^']+)'", 'the timezone label')
MINUTES = one(r'durationMinutes:\s*(\d+)', 'the duration')

from datetime import datetime
from zoneinfo import ZoneInfo
_local = datetime.fromisoformat(STARTS_AT.replace('Z', '+00:00')).astimezone(ZoneInfo(TZ))
WHEN = f"{_local.day} {_local:%B %Y}  ·  {_local:%H:%M} {TZ_LABEL}  ·  {MINUTES} minutes"

ROSTER = [
    (ROOT / 'public' / m.group(3).lstrip('/'), m.group(1), m.group(2))
    for m in re.finditer(
        r"name:\s*'([^']+)',\s*\n\s*role:\s*'([^']*)',\s*\n\s*company:[^\n]*"
        r"[\s\S]*?photo:\s*'([^']+)'",
        WEB[WEB.index('export const SPEAKERS'):],
    )
]
if len(ROSTER) != 3:
    raise SystemExit(f'make-og-webinar: expected 3 speakers, parsed {len(ROSTER)}')

# The crest is the official lockup asset and carries currentColor, so it is
# recoloured for a dark card before rasterising.
_svg = (ROOT / 'src' / 'icons' / 'visdom-crest.svg').read_text().replace('currentColor', '#e5e8eb')
_tmp = Path(tempfile.mkdtemp())
(_tmp / 'crest.svg').write_text(_svg)
subprocess.run(['rsvg-convert', '-h', '120', str(_tmp / 'crest.svg'), '-o', str(_tmp / 'crest.png')], check=True)
S = str(_tmp)

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

img = Image.new('RGB', (W, H), BG)

# Ambient emerald glow, same gesture the page uses behind its hero.
glow = Image.new('RGB', (W, H), BG)
gd = ImageDraw.Draw(glow)
gd.ellipse((-260, 170, 700, 1130), fill=(10, 40, 30))
gd.ellipse((820, -300, 1560, 440), fill=(9, 30, 24))
img = Image.blend(img, glow.filter(ImageFilter.GaussianBlur(150)), 0.9)
d = ImageDraw.Draw(img)

def tracked(draw, xy, text, font, fill, tracking=0):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x

# ── Lockup: crest + wordmark ────────────────────────────────────────────────
crest = Image.open(f'{S}/crest.png').convert('RGBA')
ch = 62
crest = crest.resize((max(1, round(crest.width * ch / crest.height)), ch), Image.LANCZOS)
img.paste(crest, (PAD, PAD - 6), crest)
wx = PAD + crest.width + 18
d.text((wx, PAD + 6), 'Visdom', font=sans('Bold', 44), fill=TEXT)
wend = wx + d.textlength('Visdom', font=sans('Bold', 44))
badge = '2.0'
bf = mono('Medium', 20)
bw = d.textlength(badge, font=bf) + 22
d.rounded_rectangle((wend + 16, PAD + 16, wend + 16 + bw, PAD + 48), 8,
                    fill=(13, 40, 32), outline=(52, 211, 153, 60))
d.text((wend + 27, PAD + 21), badge, font=bf, fill=EMERALD)

# ── Eyebrow ─────────────────────────────────────────────────────────────────
y = 208
tracked(d, (PAD, y), 'LIVE WEBINAR', mono('Bold', 22), EMERALD, tracking=3.2)

# ── Title ───────────────────────────────────────────────────────────────────
title = TITLE
# Shrink to fit rather than trusting one hardcoded size: the title comes from
# WEBINAR.title and a longer one would otherwise run off the right edge.
size = 76
while size > 40:
    tf = sans('Bold', size)
    if d.textlength(title, font=tf) <= W - PAD * 2:
        break
    size -= 2
d.text((PAD, y + 44), title, font=tf, fill=TEXT)

# ── When ────────────────────────────────────────────────────────────────────
when = WHEN
d.text((PAD, y + 148), when, font=sans('Medium', 27), fill=SECONDARY)

# ── Speakers ────────────────────────────────────────────────────────────────
people = ROSTER
D = 104
top = 452
gap = 34
x = PAD
mask = Image.new('L', (D, D), 0)
ImageDraw.Draw(mask).ellipse((0, 0, D - 1, D - 1), fill=255)
nf = sans('SemiBold', 24)


def row_width(font):
    """Width of the whole speaker row, ignoring the trailing gap after the last."""
    total = sum(
        D + 18 + max(d.textlength(n, font=nf), d.textlength(r, font=font)) + gap + 12
        for _, n, r in people
    )
    return total - (gap + 12)


# The second line is the speaker's position, not their employer, matching the
# Sequel cover. Roles run far wider than company names ("Head of Application
# Development" against "VirtusLab"), so the type is shrunk until three of them
# fit between the margins instead of running off the right edge.
csize = 21
while csize > 15 and row_width(sans('Regular', csize)) > W - PAD * 2:
    csize -= 1
cf = sans('Regular', csize)
for path, name, role in people:
    p = Image.open(path).convert('RGB').resize((D, D), Image.LANCZOS)
    img.paste(p, (x, top), mask)
    d.ellipse((x, top, x + D - 1, top + D - 1), outline=(255, 255, 255, 40), width=2)
    tx = x + D + 18
    d.text((tx, top + 26), name, font=nf, fill=TEXT)
    if role:
        d.text((tx, top + 58), role, font=cf, fill=SECONDARY)
    x = round(tx + max(d.textlength(name, font=nf), d.textlength(role, font=cf)) + gap + 12)

img.save(OUT, quality=92, optimize=True)
print('zapisano', OUT, img.size)
