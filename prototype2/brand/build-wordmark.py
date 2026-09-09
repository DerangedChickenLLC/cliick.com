"""
CLIICK -- all caps, thin, dotted I's.

Brief: kill the Cl -> d ligature-by-accident, keep it thin and crisp
(Poppins register: true circles, monolinear, plumb-cut terminals, open
counters), and keep the double-i legible as two letters.

Caps solve the "d" outright -- an L has a foot and cannot close a bowl. The
tittles then do two jobs at once: they are the ownable anomaly (a capital I
has no tittle, so one is unmistakably deliberate) and they keep LII from
reading as three identical pickets.
"""
import math

def pol(cx, cy, r, deg):
    a = math.radians(deg)
    return (cx + r * math.cos(a), cy - r * math.sin(a))

def f(p):
    return "%.2f %.2f" % p


def glyph_C(x, base, cap, w, aperture, ov, cut="vertical"):
    ro = cap / 2.0 + ov
    ri = ro - w
    cx, cy = x + ro, base - cap / 2.0
    if cut == "vertical":
        # Plumb terminals, as Poppins cuts them. Thin strokes make this easy:
        # ri sits close to ro, so the cut line still crosses the counter at a
        # much tighter aperture than a heavy weight would allow.
        xc = min(cx + ro * math.cos(math.radians(aperture)), cx + ri * 0.985)
        to = math.degrees(math.acos((xc - cx) / ro))
        ti = math.degrees(math.acos((xc - cx) / ri))
    else:
        to = ti = aperture
    o1, o2 = pol(cx, cy, ro, to), pol(cx, cy, ro, -to)
    i1, i2 = pol(cx, cy, ri, ti), pol(cx, cy, ri, -ti)
    return ("M %s A %.2f %.2f 0 1 0 %s L %s A %.2f %.2f 0 1 1 %s Z"
            % (f(o1), ro, ro, f(o2), f(i2), ri, ri, f(i1))), ro * 2.0


def rect(x, y, w, h):
    return "M %.2f %.2f H %.2f V %.2f H %.2f Z" % (x, y, x + w, y + h, x)


def glyph_L(x, base, cap, w, width):
    return [rect(x, base - cap, w, cap), rect(x + w, base - w, width - w, w)], width


def glyph_I(x, base, cap, w):
    return rect(x, base - cap, w, cap), w


def glyph_K(x, base, cap, w, width, junction, diag_w, kick):
    st = rect(x, base - cap, w, cap)

    def bar(x_out, y_edge, up):
        dx = x_out - (x + w)
        dy = y_edge - (base - junction)
        ve = diag_w * math.hypot(dx, dy) / abs(dx)
        a, b = (y_edge, y_edge + ve) if up else (y_edge - ve, y_edge)
        yj = base - junction
        return ("M %.2f %.2f L %.2f %.2f L %.2f %.2f L %.2f %.2f Z"
                % (x_out, a, x + w, yj - ve / 2.0, x + w, yj + ve / 2.0, x_out, b))

    # The leg kicks out past the arm. Aligning them read as an accident at 4
    # units; either commit to the kick or square it off exactly.
    return [st, bar(x + width, base - cap, True),
            bar(x + width + kick, base, False)], width + kick


def dot(cx, cy, r):
    return ("M %.2f %.2f a %.2f %.2f 0 1 0 %.2f 0 a %.2f %.2f 0 1 0 %.2f 0 Z"
            % (cx - r, cy, r, r, r * 2, r, r, -r * 2))


def build(weight=9.0, aperture=40.0, ov=1.2, track=0.0, dot_scale=1.7,
          dot_gap=15.0, cap=100.0, l_width=50.0, k_width=56.0, kick=6.0,
          k_junction=0.50):
    PAD = 18.0
    W = weight
    r = W * dot_scale / 2.0
    BASE = PAD + cap + dot_gap + r * 2          # room for the tittles on top
    y_dot = BASE - cap - dot_gap - r

    # Per-glyph sidebearings. The C's mouth opens right, so it needs a stem's
    # worth less air on that side or the word falls into pieces.
    C_L, C_R = 6.0 + track, 2.0 + track
    S = 9.0 + track                              # plain stems
    L_R = 5.0 + track                            # after the L's foot

    ink, dots, centres, pen = [], [], [], PAD

    pen += C_L
    d, adv = glyph_C(pen, BASE, cap, W, aperture, ov)
    ink.append(d); pen += adv + C_R

    pen += S
    ps, adv = glyph_L(pen, BASE, cap, W, l_width)
    ink += ps; pen += adv + L_R

    for _ in range(2):
        pen += S
        p, adv = glyph_I(pen, BASE, cap, W)
        ink.append(p); centres.append(pen + W / 2.0)
        pen += adv + S

    dots += [dot(c, y_dot, r) for c in centres]

    pen += C_L
    d, adv = glyph_C(pen, BASE, cap, W, aperture, ov)
    ink.append(d); pen += adv + C_R

    pen += S
    ps, adv = glyph_K(pen, BASE, cap, W, k_width, cap * k_junction, W * 0.95, kick)
    ink += ps; pen += adv + S

    return dict(ink=ink, dots=dots, w=pen + PAD, h=BASE + PAD, base=BASE,
                centres=centres, r=r, y_dot=y_dot)


def svg(spec, ink_colour="#F2ECDE", dot_colour=None):
    dc = dot_colour or ink_colour
    # data-capmid is where the cap band's centre sits as a fraction of the box.
    # The box is taller than the caps because the tittles live above them, so
    # centring the box against an icon drops the letters low -- consumers need
    # the cap centre, not the box centre, to build a balanced lockup.
    p = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.1f %.1f" '
         'data-capmid="%.4f" role="img" aria-label="CLIICK">'
         % (spec["w"], spec["h"], (spec["base"] - 50.0) / spec["h"]),
         '<g fill="%s">' % ink_colour]
    p += ['<path d="%s"/>' % d for d in spec["ink"]]
    p.append('</g><g fill="%s">' % dc)
    p += ['<path d="%s"/>' % d for d in spec["dots"]]
    p.append("</g></svg>")
    return "".join(p)


DIRECTIONS = {
    # The brief, executed straight.
    "caps":    dict(weight=9.0,  aperture=40, track=0.0, dot_scale=1.7),
    # Lighter and tracked open: the elegant register.
    "open":    dict(weight=7.5,  aperture=42, track=7.0, dot_scale=1.9,
                    dot_gap=18.0),
    # The pair carries the mark.
    "dotfwd":  dict(weight=9.0,  aperture=40, track=1.0, dot_scale=2.5,
                    dot_gap=13.0),
}

# The "open" register, pushed. Weight falls, tracking opens, and dot_scale
# rises to compensate -- a dot sized as a fixed multiple of a shrinking stem
# vanishes, so the multiple has to grow just to hold the dots at roughly
# constant absolute size against the hairlines.
#
# Tracking is added uniformly, which preserves the C's kern in absolute terms:
# its mouth contributes a fixed ~11 units of white regardless of tracking, so
# the correction stays a flat 7 units tighter than a stem pair rather than
# scaling away.
# H2 is the chosen register. A 5.5% stem cannot hold at nav or favicon size, so
# it needs a second optical cut: heavier stem, marginally more tracking and a
# slightly smaller dot multiple, tuned to match H2's colour rather than its
# measurements. Same skeleton, so the two are unmistakably one mark.
CUTS = {
    "h2":       dict(weight=5.5, aperture=44, track=17.0, dot_scale=2.30, dot_gap=23.0),
    "h2-small": dict(weight=8.0, aperture=43, track=19.0, dot_scale=1.75, dot_gap=20.0),
}

LADDER = {
    "h0": dict(weight=7.5, aperture=42, track=7.0,  dot_scale=1.90, dot_gap=18.0),
    "h1": dict(weight=6.5, aperture=43, track=12.0, dot_scale=2.05, dot_gap=20.0),
    "h2": dict(weight=5.5, aperture=44, track=17.0, dot_scale=2.30, dot_gap=23.0),
    "h3": dict(weight=4.5, aperture=45, track=23.0, dot_scale=2.80, dot_gap=26.0),
}

if __name__ == "__main__":
    import os, json
    out = os.path.dirname(os.path.abspath(__file__))
    meta = {}
    for k, kw in list(DIRECTIONS.items()) + list(LADDER.items()) + list(CUTS.items()):
        s = build(**kw)
        open(os.path.join(out, "cliick-%s.svg" % k), "w").write(svg(s))
        meta[k] = dict(w=round(s["w"], 1), h=round(s["h"], 1),
                       stem_ratio=round(kw["weight"] / 100.0, 3))
    print(json.dumps(meta, indent=2))
