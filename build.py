#!/usr/bin/env python3
"""Compila la web protegida.  Uso:  python3 build.py
Lee  index.fuente.html y butterflies.fuente.js  (código legible, NO se publica)
y genera  ../index.html y ../butterflies.js  (versión protegida, esta sí se publica)."""
import re, base64, os
D = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.dirname(D)

def pack(js):
    key = os.urandom(8); raw = js.encode('utf-8')
    blob = base64.b64encode(key + bytes(b ^ key[i % 8] for i, b in enumerate(raw))).decode()
    return ('!function(p){var b=atob(p),k=b.slice(0,8),s=new Uint8Array(b.length-8),i;'
            'for(i=8;i<b.length;i++)s[i-8]=b.charCodeAt(i)^k.charCodeAt((i-8)%8);'
            'var e=document.createElement("script");e.text=new TextDecoder().decode(s);document.head.appendChild(e).remove()}("%s")' % blob)

def css_min(c):
    c = re.sub(r'/\*.*?\*/', '', c, flags=re.S); c = re.sub(r'\s+', ' ', c)
    return re.sub(r'\s*([{};,])\s*', r'\1', c).strip()

html = open(f'{D}/index.fuente.html', encoding='utf-8').read()
# 1) JavaScript -> empaquetado y cifrado (se deja el JSON-LD y los scripts externos tal cual)
html = re.sub(r'<script(?![^>]*\bsrc=)(?![^>]*ld\+json)([^>]*)>(.*?)</script>',
              lambda m: '<script>%s</script>' % pack(m.group(2)) if m.group(2).strip() else m.group(0), html, flags=re.S)
# 2) CSS minificado
html = re.sub(r'(<style[^>]*>)(.*?)(</style>)', lambda m: m.group(1) + css_min(m.group(2)) + m.group(3), html, flags=re.S)
# 3) HTML sin comentarios ni sangrías
html = re.sub(r'<!--(?!\[).*?-->', '', html, flags=re.S)
html = re.sub(r'\n[ \t]+', '\n', html); html = re.sub(r'\n{2,}', '\n', html)
open(f'{OUT}/index.html', 'w', encoding='utf-8').write(html)
open(f'{OUT}/butterflies.js', 'w', encoding='utf-8').write(pack(open(f'{D}/butterflies.fuente.js', encoding='utf-8').read()))
print('Listo ->', f'{OUT}/index.html', f'({len(html)//1024} KB)')
