import os
import plistlib
import json

SAFARI_BOOKMARKS_PATH = os.path.expanduser('~/Library/Safari/Bookmarks.plist')

# Categorization rules
EXCLUDE_DOMAINS = [
    'google.com', 'youtube.com', 'github.com', 'naver.com', 'daum.net', 'blog.naver.com',
    'hbomax.com', 'moviekids.tv', 'mybinoo.app', 'sound-cloud.com', 'soundcloud.com',
    'humoruniv.com', 'ssulcast.co.kr', 'mt-ssul.com', 'footsell.com', 'kreplay.com',
    'battle.net', 'd-c.kr', 'weebly.com', 'merriam-webster.com', 'myenglishteacher.eu',
    'nytimes.com', 'twitch.tv', 'nelson.com', 'entrepreneur.com', 'coloso.co.kr',
    'fastcampus.co.kr', 'amazon.com', 'casemuseum.com', 'pinterest.ca', 'pinterest.com',
    'cricut.com', 'trendhunter.com', 'studyinthestates.dhs.gov', 'archive.org',
    'snapchat.com', 'gpters.org', 'wikipedia.org', 'facebook.com', 'instagram.com',
    'twitter.com', 'x.com', 'linkedin.com', 'notion.so', 'figma.com', 'slack.com'
]

def extract_bookmarks(node):
    results = []
    if isinstance(node, dict):
        if node.get('WebBookmarkType') == 'WebBookmarkTypeLeaf':
            url = node.get('URLString', '')
            title = node.get('URIDictionary', {}).get('title') or node.get('WebBookmarkTitle', '')
            if url and not url.startswith('javascript:') and not url.startswith('file:'):
                results.append({'title': title.strip(), 'url': url.strip()})
        children = node.get('Children', [])
        for child in children:
            results.extend(extract_bookmarks(child))
    return results

def is_design_candidate(url, title):
    url_lower = url.lower()
    title_lower = title.lower()

    for dom in EXCLUDE_DOMAINS:
        if dom in url_lower:
            return False

    if any(k in url_lower or k in title_lower for k in [
        'design', 'studio', 'archive', 'foundry', 'font', 'art', 'type', 'creative',
        'media', 'identity', 'brand', 'interactive', 'graphic', 'portfolio', 'gallery',
        'visual', 'exhibition', 'material', 'craft', 'edition', 'editorial', 'cmf',
        'motion', 'kinetic', 'webgl', '3d', 'shader', 'work', 'project', 'agency',
        'museum', 'space', 'architecture', 'lab', 'dev', 'form'
    ]):
        return True

    return False

def main():
    if not os.path.exists(SAFARI_BOOKMARKS_PATH):
        print("Bookmarks file not found.")
        return

    with open(SAFARI_BOOKMARKS_PATH, 'rb') as f:
        pl = plistlib.load(f)
        raw_bookmarks = extract_bookmarks(pl)

    seen = set()
    kept = []
    excluded = []

    for item in raw_bookmarks:
        url = item['url']
        if url in seen:
            continue
        seen.add(url)

        if is_design_candidate(url, item['title']):
            kept.append(item)
        else:
            excluded.append(item)

    print(f"Total Unique Bookmarks Audited: {len(seen)}")
    print(f"Candidates to KEEP (IN): {len(kept)}")
    print(f"Filtered out (OUT): {len(excluded)}")

    output_data = {
        'kept': kept,
        'excluded_count': len(excluded),
    }

    with open('./scratch_audit_results.json', 'w', encoding='utf-8') as out_f:
        json.dump(output_data, out_f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
