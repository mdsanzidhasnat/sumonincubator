#!/usr/bin/env bash
set -euo pipefail

# Re-downloads the Mongoose Studio frontend's CDN dependencies into public/studio/vendor
# so the /admin panel works fully offline. Run from server/:  bash scripts/fetch-studio-vendor.sh
#
# Source of truth: node_modules/@mongoosejs/studio/frontend/public/index.html

cd "$(dirname "$0")/.."

VENDOR="public/studio/vendor"
mkdir -p "$VENDOR/fonts" "$VENDOR/images"

fetch() {
  curl -sL --fail -o "$1" "$2"
  echo "downloaded $1 ($(wc -c < "$1") bytes)"
}

fetch "$VENDOR/vue.global.prod.js"         https://unpkg.com/vue@3.x/dist/vue.global.prod.js
fetch "$VENDOR/vue-router.global.prod.js"  https://unpkg.com/vue-router@4.0.10/dist/vue-router.global.prod.js
fetch "$VENDOR/chart.umd.js"               https://unpkg.com/chart.js@4.2.0/dist/chart.umd.js
fetch "$VENDOR/leaflet.js"                 https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
fetch "$VENDOR/leaflet.css"                https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
fetch "$VENDOR/prism.js"                   https://unpkg.com/prismjs@1.29.0/prism.js
fetch "$VENDOR/prism.css"                  https://unpkg.com/prismjs@1.29.0/themes/prism.css
fetch "$VENDOR/codemirror.js"              https://unpkg.com/codemirror@5.65.16/lib/codemirror.js
fetch "$VENDOR/codemirror-javascript.js"   https://unpkg.com/codemirror@5.65.16/mode/javascript/javascript.js

for f in layers.png layers-2x.png marker-icon.png marker-icon-2x.png marker-shadow.png; do
  fetch "$VENDOR/images/$f" "https://unpkg.com/leaflet@1.9.4/dist/images/$f"
done

# Inter font (variable font, one woff2 per unicode subset)
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
curl -sL --fail -A "$UA" \
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" \
  -o "$VENDOR/inter.css"

i=0
grep -o 'https://fonts.gstatic.com/[^)]*\.woff2' "$VENDOR/inter.css" | sort -u | while IFS= read -r u; do
  i=$((i + 1))
  curl -sL --fail -o "$VENDOR/fonts/inter-$i.woff2" "$u"
  sed -i "s|$u|fonts/inter-$i.woff2|g" "$VENDOR/inter.css"
done

# Hind Siliguri (client's Bangla UI font) — latin + bengali subsets
curl -sL --fail -A "$UA" \
  "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" \
  -o "$VENDOR/hind-siliguri.css"
j=0
grep -o 'https://fonts.gstatic.com/[^)]*\.woff2' "$VENDOR/hind-siliguri.css" | sort -u | while IFS= read -r u; do
  j=$((j + 1))
  curl -sL --fail -o "$VENDOR/fonts/hind-siliguri-$j.woff2" "$u"
  sed -i "s|$u|fonts/hind-siliguri-$j.woff2|g" "$VENDOR/hind-siliguri.css"
done

echo "vendor assets refreshed in $VENDOR"
