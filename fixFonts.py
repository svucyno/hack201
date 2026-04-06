import os

def shrink_fonts(filepath):
    print(f"Checking {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f: content = f.read()
    orig = content
    content = content.replace('text-[18px]', 'text-[14px]')
    content = content.replace('text-[16px]', 'text-[13px]')
    content = content.replace('text-[15px]', 'text-[12px]')
    content = content.replace('text-[14px]', 'text-[11px]')
    content = content.replace('text-[13px]', 'text-[11px]')
    content = content.replace('text-[12px]', 'text-[10px]')
    content = content.replace('text-3xl', 'text-2xl')
    
    if orig != content:
        with open(filepath, 'w', encoding='utf-8') as f: f.write(content)
        print(f'Updated {filepath}')

for root, _, files in os.walk(r'c:\Stark industries\CYNO\hack201'):
    if 'node_modules' in root or '.next' in root: continue
    for f in files:
        if f.endswith('.js'): shrink_fonts(os.path.join(root, f))
