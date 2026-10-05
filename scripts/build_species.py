import json, re
G = [
 ("Sharks", r"shark|dogfish|hammerhead"),
 ("Rays, Skates & Chimaeras", r"\bray\b|skate|stingray|chimaera|ratfish|rabbitfish"),
 ("Tuna, Mackerel & Billfish", r"tuna|marlin|sailfish|swordfish|wahoo|mackerel|mahi"),
 ("Deep-sea & Cold Water", r"roughy|oreopoly|grenadier|alfonsino|tilefish|opah|escolar|oilfish|toothfish|chilean|lanternfish|viperfish|deepsea|sablefish|wolffish|ocean perch|rockfish|lingcod|ocean pout|monkfish|anglerfish|cabezon"),
 ("Cod & Flatfish", r"\bcod\b|pollock|haddock|halibut|flounder|sole|turbot|fluke"),
 ("Herring, Sardines & Anchovies", r"herring|sardine|pilchard|anchov|menhaden|hilsa"),
 ("Snappers, Groupers & Seabass", r"snapper|grouper|coral trout|seabass|sea bass|barramundi|seabream|snook|bonefish|cobia|amberjack|seabream|sheepshead|scup|dentex|bocaccio"),
 ("Reef & Ornamental Fish", r"tang|clownfish|angel|trigger|parrot|wrasse|gramma|damsel|sergeant|garibaldi|seahorse|seadragon|butterfly|moorish|trumpet|trunk|porcupine|puffer|cornet|squirrel|soldier|lionfish|stonefish|scorpionfish|moray|sheephead|batfish|peacock"),
 ("Coastal & Estuarine Fish", r"drum|croaker|weakfish|seatrout|mullet|ladyfish|milkfish|tripletail|toadfish|midshipman|robin|gurnard|needlefish|halfbeak|flyingfish|remora|sharksucker|eel|bluefish|tarpon|permit|pompano|trevally|jack|crevalle|lookdown|threadfin|barracuda|dory|sunfish|salmon|sea robin"),
]
out = []
for i, line in enumerate(open('scripts/species_raw.txt').read().strip().split('\n'), 1):
    name, sci, do, t, ph, chl = line.split(';')
    rng = lambda s: [float(x) for x in re.match(r'^(-?[\d.]+)-(-?[\d.]+)$', s).groups()]
    do, t, ph, chl = rng(do), rng(t), rng(ph), rng(chl)
    group = next((g for g, rx in G if re.search(rx, name.lower())), "Other Marine Fish")
    tm = (t[0] + t[1]) / 2
    zone = "Polar" if tm < 5 else "Cold-water" if tm < 12 else "Temperate" if tm < 20 else "Subtropical" if tm < 25 else "Tropical"
    cm = (chl[0] + chl[1]) / 2
    prod = "Oligotrophic" if cm < 0.6 else "Mesotrophic" if cm < 1.5 else "Eutrophic"
    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    out.append(dict(id=i, slug=slug, name=name, scientific=sci, group=group, zone=zone, productivity=prod,
                    do=do, temp=t, ph=ph, chl=chl))
assert len(out) == 200 and len({o['slug'] for o in out}) == 200
json.dump(out, open('data/species.json', 'w'), indent=1)
from collections import Counter
print(Counter(o['group'] for o in out)); print(Counter(o['zone'] for o in out))
for o in out:
    if o['group'] == 'Other Marine Fish': print(o['name'])
