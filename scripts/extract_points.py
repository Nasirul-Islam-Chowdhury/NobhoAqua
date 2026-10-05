import json, re, sys
nb = json.load(open('../AstroAqua_Ocean_ML_Pipeline.ipynb'))
figs = []
for c in nb['cells']:
    for o in c.get('outputs', []):
        h = ''.join(o.get('data', {}).get('text/html', []))
        if 'Plotly.newPlot' in h:
            i = h.index('Plotly.newPlot(')
            j = h.index('[', i)
            dec = json.JSONDecoder()
            data, _ = dec.raw_decode(h[j:])
            figs.append(data)
print('figs', len(figs))
pfz, hsi, hab = figs[0], figs[1], figs[2]
# PFZ map: traces per PFZ_Class, customdata=[SST,Chl,HSI_Hilsa,HSI_Shrimp], hovertext=Location
# HAB scatter: traces per HAB_Alert, customdata=[Location,Salinity], x=SST,y=Chl,marker.size=Depth
pts = []
for t in pfz:
    for k in range(len(t['lat'])):
        pts.append(dict(lat=t['lat'][k], lon=t['lon'][k], location=t['hovertext'][k],
                        sst=t['customdata'][k][0], chl=t['customdata'][k][1],
                        hsiHilsa=t['customdata'][k][2], hsiShrimp=t['customdata'][k][3],
                        pfz=t['name']))
print(len(pts))
# attach HAB/salinity/depth by matching (location,sst,chl)
habrows = {}
for t in hab:
    for k in range(len(t['x'])):
        key = (t['customdata'][k][0], round(t['x'][k], 2), round(t['y'][k], 2))
        habrows.setdefault(key, []).append(dict(hab=t['name'], salinity=t['customdata'][k][1], depth=t['marker']['size'][k]))
for p in pts:
    key = (p['location'], round(p['sst'], 2), round(p['chl'], 2))
    p.update(habrows[key].pop(0))
# Tuna HSI: from box plot trace (ordered by location rows?) -- inspect
for t in hsi:
    print(t['name'], len(t['y']), t.get('x', [])[:2], t['y'][:3])
json.dump(pts, open('/tmp/pts_partial.json', 'w'))

# ---- reconstruct original order & Tuna HSI via (hilsa,shrimp) sequence matching
byclass = {}
for p in pts: byclass.setdefault(p['pfz'], []).append(p)
H = hsi[0]['y']; T = hsi[1]['y']; S = hsi[2]['y']
ptr = {c: 0 for c in byclass}
ordered = []; amb = 0
for k in range(len(H)):
    cands = [c for c in byclass if ptr[c] < len(byclass[c]) and byclass[c][ptr[c]]['hsiHilsa'] == H[k] and byclass[c][ptr[c]]['hsiShrimp'] == S[k]]
    if len(cands) != 1: amb += 1
    c = cands[0]
    p = byclass[c][ptr[c]]; ptr[c] += 1
    p['hsiTuna'] = T[k]; p['order'] = k
    ordered.append(p)
print('ambiguous', amb, 'assigned', len(ordered))
for i, p in enumerate(ordered):
    p['id'] = i + 1
json.dump(ordered, open('data/points.json', 'w'), indent=1)
from collections import Counter
print(Counter(p['pfz'] for p in ordered), Counter(p['hab'] for p in ordered), Counter(p['location'] for p in ordered))
print(ordered[0])
