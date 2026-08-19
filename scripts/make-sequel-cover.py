"""
Builds the cover image uploaded to the Sequel event.

Sequel shows this card on the registration page, in the lobby before the room
opens, and wherever the event is shared, so it is the artwork most attendees see
first. It is the one asset that lives outside this repo, which is exactly how it
drifted: the page moved to 15:00 CEST and the uploaded cover kept saying 16:00.

So the card is generated here, from src/data/webinar.ts, the same file the page
renders from. Change the schedule in one place, run this, re-upload. The card
cannot disagree with the page again.

Output is 1920x1080, the 16:9 Sequel expects.

    python3 scripts/make-sequel-cover.py [out.png]
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import re
import subprocess
import sys
import tempfile
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
OUT = sys.argv[1] if len(sys.argv) > 1 else str(ROOT / 'public' / 'sequel-cover.png')

WEB = (ROOT / 'src' / 'data' / 'webinar.ts').read_text()


def one(pattern, what):
    m = re.search(pattern, WEB)
    if not m:
        raise SystemExit(f'make-sequel-cover: could not read {what} from src/data/webinar.ts')
    return m.group(1)


TITLE = one(r"title:\s*'([^']+)'", 'the webinar title')
STARTS_AT = one(r"startsAt:\s*'([^']+)'", 'the start time')
TZ = one(r"timezone:\s*'([^']+)'", 'the timezone')
TZ_LABEL = one(r"timezoneLabel:\s*'([^']+)'", 'the timezone label')
MINUTES = one(r'durationMinutes:\s*(\d+)', 'the duration')

# The brand line under the wordmark. Constant: it names the product owner, not
# whoever happens to be speaking.
BRAND = 'VirtusLab'

# The full roster, read from the SAME array the page and the Open Graph card
# render from. This card used to read the single `host` block instead, which is
# why it announced one speaker for a three-speaker session and disagreed with
# every other surface.
ROSTER = [
    (ROOT / 'public' / m.group(4).lstrip('/'), m.group(1), m.group(2), m.group(3))
    for m in re.finditer(
        r"name:\s*'([^']+)',\s*\n\s*role:\s*'([^']*)',\s*\n\s*company:\s*'([^']+)',"
        r"[\s\S]*?photo:\s*'([^']+)'",
        WEB[WEB.index('export const SPEAKERS'):],
    )
]
if not ROSTER:
    raise SystemExit('make-sequel-cover: could not read SPEAKERS from src/data/webinar.ts')

_local = datetime.fromisoformat(STARTS_AT.replace('Z', '+00:00')).astimezone(ZoneInfo(TZ))
WHEN = (
    f"{_local:%a}, {_local:%B} {_local.day}, {_local.year}"
    f"  ·  {_local:%H:%M} {TZ_LABEL}  ·  {MINUTES} min"
)

# The page sets the second half of the headline in the accent colour. The card
# does the same, and breaks the line at that point.
HEAD_LEAD, HEAD_ACCENT = (TITLE, '')
_split = re.search(r'\b(actually\b.*)$', TITLE)
if _split:
    HEAD_LEAD = TITLE[: _split.start()].strip()
    HEAD_ACCENT = _split.group(1).strip()

# The crest carries currentColor, so it is recoloured for a dark card before
# rasterising, the same way the Open Graph card does it.
_svg = (ROOT / 'src' / 'icons' / 'visdom-crest.svg').read_text().replace('currentColor', '#e5e8eb')
_tmp = Path(tempfile.mkdtemp())
(_tmp / 'crest.svg').write_text(_svg)
subprocess.run(
    ['rsvg-convert', '-h', '200', str(_tmp / 'crest.svg'), '-o', str(_tmp / 'crest.png')],
    check=True,
)

W, H = 1920, 1080
BG = (6, 7, 9)
TEXT = (229, 232, 235)
SECONDARY = (170, 176, 182)
MUTED = (128, 134, 140)
EMERALD = (52, 211, 153)
RULE = (38, 42, 46)
PAD = 132

F = str(ROOT / 'node_modules/geist/dist/fonts/geist-sans/Geist-%s.ttf')
M = str(ROOT / 'node_modules/geist/dist/fonts/geist-mono/GeistMono-%s.ttf')


def sans(style, size):
    return ImageFont.truetype(F % style, size)


def mono(style, size):
    return ImageFont.truetype(M % style, size)


img = Image.new('RGB', (W, H), BG)

# Ambient emerald glow, the same gesture the page uses behind its hero.
glow = Image.new('RGB', (W, H), BG)
gd = ImageDraw.Draw(glow)
gd.ellipse((-420, 250, 1120, 1790), fill=(10, 40, 30))
gd.ellipse((1310, -480, 2500, 710), fill=(9, 30, 24))
img = Image.blend(img, glow.filter(ImageFilter.GaussianBlur(240)), 0.9)
d = ImageDraw.Draw(img)


def tracked(draw, xy, text, font, fill, tracking=0):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x


# Lockup: crest, wordmark, attribution.
crest = Image.open(f'{_tmp}/crest.png').convert('RGBA')
ch = 74
crest = crest.resize((max(1, round(crest.width * ch / crest.height)), ch), Image.LANCZOS)
img.paste(crest, (PAD, PAD - 8), crest)
wx = PAD + crest.width + 22
d.text((wx, PAD), 'Visdom', font=sans('Bold', 54), fill=TEXT)
wend = wx + d.textlength('Visdom', font=sans('Bold', 54))
d.text((wend + 18, PAD + 18), f'by {BRAND}', font=sans('Regular', 30), fill=MUTED)

# Live badge.
y = 372
bf = mono('Bold', 26)
label = 'LIVE WEBINAR'
bw = d.textlength(label, font=bf) + 11 * (len(label) - 1) * 0 + 46
d.rounded_rectangle((PAD, y, PAD + bw + 26, y + 56), 28, fill=(13, 44, 34), outline=(20, 82, 62))
tracked(d, (PAD + 26, y + 13), label, bf, EMERALD, tracking=2.6)

# Headline, shrunk to fit rather than trusting one hardcoded size.
size = 118
while size > 60:
    hf = sans('Bold', size)
    widest = max(d.textlength(HEAD_LEAD, font=hf), d.textlength(HEAD_ACCENT, font=hf))
    if widest <= W - PAD * 2:
        break
    size -= 2
line_h = round(size * 1.06)
hy = y + 104
d.text((PAD, hy), HEAD_LEAD, font=hf, fill=TEXT)
if HEAD_ACCENT:
    d.text((PAD, hy + line_h), HEAD_ACCENT, font=hf, fill=EMERALD)

# When.
wy = hy + line_h * (2 if HEAD_ACCENT else 1) + 52
d.text((PAD, wy), WHEN, font=sans('Medium', 38), fill=SECONDARY)

# Speakers, under a hairline rule, as a row across the full width. The old
# single-line host sat on the left and left the right half of a 1920-wide card
# empty; three faces both fix the count and use the space.
ry = wy + 96
d.line((PAD, ry, W - PAD, ry), fill=RULE, width=2)

DIA = 132
top = ry + 46
slot = (W - PAD * 2) // len(ROSTER)
mask = Image.new('L', (DIA, DIA), 0)
ImageDraw.Draw(mask).ellipse((0, 0, DIA - 1, DIA - 1), fill=255)
nf, rf = sans('SemiBold', 36), sans('Regular', 27)
for i, (path, name, role, company) in enumerate(ROSTER):
    x = PAD + i * slot
    if path.exists():
        p_img = Image.open(path).convert('RGB').resize((DIA, DIA), Image.LANCZOS)
        img.paste(p_img, (x, top), mask)
        d.ellipse((x, top, x + DIA - 1, top + DIA - 1), outline=(255, 255, 255, 46), width=2)
        tx = x + DIA + 22
    else:
        tx = x
    # Name, role and company on their own lines. One line could not hold
    # "Head of Application Development, VirtusLab" inside a 552px column, and
    # shrinking it far enough to fit made it unreadable while dropping the role
    # left one speaker described differently from the other two. Stacking keeps
    # every speaker described the same way and nothing overflows.
    d.text((tx, top + 14), name, font=nf, fill=TEXT)
    # Each line is fitted to its own column. Without this the longest role
    # ("Head of Application Development") runs right into the next portrait.
    avail = slot - (tx - x) - 24
    ly = top + 60
    for part in ([role] if role else []) + [company]:
        psize = 27
        while psize > 20 and d.textlength(part, font=sans('Regular', psize)) > avail:
            psize -= 1
        d.text((tx, ly), part, font=sans('Regular', psize), fill=MUTED)
        ly += 38

img.save(OUT, quality=92, optimize=True)
print('zapisano', OUT, img.size)
