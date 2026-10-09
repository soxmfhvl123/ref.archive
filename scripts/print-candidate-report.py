import json

with open('./scratch_clean_candidates.json', 'r', encoding='utf-8') as f:
    candidates = json.load(f)

grouped = {}
for c in candidates:
    cat = c['category']
    if cat not in grouped:
        grouped[cat] = []
    grouped[cat].append(c)

print(f"=== FULL BOOKMARK AUDIT REPORT ({len(candidates)} NEW CANDIDATES) ===\n")
for cat, items in grouped.items():
    print(f"### [{cat}] ({len(items)}개)")
    for i, item in enumerate(items, 1):
        print(f"  {i}. {item['title']} ({item['domain']}) -> {item['url']}")
    print()
