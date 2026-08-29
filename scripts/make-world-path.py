"""
Builds src/data/world.ts: the world coastline as one SVG path, for the tour map.

Source is Natural Earth 1:110m land, public domain, taken from the world-atlas
TopoJSON. The file is fetched once into the system temp directory; nothing is
added to the project's dependencies for a build step that runs about never.

    python3 scripts/make-world-path.py

Choices worth knowing before changing them:

  * Plate carree with a standard parallel of 30 degrees: longitude is scaled by
    cos(30), latitude is not. Unscaled the world comes out 2.5 wide to 1 tall
    and everything on it looks squashed. Scaled it is 2.2 to 1, which is the
    proportion the drawn map had, measured off it. Still two multiplications
    rather than a library.
  * Cropped at 84N and 60S, the way every web world map crops Antarctica.
  * Simplified at 0.07 degrees. Coarser reads as lumpy at the width this
    renders, which is most of the difference between a map and a blob.
  * Islands under 0.5 square degrees are dropped. Coarser loses the British
    Isles and Japan, which are on a map anyone recognises.
"""
import json
import math
import urllib.request
from pathlib import Path
from tempfile import gettempdir

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'src' / 'data' / 'world.ts'
SRC = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json'
CACHE = Path(gettempdir()) / 'land-110m.json'

LAT_TOP, LAT_BOTTOM = 84.0, -56.0
# cos(45 degrees). The standard parallel: distances along it are true, and the
# world is 1.77 wide to 1 tall instead of 2.5.
LON_SCALE = math.cos(math.radians(30))
WIDTH = 360.0 * LON_SCALE
EPS = 0.07
MIN_AREA = 0.5

if not CACHE.exists():
    print(f'fetching {SRC}')
    urllib.request.urlretrieve(SRC, CACHE)

topo = json.loads(CACHE.read_text())
scale_x, scale_y = topo['transform']['scale']
tx, ty = topo['transform']['translate']

arcs = []
for arc in topo['arcs']:
    x = y = 0
    points = []
    for dx, dy in arc:
        x += dx
        y += dy
        points.append((x * scale_x + tx, y * scale_y + ty))
    arcs.append(points)


def ring(indexes):
    out = []
    for i in indexes:
        arc = arcs[~i][::-1] if i < 0 else arcs[i]
        out.extend(arc if not out else arc[1:])
    return out


def project(point):
    return ((point[0] + 180.0) * LON_SCALE, LAT_TOP - point[1])


def simplify_open(seq, eps):
    """Douglas-Peucker over an open polyline."""
    if len(seq) < 3:
        return seq
    keep = {0, len(seq) - 1}
    stack = [(0, len(seq) - 1)]
    while stack:
        a, b = stack.pop()
        if b <= a + 1:
            continue
        (x1, y1), (x2, y2) = seq[a], seq[b]
        ax, ay = x2 - x1, y2 - y1
        norm = math.hypot(ax, ay) or 1e-9
        best, best_i = 0.0, a
        for i in range(a + 1, b):
            x, y = seq[i]
            dist = abs(ay * x - ax * y + x2 * y1 - y2 * x1) / norm
            if dist > best:
                best, best_i = dist, i
        if best > eps:
            keep.add(best_i)
            stack.append((a, best_i))
            stack.append((best_i, b))
    return [seq[i] for i in sorted(keep)]


def simplify_ring(points, eps):
    """A closed ring is split at the point farthest from the first before it is
    simplified. Run over the ring as given, every distance is measured to a
    zero-length baseline (first point equals last), so the whole ring collapses
    to nothing."""
    if len(points) < 4:
        return points
    if points[0] == points[-1]:
        points = points[:-1]
    x0, y0 = points[0]
    far = max(range(len(points)), key=lambda i: (points[i][0] - x0) ** 2 + (points[i][1] - y0) ** 2)
    return simplify_open(points[:far + 1], eps) + simplify_open(points[far:], eps)[1:]


def cut_antimeridian(points):
    """Split a ring where it crosses 180 degrees, and close each piece along the
    edge of the map.

    Eurasia's ring runs off the right edge in Chukotka and comes back on the
    left. Projected as one polyline, that step draws a straight line across the
    whole map at 65N, which is the horizontal stripe this exists to remove."""
    closed = points + [points[0]]
    pieces, current = [], [closed[0]]
    for prev, cur in zip(closed, closed[1:]):
        if abs(cur[0] - prev[0]) > 180 * LON_SCALE:
            y = (prev[1] + cur[1]) / 2
            leaving = WIDTH if prev[0] > cur[0] else 0.0
            current.append((leaving, y))
            pieces.append(current)
            current = [(WIDTH - leaving, y), cur]
        else:
            current.append(cur)
    pieces.append(current)
    # The ring is circular, so the run that wrapped past the start belongs to
    # the piece that begins there.
    if len(pieces) > 1 and pieces[-1][-1] == pieces[0][0]:
        pieces[0] = pieces[-1][:-1] + pieces[0]
        pieces.pop()
    return [piece for piece in pieces if len(piece) >= 3]


def area(points):
    total = 0.0
    for i in range(len(points)):
        x1, y1 = points[i]
        x2, y2 = points[(i + 1) % len(points)]
        total += x1 * y2 - x2 * y1
    return abs(total) / 2


height = LAT_TOP - LAT_BOTTOM
paths = []
for geometry in topo['objects']['land']['geometries']:
    polygons = geometry['arcs'] if geometry['type'] == 'MultiPolygon' else [geometry['arcs']]
    for polygon in polygons:
        for indexes in polygon:
            points = [project(p) for p in ring(indexes)]
            if area(points) < MIN_AREA:
                continue
            if min(y for _, y in points) > height:
                continue
            for piece in cut_antimeridian(simplify_ring(points, EPS)):
                out, last = [], None
                for x, y in piece:
                    rounded = (round(x, 1), round(min(max(y, -2), height + 2), 1))
                    if rounded != last:
                        out.append(rounded)
                        last = rounded
                if len(out) < 3:
                    continue
                paths.append('M' + ' '.join(f'{x},{y}' for x, y in out) + 'Z')

path = ''.join(paths)
OUT.write_text(f"""/**
 * The world, as one SVG path, for the tour map.
 *
 * Natural Earth 1:110m land (public domain), via the world-atlas TopoJSON,
 * projected equirectangular and simplified with Douglas-Peucker at {EPS} map
 * units. Antarctica is cropped the way every web world map crops it, and
 * islands under {MIN_AREA} square units are dropped: at the size this renders they
 * were single grey pixels.
 *
 * Coordinates are degrees, with longitude scaled by cos(45) so the world is
 * not squashed, and shifted so the path starts at 0,0:
 *   x = (longitude + 180) * {LON_SCALE:.6f}   (0..{WIDTH:.1f})
 *   y = {LAT_TOP:.0f} - latitude                  (0..{height:.0f})
 *
 * Generated by scripts/make-world-path.py. Do not edit by hand.
 */

export const WORLD_VIEWBOX = '0 0 {WIDTH:.1f} {height:.0f}';
export const WORLD_TOP_LAT = {LAT_TOP:.0f};
/** cos(45 degrees): the standard parallel longitude is scaled by. */
export const WORLD_LON_SCALE = {LON_SCALE:.6f};

/** Map coordinates for a latitude and longitude, in the viewBox above. */
export function project(lat: number, lon: number): {{ x: number; y: number }} {{
  return {{ x: (lon + 180) * WORLD_LON_SCALE, y: WORLD_TOP_LAT - lat }};
}}

export const WORLD_PATH =
  '{path}';
""")
print(f'wrote {OUT.relative_to(ROOT)}: {len(paths)} rings, {len(path) // 1024} kB of path')
