import os
import plistlib
import json

SAFARI_BOOKMARKS_PATH = os.path.expanduser('~/Library/Safari/Bookmarks.plist')

def extract_bookmarks(node):
    results = []
    if isinstance(node, dict):
        if node.get('WebBookmarkType') == 'WebBookmarkTypeLeaf':
            url = node.get('URLString')
            title = node.get('URIDictionary', {}).get('title') or node.get('WebBookmarkTitle')
            if url and not url.startswith('javascript:') and not url.startswith('file:'):
                results.append({'title': title, 'url': url})
        children = node.get('Children', [])
        for child in children:
            results.extend(extract_bookmarks(child))
    return results

def main():
    if not os.path.exists(SAFARI_BOOKMARKS_PATH):
        print("Error: Safari Bookmarks file not found.")
        return

    try:
        with open(SAFARI_BOOKMARKS_PATH, 'rb') as f:
            pl = plistlib.load(f)
            bookmarks = extract_bookmarks(pl)
            print(f"SUCCESS! Extracted {len(bookmarks)} Safari Bookmarks:\n")
            for b in bookmarks:
                print(f"- {b['title']}: {b['url']}")
    except PermissionError:
        print("PERMISSION DENIED: macOS Full Disk Access is required.")

if __name__ == '__main__':
    main()
